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
	 *   input: device_id, lat, long, name, email
	 *  output: HTTP OK + user_id (if successful),
	 *					HTTP BADREQUEST (if invalid params),
	 *					HTTP INTERNALSERVERERROR (if unforeseen error)
	 */
	function create_user($request) {
		$response = new Response($request);

		$bad_request_response = new Response($request);
		$bad_request_response->code = Response::BADREQUEST;
		$bad_request_response->addHeader("Content-Type", "text/plain");
		$bad_request_response->body = "Expected device_id, lat, long, name, email";

		try {
			$data = file_get_contents("php://input");
			if ($data) {
				try {
					$params = json_decode($data);
					
					if (!isset($params->{"device-id"})) throw new Exception("Missing device-id");
					if (!isset($params->{"current-loc"}->{"lat"}) || !is_numeric($params->{"current-loc"}->{"lat"})) throw new Exception("Missing lat or it is not numeric");
					if (!isset($params->{"current-loc"}->{"long"}) || !is_numeric($params->{"current-loc"}->{"long"})) throw new Exception("Missing long or it is not numeric");

					$user_data = array(
						"device-id" => $params->{"device_id"},
						"current-loc" => array(
							"lat"  => floatval($params->{"current-loc"}->{"lat"}),
							"long" => floatval($params->{"current-loc"}->{"long"})
						),
						"name"			=> (isset($params->{"name"})) ? $params->{"name"} : null,
						"email"			=> (isset($params->{"email"})) ? $params->{"email"} : null
					);

					$mongo = new Mongo(DB_SERVER);
					$db = $mongo->hhh;
					$user_collection = $db->users;
					$user_collection->insert($user_data);

					$user = $user_collection->findOne(array("device-id" => $params->{"device-	id"}));

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
	 *   input: game_id, user_id, lat, long
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
		$bad_request_response->body = "Expected game_id, user_id, lat, long";

		try {
			if ($response->data) {
				try {
					$params = json_decode($request->data);

					if (!isset($params->{"game_id"})) throw new Exception("Missing game_id");
					if (!isset($params->{"user_id"})) throw new Exception("Missing user_id");
					if (!isset($params->{"lat"}) || !is_numeric($params->{"lat"})) throw new Exception("Missing lat or it is not numeric");
					if (!isset($params->{"long"}) || !is_numeric($params->{"long"})) throw new Exception("Missing long or it is not numeric");

					try {
						$mongo = new Mongo(DB_SERVER);
						$db = $mongo->hhh;
						$game_collection = $db->games;

						$game = $game_collection->findOne($params->{"game_id"});

						if (isset($game)) {
							
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