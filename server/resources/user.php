<?php
/**
 * Creates a user
 *
 * POST /user
 *   input: device_id, lat, long, name, email
 *  output: user_id (if successful) HTTP 411 LENGTHREQUIRED (if no params)
 *
 * @uri /user
 */

class UserResource extends Resource {
	function post($request) {
	}
}

/**
 * Allows the user to check their location against available points (also updates the user's location)
 *
 * POST /user/check_location
 *   input: game_id, user_id, lat, long
 *  output: point
 *
 * @uri /user/check_location
 */
class UserResource extends Resource {
	function post($request) {
	}
}
?>