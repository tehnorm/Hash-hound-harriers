<?php

// load Tonic library (DO NOT MODIFY)
require_once '../lib/tonic.php';

// load common files
require_once '../common/constants.php';

// load API resources
require_once '../resources/user.php';
require_once '../resources/game.php';

// handle request (DO NOT MODIFY)
$request = new Request();
try {
    $resource = $request->loadResource();
    $response = $resource->exec($request);

} catch (ResponseException $e) {
    switch ($e->getCode()) {
    case Response::UNAUTHORIZED:
        $response = $e->response($request);
        $response->addHeader('WWW-Authenticate', 'Basic realm="Tonic"');
        break;
    default:
        $response = $e->response($request);
    }
}
$response->output();

?>