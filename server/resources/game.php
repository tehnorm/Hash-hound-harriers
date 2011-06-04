<?php
/**
 * The Game Resource
 * @uri /game
 */

class GameResource extends Resource {
	function get($request) {
		$response = new Response($request);
		$response->code = Response::OK;
		$response->addHeader('content-type', 'text/plain');
		$response->body = "This is a game.";
		return $response;
	}
}
?>