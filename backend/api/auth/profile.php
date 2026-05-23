<?php

declare(strict_types=1);

require_once __DIR__ . '/../../index.php';
require_once __DIR__ . '/../../database.php';

$input = readJsonInput();
$applicantId = trim((string)($input['applicantId'] ?? ''));

if ($applicantId === '') {
    jsonResponse(422, [
        'success' => false,
        'message' => 'ApplicantId is required.',
    ]);
    exit;
}

try {
    $db = getDatabaseConnection();
    $statement = $db->prepare(
        'SELECT applicantId, applicantName, homeAddress, phoneNumber, emailAddress, linkedInUrl, citizenshipStatus, hasCriminalHistory '
        . 'FROM Applicant '
        . 'WHERE applicantId = :applicantId LIMIT 1'
    );
    $statement->execute(['applicantId' => $applicantId]);
    $profile = $statement->fetch(PDO::FETCH_ASSOC);

    if (!$profile) {
        jsonResponse(404, [
            'success' => false,
            'message' => 'Applicant not found.',
        ]);
        exit;
    }

    jsonResponse(200, [
        'success' => true,
        'data' => $profile,
    ]);
} catch (Throwable $error) {
    jsonResponse(500, [
        'success' => false,
        'message' => 'Failed to load applicant profile.',
    ]);
}
