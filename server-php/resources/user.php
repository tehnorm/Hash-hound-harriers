<?php
/**
 * User
 *
 * @uri /user(/.*)?
 */
class UserResource extends Resource {
	/**
	 * Routes POST request to the appropriate API function
	 */
	function post($request) {
		$response = new Response($request);

		if (preg_match("/\/user$/", $request->uri, $matches)) {
			$response = $this->create_user($request);
		} elseif (preg_match("/\/user\/check_location$/", $request->uri, $matches)) {
			$response = $this->check_location($request);
		} elseif (preg_match("/\/user\/found_point$/", $request->uri, $matches)) {
			$response = $this->user_found_point($request);
		} else {
			$response->code = Response::BADREQUEST;
			$response->addHeader("Content-Type", "text/plain");
			$response->body = BAD_API_PATH;
		}

		return $response;
	}

	/**
	 * Creates a user
	 *
	 * POST /user
	 *   input: device-id, current-loc {latitude, longitude}, name, email
	 *  output: HTTP OK + user (if successful),
	 *					HTTP BADREQUEST (if invalid params),
	 *					HTTP INTERNALSERVERERROR (if unforeseen error)
	 */
	function create_user($request) {
		$response = new Response($request);

		$bad_request_response = new Response($request);
		$bad_request_response->code = Response::BADREQUEST;
		$bad_request_response->addHeader("Content-Type", "text/plain");
		$bad_request_response->body = "Expected device_id, latitude, longitude, name, email";

		try {
			$data = file_get_contents("php://input");
			if ($data) {
				try {
					$params = json_decode($data);
					
					if (!isset($params->{"device-id"})) throw new Exception("Missing device-id");
					if (!isset($params->{"current-loc"}->{"latitude"}) || !is_numeric($params->{"current-loc"}->{"latitude"})) throw new Exception("Missing latitude or it is not numeric");
					if (!isset($params->{"current-loc"}->{"longitude"}) || !is_numeric($params->{"current-loc"}->{"longitude"})) throw new Exception("Missing longitude or it is not numeric");

					$user_data = array(
						"device-id" => $params->{"device-id"},
						"current-loc" => array(
							"latitude"  => floatval($params->{"current-loc"}->{"latitude"}),
							"longitude" => floatval($params->{"current-loc"}->{"longitude"})
						),
						"name"			=> (isset($params->{"name"})) ? $params->{"name"} : null,
						"email"			=> (isset($params->{"email"})) ? $params->{"email"} : null
					);

					$mongo = new Mongo(DB_SERVER);
					$db = $mongo->hhh;
					$users = $db->users;

					$users->insert($user_data);

					$user_data["id"] = (string)$user_data["_id"];

					$response->code = Response::OK;
					$response->addHeader("Content-Type", "application/json");
					$response->body = json_encode($user_data);
				} catch (Exception $e) {
					$response = $bad_request_response;
					$response->body = $e->getMessage();
				}
			} else {
				$response = $bad_request_response;
			}
		} catch (Exception $e) {
			$response->code = Response::INTERNALSERVERERROR;
			$response->addHeader("Content-Type", "text/plain");
			$response->body = INTERNAL_SERVER_ERROR;
		}

		return $response;
	}

