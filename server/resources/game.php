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

		if (preg_match("/\/game(\/(?P<id>.*))\/points$/", $request->uri, $matches)) {
			if (is_string($matches["id"])) {
				$id = $matches["id"];
				$response = $this->get_game_points($request, $id);
			} else {
				$response->code = Response::BADREQUEST;
				$response->addHeader("Content-Type", "text/plain");
				$response->body = "Expected an id";
			}
		} elseif (preg_match("/\/game(\/(?P<id>.*))\/found_points$/", $request->uri, $matches)) {
			if (is_string($matches["id"])) {
				$id = $matches["id"];
				$response = $this->get_found_points($request, $id);
			} else {
				$response->code = Response::BADREQUEST;
				$response->addHeader("Content-Type", "text/plain");
				$response->body = "Expected an id";
			}
		} elseif (preg_match("/\/game\/list_active$/", $request->uri, $matches)) {
      $response = $this->get_active_games($request);
    } elseif (preg_match("/\/game(\/(?P<id>.*))?/", $request->uri, $matches)) {
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
		} elseif (preg_match("/\/game\/point$/", $request->uri, $matches)) {
			$response = $this->add_point($request);
		} elseif (preg_match("/\/game\/add_user$/", $request->uri, $matches)) {
			$response = $this->add_user($request);
		} elseif (preg_match("/\/game\/start$/", $request->uri, $matches)) {
			$response = $this->game_start($request);
		} elseif (preg_match("/\/game\/end$/", $request->uri, $matches)) {
			$response = $this->game_end($request);
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
	 *   input: name, user-id
	 *  output: HTTP OK + game (if successful),
	 *					HTTP BADREQUEST (if incorrect params),
	 *					HTTP INTERNALSERVERERROR (if unforeseen error)
	 */
	function create_game($request) {
		$response = new Response($request);

		$bad_request_response = new Response($request);
		$bad_request_response->code = Response::BADREQUEST;
		$bad_request_response->addHeader("Content-Type", "text/plain");
		$bad_request_response->body = "Expected name";
    
		try {
			$response->code = Response::OK;
			$response->addHeader("Content-Type", "text/plain");
			$response->body = "Creating a new Game";

      $data = file_get_contents("php://input");
      if ($data) {
        try {
          $params = json_decode($data);
					
          if (!isset($params->{"hare-id"})) throw new Exception("Missing hare-id");

          if (!isset($params->{"name"}) || $params->{"name"} === "") {
          	$adjectives = array("Spiffy","Drunk","Lost","Running","Tipsy","Inebriated","Colossal","Puny","Gigantic","Bitter","Adorable","Hopped-up","Fierce","Awesome","Brave","Victorious");
          	$nouns = array("Hares","Hounds","Hunters","Lemurs","Rabbits","Puppies","Bunnies","Dogs","Chasers","Animals","Creatures","Mammals","Wolves");

          	$adjective = $adjectives[array_rand($adjectives)];
          	$noun = $nouns[array_rand($nouns)];
          	$number = rand(0, 9999);

          	$name = "$adjective $noun $number";
          } else {
          	$name = $params->{"name"};
          }
          
          $hareID = new MongoId($params->{"hare-id"});
              
          $game_data = array(
	          "name"			=> $name,
	          "hare"			=> $hareID,
	          "co-hares"	=> array(),
	          "created"		=> new MongoDate(time()),
	          "started"		=> null,
	          "hounds"		=> array()
	         );
          
          $mongo = new Mongo(DB_SERVER);
          $db = $mongo->hhh;
          $game_collection = $db->games;
          $game_collection->insert($game_data, true);

          $game_data["id"] = (string) $game_data["_id"];
          $game_data["hare-id"] = (string) $game_data["hare"];

					$response->code = Response::OK;
					$response->addHeader("Content-Type", "application/json");
					$response->body = json_encode($game_data);
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

      $game["id"] = (string) $game["_id"];

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
	 * Gets a Game List
	 *
	 * GET /game/list_active 
	 *  output: HTTP OK + game (if successful),
	 *					HTTP NOTFOUND (if not game exists for that id),
	 *					HTTP INTERNALSERVERERROR (if unforeseen error)
	 */
	function get_active_games($request) {
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
      $games = iterator_to_array($game_collection->find(array()));
      foreach($games as $key => $game) {
        if (!isset($game["started"])){
          unset($games[$key]);
        }else{
          $games[$key]["id"] = (string)$game["_id"];
        }
      }

      $response->code = Response::OK;
      $response->addHeader("Content-Type", "application/json");
      $response->body = json_encode($games);
		} catch (Exception $e) {
			$response->code = Response::INTERNALSERVERERROR;
			$response->addHeader("Content-Type", "text/plain");
			$response->body = INTERNAL_SERVER_ERROR;
		}

		return $response;
	}


	/**
	 * Gets Points for a Game
	 *
	 * GET /game/{id}/points
	 *  output: HTTP OK + game (if successful),
	 *					HTTP NOTFOUND (if not game exists for that id),
	 *					HTTP INTERNALSERVERERROR (if unforeseen error)
	 */
	function get_game_points($request, $id) {
		$response = new Response($request);
		
		$bad_request_response = new Response($request);
		$bad_request_response->code = Response::BADREQUEST;
		$bad_request_response->addHeader("Content-Type", "text/plain");
		$bad_request_response->body = "Expected id";

    try{
      $mongo = new Mongo(DB_SERVER);
      $db = $mongo->hhh;
      $mongo_game_id = new MongoId($id);

      $points_collection = $db->points;
      $points = iterator_to_array($points_collection->find(array("game-id" => $mongo_game_id)));

      foreach($points as $key => $point) {
      	$points[$key]["id"] = (string)$point["_id"];
      }

      $response->code = Response::OK;
      $response->addHeader("Content-Type", "application/json");
      $response->body = json_encode($points);
		} catch (Exception $e) {
			$response->code = Response::INTERNALSERVERERROR;
			$response->addHeader("Content-Type", "text/plain");
			$response->body = INTERNAL_SERVER_ERROR;
		}
    
		return $response;
	}

	/**
	 * Gets Found Points for a Game
	 *
	 * GET /game/{id}/found_points
	 *  output: HTTP OK + game (if successful),
	 *					HTTP NOTFOUND (if not game exists for that id),
	 *					HTTP INTERNALSERVERERROR (if unforeseen error)
	 */
	function get_found_points($request, $id) {
		$response = new Response($request);
		
		$bad_request_response = new Response($request);
		$bad_request_response->code = Response::BADREQUEST;
		$bad_request_response->addHeader("Content-Type", "text/plain");
		$bad_request_response->body = "Expected id";

    try{
      $mongo = new Mongo(DB_SERVER);
      $db = $mongo->hhh;
      $mongo_game_id = new MongoId($id);

      $points_collection = $db->points;
      $points = iterator_to_array($points_collection->find(array("game-id" => $mongo_game_id)));
      
      foreach($points as $key => $point) {
        if (!isset($point["found-by"]) || ($point["found-by"]==array())){
          unset($points[$key]);
        }else{
          $points[$key]["id"] = (string)$point["_id"];
        }
      }

      $response->code = Response::OK;
      $response->addHeader("Content-Type", "application/json");
      $response->body = json_encode($points);
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
	 *   input: game-id, type, loc {latitude, longitude}, direction
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
		$bad_request_response->body = "Expected game-id, type, user-action, loc {latitude, longitude}, direction";

		try {
			$data = file_get_contents("php://input");
			if ($data) {
				$params = json_decode($data);

				try {
					$params = json_decode($request->data);

					if (!isset($params->{"game-id"})) throw new Exception("Missing game-id");
					if (!isset($params->{"type"})) throw new Exception("Missing type");
					if (!isset($params->{"user-action"})) throw new Exception("Missing user-action");
					if (!isset($params->{"loc"}->{"latitude"}) || !is_numeric($params->{"loc"}->{"latitude"})) throw new Exception("Missing loc{latitude} or it isn't numeric");
					if (!isset($params->{"loc"}->{"longitude"}) || !is_numeric($params->{"loc"}->{"longitude"})) throw new Exception("Missing loc{longitude} or it isn't numeric");
					
					if ($params->{"type"} === "arrow" && (!isset($params->{"direction"}) || !is_numeric($params->{"direction"}))) throw new Exception("Missing direction or it isn't numeric (it is not an optional field when type is arrow)");

					try {
						$mongo = new Mongo(DB_SERVER);
						$db = $mongo->hhh;
						$points = $db->points;

						$gameID = new MongoId($params->{"game-id"});

						$latitude = floatval($params->{"loc"}->{"latitude"});
						$longitude = floatval($params->{"loc"}->{"longitude"});

						$point_data = array(
							"game-id" => $gameID,
							"type" => $params->{"type"},
							"user-action" => $params->{"user-action"},
							"loc" => array(
								"latitude" => $latitude,
								"longitude" => $longitude
							),
							"found-by" => array()
						);

						if ($point_data["type"] === "arrow") {
							$point_data["direction"] = $params->{"direction"};
						}

						$points->insert($point_data);

						$response->code = Response::OK;
						$response->addHeader("Content-Type", "text/plain");
						$response->body = "The Point was added to the Game";
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

	/**
	 * Adds a user to the game
	 *
	 * POST /game/user
	 *   input: game-id, user-id
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
			$data = file_get_contents("php://input");
			if ($data) {
				$params = json_decode($data);
				try {
					if (!isset($params->{"game-id"})) throw new Exception("Missing game-id");
					if (!isset($params->{"user-id"})) throw new Exception("Missing user-id");

					try {
						$mongo = new Mongo(DB_SERVER);
						$db = $mongo->hhh;
						$games = $db->games;
						$users = $db->users;

						$gameID = new MongoId($params->{"game-id"});
						$userID = new MongoId($params->{"user-id"});

						$game = $games->findOne(array("_id" => $gameID));
						$user = $users->findOne(array("_id" => $userID));

						if (isset($game) && isset($user)) {
							if ($user["type"] === "hare") {
								$games->update(
									array("_id" => $gameID),
									array("hare" => $userID)
								);
							} else {
								$games->update(
									array("_id" => $gameID),
									array('$push' => array("hounds" => $userID))
								);
							}

							$response->code = Response::OK;
							$response->addHeader("Content-Type", "text/plain");
							$response->body = "Added the User to the Game";
						} elseif (!isset($game)) {
							$response->code = Response::NOTFOUND;
							$response->addHeader("Content-Type", "text/plain");
							$response->body = "Could not find the Game";
						} else {
							$response->code = Response::NOTFOUND;
							$response->addHeader("Content-Type", "text/plain");
							$response->body = "Could not find the User";
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
                                   array('$set' => array("started" => new MongoDate($game["started"]))));

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


	/**
	 * End a game
	 *
	 * POST /game/end
	 *   input: game_id
	 *  output: HTTP OK (if successful),
	 *					HTTP BADREQUEST (if incorrect params),
	 *					HTTP NOTFOUND (if no game exists for that id; if no user exists for that id),
	 *					HTTP INTERNALSERVERERROR (if unforeseen error)
	 */
	function game_end($request) {
		$response = new Response($request);

		$bad_request_response = new Response($request);
		$bad_request_response->code = Response::BADREQUEST;
		$bad_request_response->addHeader("Content-Type", "text/plain");
		$bad_request_response->body = "Expected game_id, user_id";

		try {
			$response->code = Response::OK;
			$response->addHeader("Content-Type", "text/plain");
			$response->body = "Ending a Game";

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

          $game["started"] = "ENDED";

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