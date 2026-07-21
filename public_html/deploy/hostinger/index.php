<?php
/**
 * Laravel - A PHP Framework For Web Artisans
 *
 * @package  Laravel
 * @author   Taylor Otwell <taylor@laravel.com>
 *
 * ---------------------------------------------------------------------------
 * HOSTINGER SHARED-HOSTING VARIANT — public/ folder AS the document root
 * ---------------------------------------------------------------------------
 * This is a copy of public_html/public/index.php with ONLY the two require
 * paths below changed, from "../vendor/..." / "../bootstrap/..." (one level
 * up) to "../laravel_app/vendor/..." / "../laravel_app/bootstrap/..." (one
 * level up, then into the sibling app folder).
 *
 * This file is meant to REPLACE the default index.php Hostinger's hPanel
 * File Manager places inside your account's real public_html/ document root,
 * once the rest of the Laravel app has been uploaded to a SIBLING folder
 * named "laravel_app" (i.e. one level above public_html/, not inside it —
 * see DEPLOYMENT_HOSTINGER.md for the full folder layout and upload steps).
 *
 * If you name the sibling folder something other than "laravel_app", update
 * the two require paths below to match.
 */

define('LARAVEL_START', microtime(true));

if (in_array($_SERVER['REQUEST_METHOD'] ?? 'GET', ['GET', 'HEAD'], true)) {
    $accept = $_SERVER['HTTP_ACCEPT'] ?? '';
    $uri = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) ?: '/';
    $isPageRequest = str_contains($accept, 'text/html') || $accept === '';
    $isBackendRoute = preg_match('#^/(api|bridge)(/|$)#', $uri);

    if ($isPageRequest && ! $isBackendRoute) {
        $frontendUrl = rtrim(getenv('PREMIUM_FRONTEND_URL') ?: 'https://hogzat.vercel.app', '/');
        $query = $_SERVER['QUERY_STRING'] ?? '';
        $target = $frontendUrl . $uri . ($query !== '' ? '?' . $query : '');

        header('Location: ' . $target, true, 302);
        exit;
    }
}

/*
|--------------------------------------------------------------------------
| Register The Auto Loader
|--------------------------------------------------------------------------
|
| Composer provides a convenient, automatically generated class loader for
| our application. We just need to utilize it! We'll simply require it
| into the script here so that we don't have to worry about manual
| loading any of our classes later on. It feels great to relax.
|
*/

require __DIR__.'/../laravel_app/vendor/autoload.php';

/*
|--------------------------------------------------------------------------
| Turn On The Lights
|--------------------------------------------------------------------------
|
| We need to illuminate PHP development, so let us turn on the lights.
| This bootstraps the framework and gets it ready for use, then it
| will load up this application so that we can run it and send
| the responses back to the browser and delight our users.
|
*/

$app = require_once __DIR__.'/../laravel_app/bootstrap/app.php';

/*
|--------------------------------------------------------------------------
| Run The Application
|--------------------------------------------------------------------------
|
| Once we have the application, we can handle the incoming request
| through the kernel, and send the associated response back to
| the client's browser allowing them to enjoy the creative
| and wonderful application we have prepared for them.
|
*/

$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);

$response = $kernel->handle(
    $request = Illuminate\Http\Request::capture()
);

$response->send();

$kernel->terminate($request, $response);

