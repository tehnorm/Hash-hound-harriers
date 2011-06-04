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

		try {
			if ($request->data) {
				parse_str($request->data, $params);

				$device_id = (isset($params["device_id"])) ? $params["device_id"] : null;
				$lat = (isset($params["lat"]) && is_numeric($params["lat"])) ? floatval($params["lat"]) : null;
				$long = (isset($params["long"]) && is_numeric($params["long"])) ? floatval($params["long"]) : null;
				$name = (isset($params["name"])) ? $params["name"] : null;
				$email = (isset($params["email"])) ? $params["email"] : null;

				if ($device_id != null && $lat != null && $long != null && $name != null && $email != null) {
					$response->code = Response::OK;
					$response->addHeader("Content-Type", "text/plain");
					$response->body = "Creating a User with: $device_id, $lat, $long, $name, $email";
				} else {
					$response->code = Response::BADREQUEST;
					$response->addHeader("Content-Type", "text/plain");
					$response->body = "Expected device_id, lat, long, name, email";
				}
			} else {
				$response->code = Response::BADREQUEST;
				$response->addHeader("Content-Type", "text/plain");
				$response->body = "Expected device_id, lat, long, name, email";
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

		try {
			if ($response->data) {
				parse_str($request->data, $params);
				$response->code = Response::OK;
				$response->addHeader("Content-Type", "text/plain");
				$response->body = "Checking the User's Location";
			} else {
				$response->code = Response::BADREQUEST;
				$response->addHeader("Content-Type", "text/plain");
				$response->body = "Expected game_id, user_id, lat, long";
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