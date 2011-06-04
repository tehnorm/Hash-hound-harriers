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
		} elseif (preg_match("/\/user\/check_location/", $request->uri, $matches)) {
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
	 *  output: HTTP OK + user_id (if successful),
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
					$user_collection = $db->users;
					$user_collection->insert($user_data);

					$user = $user_collection->findOne(array("device-id" => $params->{"device-id"}));

					$response->code = Response::OK;
					$response->addHeader("Content-Type", "application/json");
					$response->body = json_encode($user);
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
	 *   input: game-id, user-id, latitude, longitude
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
		$bad_request_response->body = "Expected game-id, user-id, latitude, longitude";

		try {
			if ($response->data) {
				try {
					$params = json_decode($request->data);

					if (!isset($params->{"game-id"})) throw new Exception("Missing game-id");
					if (!isset($params->{"user-id"})) throw new Exception("Missing user-id");
					if (!isset($params->{"latitude"}) || !is_numeric($params->{"latitude"})) throw new Exception("Missing latitude or it is not numeric");
					if (!isset($params->{"longitude"}) || !is_numeric($params->{"longitude"})) throw new Exception("Missing longitude or it is not numeric");

					try {
						$mongo = new Mongo(DB_SERVER);
						$db = $mongo->hhh;
						$game_collection = $db->games;

						$game = $game_collection->findOne($params->{"game-id"});

						if (isset($game)) {
							$points = $db->command(
								array(
									"geoNear" => "games.points.loc",
									"near"		=> array(
																"latitude" => $params->{"loc"}->{"latitude"},
																"longitude" => $params->{"loc"}->{"longitude"}
																),
									"num"			=> 1
								)
							);
						} else {
							$response->code = Response::NOTFOUND;
							$response->addHeader("Content-Type: text/plain");
							$response->body = "No Game could be found";
						}
					} catch (Exception $e) {
						$response->code = Response::INTERNALSERVERERROR;
							$response->addHeader("Content-Type: text/plain");
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