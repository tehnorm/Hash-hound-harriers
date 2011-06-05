<?php
/**
 * Game
 *
 * @uri /game(/.*)?
 */
class GameResource extends Resource {
	/**
	 * Routes GET requests to the appropriate API function
	 */
	function get($request) {
		$response = new Response($request);

		if (preg_match("/\/game(\/(?P<id>.*))?/", $request->uri, $matches)) {
			if (is_string($matches["id"])) {
				$id = $matches["id"];
				$response = $this->get_game($request, $id);
			} else {
				$response->code = Response::BADREQUEST;
				$response->addHeader("Content-Type", "text/plain");
				$response->body = "Expected an id";
			}
		} else {
			$response->code = Response::BADREQUEST;
			$response->addHeader("Content-Type", "text/plain");
			$response->body = BAD_API_PATH;
		}

		return $response;
	}

	/**
	 * Routes POST requests to the appropriate API function
	 */
	function post($request) {
		$response = new Response($request);

		if (preg_match("/\/game$/", $request->uri, $matches)) {
			$response = $this->create_game($request);
		} elseif (preg_match("/\/game\/add_point$/", $request->uri, $matches)) {
			$response = $this->add_point($request);
		} elseif (preg_match("/\/game\/add_user$/", $request->uri, $matches)) {
			$response = $this->add_user($request);
		} elseif (preg_match("/\/game\/start$/", $request->uri, $matches)) {
			$response = $this->game_start($request);
		} else {
			$response->code = Response::BADREQUEST;
			$response->addHeader("Content-Type", "text/plain");
			$response->body = BAD_API_PATH;
		}

		return $response;
	}


	/**
	 * Creates a Game
	 *
	 * POST /game
	 *  output: HTTP OK + game (if successful),
	 *					HTTP BADREQUEST (if incorrect params),
	 *					HTTP INTERNALSERVERERROR (if unforeseen error)
	 */
	function create_game($request) {
		$response = new Response($request);

		$bad_request_response = new Response($request);
		$bad_request_response->code = Response::BADREQUEST;
		$bad_request_response->addHeader("Content-Type", "text/plain");
		$bad_request_response->body = "";
    
		try {
			$response->code = Response::OK;
			$response->addHeader("Content-Type", "text/plain");
			$response->body = "Creating a new Game";

      $data = file_get_contents("php://input");
      if ($data) {
        try {
          $params = json_decode($data);
					
          if (!isset($params->{"name"})) throw new Exception("Missing name");     
          $game_data = array("name" => $params->{"name"});
          
          $mongo = new Mongo(DB_SERVER);
          $db = $mongo->hhh;
          $game_collection = $db->games;
          $game_collection->insert($game_data, true);
          $game_data = $game_data["_id"];

					$response->code = Response::OK;
					$response->addHeader("Content-Type", "application/json");
					$response->body = json_encode($game_data->_id);

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
	 * Gets a Game
	 *
	 * GET /game/{id}
	 *  output: HTTP OK + game (if successful),
	 *					HTTP NOTFOUND (if not game exists for that id),
	 *					HTTP INTERNALSERVERERROR (if unforeseen error)
	 */
	function get_game($request, $id) {
		$response = new Response($request);
		
		$bad_request_response = new Response($request);
		$bad_request_response->code = Response::BADREQUEST;
		$bad_request_response->addHeader("Content-Type", "text/plain");
		$bad_request_response->body = "Expected id";

    try{
      $mongo = new Mongo(DB_SERVER);
      $db = $mongo->hhh;
      $game_collection = $db->games;
      $mongo_game_id = new MongoId($id);
      $game = $game_collection->findOne(array("_id" => $mongo_game_id));

      $response->code = Response::OK;
      $response->addHeader("Content-Type", "application/json");
      $response->body = json_encode($game);
		} catch (Exception $e) {
			$response->code = Response::INTERNALSERVERERROR;
			$response->addHeader("Content-Type", "text/plain");
			$response->body = INTERNAL_SERVER_ERROR;
		}

		return $response;
	}

	/**
	 * Adds a point to the game
	 *
	 * POST /game/point
	 *   input: game_id, type, latitude, longitude, direction
	 *  output: HTTP OK (if successful),
	 *					HTTP BADREQUEST (if incorrect params),
	 *					HTTP NOTFOUND (if no game exists for that id),
	 *					HTTP INTERNALSERVERERROR (if unforeseen error)
	 */
	function add_point($request) {
		$response = new Response($request);

		$bad_request_response = new Response($request);
		$bad_request_response->code = Response::BADREQUEST;
		$bad_request_response->addHeader("Content-Type", "text/plain");
		$bad_request_response->body = "Expected game_id, type, latitude, longitude, direction";

		try {
			if ($request->data) {
				try {
					$params = json_decode($request->data);
				} catch (Exception $e) {
					$response = $bad_request_response;
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
	 * Adds a user to the game
	 *
	 * POST /game/user
	 *   input: game_id, user_id
	 *  output: HTTP OK (if successful),
	 *					HTTP BADREQUEST (if incorrect params),
	 *					HTTP NOTFOUND (if no game exists for that id; if no user exists for that id),
	 *					HTTP INTERNALSERVERERROR (if unforeseen error)
	 */
	function add_user($request) {
		$response = new Response($request);

		$bad_request_response = new Response($request);
		$bad_request_response->code = Response::BADREQUEST;
		$bad_request_response->addHeader("Content-Type", "text/plain");
		$bad_request_response->body = "Expected game_id, user_id";

		try {
			if ($request->data) {
				try {
					$params = json_decode($request->data);
				} catch (Exception $e) {
					$response = $bad_request_response;
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
	 * Start a game
	 *
	 * POST /game/start
	 *   input: game_id
	 *  output: HTTP OK (if successful),
	 *					HTTP BADREQUEST (if incorrect params),
	 *					HTTP NOTFOUND (if no game exists for that id; if no user exists for that id),
	 *					HTTP INTERNALSERVERERROR (if unforeseen error)
	 */
	function game_start($request) {
		$response = new Response($request);

		$bad_request_response = new Response($request);
		$bad_request_response->code = Response::BADREQUEST;
		$bad_request_response->addHeader("Content-Type", "text/plain");
		$bad_request_response->body = "Expected game_id, user_id";

		try {
			$response->code = Response::OK;
			$response->addHeader("Content-Type", "text/plain");
			$response->body = "Starting a Game";

      $data = file_get_contents("php://input");
      if ($data) {
        try {
          $params = json_decode($data);

          if (!isset($params->{"game_id"})) throw new Exception("Missing game_id");     
          
          $mongo = new Mongo(DB_SERVER);
          $db = $mongo->hhh;
          $game_collection = $db->games;
          
          $mongo_game_id = new MongoId($params->{"game_id"});
          $game = $game_collection->findOne(array("_id" => $mongo_game_id));

          $game["started"] = time();

          $game_collection->update(array("_id" => $mongo_game_id), 
                                   array("started" => new MongoDate($game["started"])));

					$response->code = Response::OK;
					$response->addHeader("Content-Type", "application/json");
					$response->body = json_encode($game);

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