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
		
	}

	/**
	 * Routes POST requests to the appropriate API function
	 */
	function post($request) {

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
		
	}
	/**
	 * Gets a Game
	 *
	 * GET /game/{id}
	 *  output: HTTP OK + game (if successful),
	 *					HTTP NOTFOUND (if not game exists for that id),
	 *					HTTP INTERNALSERVERERROR (if unforeseen error)
	 */
	function get_game($request) {
		
	}

	/**
	 * Adds a point to the game
	 *
	 * POST /game/point
	 *   input: game_id, type, lat, long, direction
	 *  output: HTTP OK (if successful),
	 *					HTTP BADREQUEST (if incorrect params),
	 *					HTTP NOTFOUND (if no game exists for that id),
	 *					HTTP INTERNALSERVERERROR (if unforeseen error)
	 */
	function add_point($request) {
		
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
		
	}
}
?>