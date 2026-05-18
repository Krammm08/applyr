<?php

declare(strict_types=1);

require_once __DIR__ . '/../../index.php';
require_once __DIR__ . '/../../database.php';
require_once __DIR__ . '/session.php';

function requireAuthUser(): array
{
    $header = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
    if (!preg_match('/Bearer\s+(.*)$/i', $header, $matches)) {
        jsonResponse(401, [
            'success' => false,
            'message' => 'Missing token.',
        ]);
    }

    $token = trim($matches[1]);
    if ($token === '') {
        jsonResponse(401, [
            'success' => false,
            'message' => 'Missing token.',
        ]);
    }

    $db = getDatabaseConnection();
    $user = validateSessionToken($db, $token);

    if (!$user) {
        jsonResponse(401, [
            'success' => false,
            'message' => 'Invalid or expired token.',
        ]);
    }

    return [$db, $user];
}
