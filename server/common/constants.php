<?php
// Database Constants
define("DB_SERVER", "127.0.0.1:27017");
define("DB_DATABASE", "hhh");
define("DB_USER_COLLECTION", "users");
define("DB_GAME_COLLECTION", "games");

// Standard Error Messages
define("BAD_API_PATH", "No API method matches your request");
define("INTERNAL_SERVER_ERROR", "There was an unforeseen error");

// Game Constants
define("GEO_MAX_DISTANCE", 50);	// in meters
define("GEO_EARTH_RADIUS", 6378000); // in meters
?>