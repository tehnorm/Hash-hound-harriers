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

						$game = $games->findOne(array("_id" => $gameID));

						if (isset($game)) {
							$max_distance = GEO_MAX_DISTANCE / GEO_EARTH_RADIUS;

							$geo_result = $db->command(
								array(
									"geoNear" 						=> "points",
									"query" 							=> array(
										"game-id" => $gameID
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
							}

							$response->code = Response::OK;
							$response->addHeader("Content-Type", "application/json");
							$response->body = json_encode($point);
						} else {
							$response->code = Response::NOTFOUND;
							$response->addHeader("Content-Type", "text/plain");
							$response->body = "Could not find the Game";
						}
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