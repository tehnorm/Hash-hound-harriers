<?php
/**
 * Creates a Game
 *
 * POST /game
 *  output: HTTP OK + game (if successful),
 *					HTTP BADREQUEST (if incorrect params),
 *					HTTP INTERNALSERVERERROR (if unforeseen error)
 *
 * @uri /game
 */
class GameResource extends Resource {
	function post($request) {
	}
}

/**
 * Gets a Game
 *
 * GET /game/{id}
 *  output: HTTP OK + game (if successful),
 *					HTTP NOTFOUND (if not game exists for that id),
 *					HTTP INTERNALSERVERERROR (if unforeseen error)
 *
 * @uri /game/(.*)+
 */
class GameResource extends Resource {
	function get($request, $id) {
	}
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
 *
 * @uri /game/point
 */
class GameResource extends Resource {
	function post($request) {
	}
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
 *
 * @uri /game/user
 */
class GameResource extends Resource {
	function post($request) {
	}
}
?>