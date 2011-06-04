<?php
/**
 * The User Resource
 * @uri /user
 */

class UserResource extends Resource {
	function get($request) {
		$response = new Response($request);
		$response->code = Response::OK;
		$response->addHeader('content-type', 'text/plain');
		$response->body = "This is a user.";
		return $response;
	}
}
?>