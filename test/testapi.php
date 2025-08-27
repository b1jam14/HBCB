<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Choisir le fichier selon la requête (par ex: ?type=user ou ?type=match)
$type = isset($_GET['type']) ? $_GET['type'] : 'user'; // par défaut: user
$fileMap = [
    'user' => 'user.json',
    'match' => 'match.json',
    'bet' => 'bet.json',
    'test' => 'test.json'
];

if (!isset($fileMap[$type])) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Type de données invalide']);
    exit;
}

$filePath = __DIR__ . '/' . $fileMap[$type];

// Debug : afficher le chemin absolu
error_log("➡️ Utilisation du fichier JSON : " . $filePath);


if (!file_exists($filePath)) {
    echo "Fichier $filePath non trouvé.";
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $data = json_decode(file_get_contents($filePath), true);
    if(!is_array($data)){
        $data = [];
    }
    echo json_encode(['status' => 'success', 'data' => $data]);
} elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    
    $input = json_decode(file_get_contents('php://input'), true);

    if($type === 'user'){
        
    }else if($type === 'test'){
        if (isset($input['action']) && $input['action'] === 'NVMATCH'){
            $newMatch = [
                'id' => uniqid(),
                'type' => 'NVMATCH',
                'text' => htmlspecialchars($input['text'])
            ];
            $data = json_decode(file_get_contents($filePath), true);
            $data[] = $newMatch;
            file_put_contents($filePath, json_encode($data, JSON_PRETTY_PRINT));
            echo json_encode(['status' => 'success', 'message' => 'Match ajouté', 'match' => $newMatch, 'path' => realpath($filePath)]);
            exit;
        }else if (isset($input['action']) && $input['action'] === 'MDMATCH'){
            $newMatch = [
                'id' => uniqid(),
                'type' => 'MDMATCH',
                'text' => htmlspecialchars($input['text'])
            ];
            $data = json_decode(file_get_contents($filePath), true);
            $data[] = $newMatch;
            file_put_contents($filePath, json_encode($data, JSON_PRETTY_PRINT));
            echo json_encode(['status' => 'success', 'message' => 'Match ajouté', 'match' => $newMatch, 'path' => realpath($filePath)]);
            exit;
        } else if (isset($input['action']) && $input['action'] === 'BTMATCH'){
            $newMatch = [
                'id' => uniqid(),
                'type' => 'BTMATCH',
                'text' => htmlspecialchars($input['text'])
            ];
            $data = json_decode(file_get_contents($filePath), true);
            $data[] = $newMatch;
            file_put_contents($filePath, json_encode($data, JSON_PRETTY_PRINT));
            echo json_encode(['status' => 'success', 'message' => 'Match ajouté', 'match' => $newMatch, 'path' => realpath($filePath)]);
            exit;
        } elseif (isset($input['action']) && $input['action'] === 'DELETE' ) {
            $id = $input['id'];
            
            $data = json_decode(file_get_contents($filePath), true);
            $newData = [];
            $found = false;
    
            foreach ($data as $item) {
                if ($item['id'] !== $id) {
                    $newData[] = $item;
                } else {
                    $found = true;
                }
            }
    
            if ($found) {
                file_put_contents($filePath, json_encode($newData, JSON_PRETTY_PRINT));
                echo json_encode(['status' => 'success', 'message' => 'Donnée supprimée', 'id' => $id]);
            } else {
                http_response_code(404);
                echo json_encode(['status' => 'error', 'message' => 'ID non trouvé']);
            }
            exit;
        }
    }
} else {
    http_response_code(405);
    echo json_encode(['status' => 'error', 'message' => 'Méthode non autorisée']);
}
?>