<?php

declare(strict_types=1);

require_once __DIR__ . '/../../index.php';
require_once __DIR__ . '/../auth/require_auth.php';

[$db, $user] = requireAuthUser();
$input = readJsonInput();
$jobApplicationId = trim((string)($input['jobApplicationId'] ?? ''));

if ($jobApplicationId === '') {
    jsonResponse(422, [
        'success' => false,
        'message' => 'JobApplicationId is required.',
    ]);
}

$applicantId = (string)$user['applicant_id'];

try {
    $statement = $db->prepare(
        'DELETE FROM JobApplication WHERE JobApplicationId = :jobApplicationId AND applicantId = :applicantId'
    );
    $statement->execute([
        'jobApplicationId' => $jobApplicationId,
        'applicantId' => $applicantId,
    ]);

    jsonResponse(200, [
        'success' => true,
        'data' => [
            'deleted' => $statement->rowCount() > 0,
        ],
    ]);
} catch (Throwable $error) {
    jsonResponse(500, [
        'success' => false,
        'message' => 'Application could not be deleted.',
    ]);
}
