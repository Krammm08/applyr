<?php

declare(strict_types=1);

require_once __DIR__ . '/../../config.php';

function createSessionToken(string $applicantId): string
{
    return $applicantId;
}

function validateSessionToken(PDO $db, string $token): ?array
{
    $statement = $db->prepare(
        'SELECT applicantId, emailAddress, applicantName '
        . 'FROM Applicant '
        . 'WHERE applicantId = :applicantId LIMIT 1'
    );
    $statement->execute(['applicantId' => $token]);
    $session = $statement->fetch();

    if (!$session) {
        return null;
    }

    return [
        'applicant_id' => (string)$session['applicantId'],
        'email' => (string)$session['emailAddress'],
        'name' => (string)$session['applicantName'],
    ];
}