	/**
	 * Allows the user to check their location against available points (also updates the user's location)
	 *
	 * POST /user/check_location
	 *   input: game-id, user-id, loc {latitude, longitude}
	 *  output: HTTP OK + point (if successful),
	 *					HTTP BADREQUEST (if invalid params),
	 *					HTTP NOTFOUND (if no game exists for that id; if no user exists for that id),
	 *					HTTP INTERNALSERVERERROR (if unforeseen error)
	 */
	function check_location($request) {
		$response = new Response($request);

		$bad_request_response = new Response($request);
		$bad_request_response->code = Response::BADREQUEST;
		$bad_request_response->addHeader("Content-Type", "text/plain");
		$bad_request_response->body = "Expected game-id, user-id, loc {latitude, longitude}";

		try {
			$data = file_get_contents("php://input");
			if ($data) {
				try {
					$params = json_decode($data);

					if (!isset($params->{"game-id"})) throw new Exception("Missing game-id");
					if (!isset($params->{"user-id"})) throw new Exception("Missing user-id");
					if (!isset($params->{"loc"}->{"latitude"}) || !is_numeric($params->{"loc"}->{"latitude"})) throw new Exception("Missing latitude or it is not numeric");
					if (!isset($params->{"loc"}->{"longitude"}) || !is_numeric($params->{"loc"}->{"longitude"})) throw new Exception("Missing longitude or it is not numeric");

					try {
						$mongo = new Mongo(DB_SERVER);
						$db = $mongo->hhh;
						$games = $db->games;
						$points = $db->points;

						$gameID = new MongoId($params->{"game-id"});
						$userID = new MongoId($params->{"user-id"});

						$latitude = floatval($params->{"loc"}->{"latitude"});
						$longitude = floatval($params->{"loc"}->{"longitude"});

						error_log("User ".$userID." has asked about (".$latitude.", ".$longitude.")");

						$game = $games->findOne(array("_id" => $gameID));

						if (isset($game)) {
							$max_distance = GEO_MAX_DISTANCE / GEO_EARTH_RADIUS;

							$geo_result = $db->command(
								array(
									"geoNear" 						=> "points",
									"query" 							=> array(
										"game-id" => $gameID,
										"found-by" => array('$nin' => array($userID))
									),
									"near"								=> array(
										$latitude,
										$longitude
									),
									"num"									=> 1,
									"spherical"						=> true,
									"maxDistance"					=> $max_distance
								)
							);
							error_log("Result ". var_export($geo_result, true));

							if (count($geo_result["results"]) > 0) {
								$point = $geo_result["results"][0]["obj"];
								$point["distance"] = $geo_result["results"][0]["dis"] * GEO_EARTH_RADIUS;
								if ($point["distance"] > GEO_MAX_DISTANCE) $point = null;
							} else {
								$point = null;
							}
							
							if ($point != null) {
								$points->update(
									array(
										"_id" => $point["_id"]
									),
									array(
										'$push' => array("found-by" => $userID)
									)
								);

								$point["id"] = (string) $point["_id"];

								error_log("There exists a point near the User's location");

								$response->code = Response::OK;
								$response->addHeader("Content-Type", "application/json");
								$response->body = json_encode($point);
							} else {
								error_log("There does not exist a point near the User's location");
								$response->code = Response::OK;
								$response->addHeader("Content-Type", "text/plain");
								$response->body = "There are no nearby undiscovered points";
							}
						} else {
							error_log("Could not find the Game");
							$response->code = Response::NOTFOUND;
							$response->addHeader("Content-Type", "text/plain");
							$response->body = "Could not find the Game";
						}
					} catch (Exception $e) {
						error_log("Internal Server Error: " . $e->getMessage());
						$response->code = Response::INTERNALSERVERERROR;
						$response->addHeader("Content-Type", "text/plain");
						$response->body = INTERNAL_SERVER_ERROR;
					}
				} catch (Exception $e) {
					error_log("Bad Request Error:" . $e->getMessage());
					$response = $bad_request_response;
					$response->body = $e->getMessage();
				}				
			} else {
				error_log("Bad Request Error");
				$response = $bad_request_response;
			}
		} catch (Exception $e) {
			error_log("Internal Server Error (outer): " . $e->getMessage());
			$response->code = Response::INTERNALSERVERERROR;
			$response->addHeader("Content-Type", "text/plain");
			$response->body = INTERNAL_SERVER_ERROR;
		}

		return $response;
	}

	/**
	 * Adds a user to the found-by array for the game
	 *
	 * POST /user/found_point
	 *   input: user-id, point-id
	 *  output: HTTP OK (if successful),
	 *					HTTP BADREQUEST (if incorrect params),
	 *					HTTP NOTFOUND (if no game exists for that id),
	 *					HTTP INTERNALSERVERERROR (if unforeseen error)
	 */
	function user_found_point($request) {
		$response = new Response($request);

		$bad_request_response = new Response($request);
		$bad_request_response->code = Response::BADREQUEST;
		$bad_request_response->addHeader("Content-Type", "text/plain");
		$bad_request_response->body = "Expected user-id, point-id";

		try {
			$data = file_get_contents("php://input");
			if ($data) {
				$params = json_decode($data);

				try {
					$params = json_decode($request->data);

					if (!isset($params->{"user-id"})) throw new Exception("Missing user-id");
					if (!isset($params->{"point-id"})) throw new Exception("Missing point-id");

					try {
						$mongo = new Mongo(DB_SERVER);
						$db = $mongo->hhh;
						$point_collection = $db->points;

						$user_id = new MongoId($params->{"user-id"});
						$point_id = new MongoId($params->{"point-id"});
            
            $point = $point_collection->findOne(array("_id" => $point_id));
            
            if ($point != null) {
              if (!isset($point["found-by"])) $point["found-by"] = array();

              $point["id"] = (string) $point["_id"];
            
              $point_collection->update(
									array("_id" => $point["_id"]),
									array('$push' => array("found-by" => $user_id))
								);
							}

            var_dump($point);
						$response->code = Response::OK;
						$response->addHeader("Content-Type", "text/plain");
						$response->body = "The user was added to the points found";
					} catch (Exception $e) {
						$response->code = Response::INTERNALSERVERERROR;
						$response->addHeader("Content-Type", "text/plain");
						$response->body = INTERNAL_SERVER_ERROR;
					}
				} catch (Exception $e) {
					$response = $bad_request_response;
					$response->body = $e->getMessage();
				}
			} else {
				$response = $bad_request_response;
			}
		} catch (Exception $e) {
			$response->code = Response::INTERNALSERVERERROR;
			$response->addHeader("Content-Type", "text/plain");
			$response->body = INTERNAL_SERVER_ERROR;
		}

		return $response;
	}
}
?>
