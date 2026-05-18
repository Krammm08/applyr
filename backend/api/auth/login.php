<?php

declare(strict_types=1);

require_once __DIR__ . '/../../index.php';
require_once __DIR__ . '/../../database.php';
require_once __DIR__ . '/session.php';

$input = readJsonInput();
$email = trim((string)($input['email'] ?? ''));
$password = (string)($input['password'] ?? '');

if ($email === '' || $password === '') {
    jsonResponse(422, [
        'success' => false,
        'message' => 'Email and password are required.',
    ]);
}

try {
    $db = getDatabaseConnection();
    $statement = $db->prepare(
        'SELECT applicantId, applicantName, emailAddress, passwordHash FROM Applicant WHERE emailAddress = :email'
    );
    $statement->execute(['email' => $email]);
    $user = $statement->fetch();

    if (!$user || !password_verify($password, (string)$user['passwordHash'])) {
        jsonResponse(401, [
            'success' => false,
            'message' => 'Invalid credentials.',
        ]);
    }

    $token = createSessionToken((string)$user['applicantId']);

    jsonResponse(200, [
        'success' => true,
        'data' => [
            'token' => $token,
            'user' => [
                'id' => (string)$user['applicantId'],
                'email' => (string)$user['emailAddress'],
                'name' => (string)$user['applicantName'],
            ],
        ],
    ]);
} catch (Throwable $error) {
    jsonResponse(500, [
        'success' => false,
        'message' => 'Login failed.',
    ]);
}
