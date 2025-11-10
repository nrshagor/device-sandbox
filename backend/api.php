
<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

$dataFile = __DIR__ . '/data.json';

// Ensure file exists
if (!file_exists($dataFile)) {
    file_put_contents($dataFile, json_encode([]));
}

$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';

if ($method === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Read current data
$data = json_decode(file_get_contents($dataFile), true);

switch ($action) {
    case 'get':
        echo json_encode($data);
        break;

    case 'save':
    $input = json_decode(file_get_contents('php://input'), true);
    if (!$input || !isset($input['name']) || !isset($input['devices']) || !is_array($input['devices'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid data format']);
        exit;
    }

    $data[] = [
        'name' => $input['name'],
        'devices' => $input['devices']
    ];

    file_put_contents($dataFile, json_encode($data, JSON_PRETTY_PRINT));
    echo json_encode(['message' => 'Preset saved']);
    break;


    case 'delete':
        $input = json_decode(file_get_contents('php://input'), true);
        if (!isset($input['name'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Missing preset name']);
            exit;
        }

        $nameToDelete = $input['name'];
        $data = array_values(array_filter($data, fn($p) => $p['name'] !== $nameToDelete));
        file_put_contents($dataFile, json_encode($data, JSON_PRETTY_PRINT));
        echo json_encode(['message' => 'Preset deleted']);
        break;

    default:
        echo json_encode(['error' => 'Invalid action']);
        break;
}
