<?php

declare(strict_types=1);

require_once __DIR__ . '/../../index.php';
require_once __DIR__ . '/../../database.php';

try {
    $db = getDatabaseConnection();
    $stmt = $db->prepare('SELECT trainingId AS id, trainingTitle AS name, trainingDescription AS description, trainingDurationHours AS duration FROM Training ORDER BY trainingTitle ASC');
    $stmt->execute();
    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

    jsonResponse(200, [
        'success' => true,
        'data' => $rows,
    ]);
} catch (Throwable $e) {
    jsonResponse(500, ['success' => false, 'message' => 'Failed to fetch trainings.']);
}
