<?php

declare(strict_types=1);

require_once __DIR__ . '/config.php';

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: ' . CORS_ORIGIN);
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

function readJsonInput(): array
{
    $raw = file_get_contents('php://input');
    if (!$raw) {
        return [];
    }

    $payload = json_decode($raw, true);
    if (!is_array($payload)) {
        return [];
    }

    return $payload;
}

function jsonResponse(int $status, array $payload): void
{
    http_response_code($status);
    echo json_encode($payload);
    exit;
}

// Simple Router
// If index.php is included from another file (e.g. register.php accessed directly), skip routing
if (realpath(__FILE__) !== realpath($_SERVER['SCRIPT_FILENAME'])) {
    return;
}

$url = $_GET['url'] ?? '';
$url = rtrim($url, '/');
$url = filter_var($url, FILTER_SANITIZE_URL);

if ($url !== '') {
    // Determine file path
    $filePath = __DIR__ . '/' . $url;
    
    // If the path is a directory and has an index.php, use that
    if (is_dir($filePath) && file_exists($filePath . '/index.php')) {
        $filePath .= '/index.php';
    } elseif (!str_ends_with($filePath, '.php')) {
        $filePath .= '.php';
    }
    
    $realBase = realpath(__DIR__ . '/api');
    $realPath = realpath($filePath);
    
    // Only allow files inside the api directory to be required
    if ($realPath && $realBase && str_starts_with($realPath, $realBase) && file_exists($realPath)) {
        require_once $realPath;
        exit;
    } else {
        jsonResponse(404, [
            'success' => false,
            'message' => 'Endpoint not found.'
        ]);
    }
} else {
    jsonResponse(404, [
        'success' => false,
        'message' => 'No endpoint specified.'
    ]);
}
