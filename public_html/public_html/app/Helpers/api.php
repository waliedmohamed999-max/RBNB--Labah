<?php

use ReallySimpleJWT\Token;

// Resolves the legacy mobile-API JWT secret from config (backed by the
// LEGACY_API_JWT_SECRET env var). Refuses to operate in production if it is
// missing or too short instead of silently falling back to a weak/default value.
function legacy_api_jwt_secret()
{
    $secret = config('services.legacy_api.jwt_secret');

    if (empty($secret) || strlen($secret) < 32) {
        if (app()->environment('production')) {
            abort(500, 'LEGACY_API_JWT_SECRET is not configured. Set a strong, random secret (32+ characters) in the environment before running in production.');
        }

        throw new \RuntimeException(
            'LEGACY_API_JWT_SECRET is not configured or is too short (must be at least 32 random characters). ' .
            'Set it in your .env file before using the legacy mobile API token endpoints.'
        );
    }

    return $secret;
}

function api_token_valid($token)
{
    $secret = legacy_api_jwt_secret();
    $token_expired = Token::validate($token, $secret);

    $user = new \App\Models\User();

    return (!$token_expired) ? false : $user->getUserByApiToken($token);
}

function get_user_by_access_token($token)
{
    return api_token_valid($token);
}

function create_api_token($user_id)
{
    $lifetime = get_api_lifetime();
    $secret = legacy_api_jwt_secret();
    $expiration = time() + $lifetime;
    $issuer = 'localhost';

    return Token::create($user_id, $secret, $expiration, $issuer);
}

function get_api_lifetime()
{
    $api_lifetime = (int)get_opt('api_lifetime', 30);
    $api_lifetime_type = get_opt('api_lifetime_type', 'day');
    switch ($api_lifetime_type) {
        case 'day':
        default:
            return $api_lifetime * 24 * 60 * 60;
        case 'hour':
            return $api_lifetime * 60 * 60;
        case 'minute':
            return $api_lifetime * 60;
        case 'seconds':
            return $api_lifetime;
    }
}
