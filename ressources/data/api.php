<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Choisir le fichier selon la requête (par ex: ?type=user ou ?type=match)
$type = isset($_GET['type']) ? $_GET['type'] : 'user'; // par défaut: user
$fileMap = [
    'user' => 'user.json',
    'match' => 'match.json',
    'bet' => 'bet.json'
];

// Vérifier le fichier demandé
if (!isset($fileMap[$type])) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Type de données invalide']);
    exit;
}

$filePath = $fileMap[$type];

if (!file_exists($filePath)) {
    echo "Fichier $filePath non trouvé.";
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // ✅ Lire les données
    $data = json_decode(file_get_contents($filePath), true);
    if(!is_array($data)){
        $data = [];
    }
    echo json_encode(['status' => 'success', 'data' => $data]);

}elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    
    $input = json_decode(file_get_contents('php://input'), true);

    if($type === 'user'){
        
    }else if($type === 'match'){
        if (isset($input['action']) && $input['action'] === 'NVMATCH'){
            $newMatch = [
                'id' => uniqid(),
                'team' => htmlspecialchars($input['team']),
                'adversaire' => htmlspecialchars($input['adversaire']),
                'time' => htmlspecialchars($input['time']),
                'date' => htmlspecialchars($input['date']),
                'score' => ['home' => 0, 'away' => 0],
                'betwinner' => null
            ];
            $data = json_decode(file_get_contents($filePath), true);
            $data[] = $newMatch;
            file_put_contents($filePath, json_encode($data, JSON_PRETTY_PRINT));
            echo json_encode(['status' => 'success', 'message' => 'Match ajouté', 'match' => $newMatch]);
            exit;
        }else if (isset($input['action']) && $input['action'] === 'MDMATCH'){
            $newMatch = [
                'id' => htmlspecialchars($input['id']),
                'team' => htmlspecialchars($input['team']),
                'adversaire' => htmlspecialchars($input['adversaire']),
                'time' => htmlspecialchars($input['time']),
                'date' => htmlspecialchars($input['date']),
                'score' => ['home' => 0, 'away' => 0],
                'betwinner' => null
            ];
            $data = json_decode(file_get_contents($filePath), true);
            $data[] = $newMatch;
            file_put_contents($filePath, json_encode($data, JSON_PRETTY_PRINT));
            echo json_encode(['status' => 'success', 'message' => 'Match ajouté', 'match' => $newMatch]);
            exit;
        } else if (isset($input['action']) && $input['action'] === 'BTMATCH'){
            $newMatch = [
                'id' => htmlspecialchars($input['id']),
                'team' => htmlspecialchars($input['team']),
                'adversaire' => htmlspecialchars($input['adversaire']),
                'time' => htmlspecialchars($input['time']),
                'date' => htmlspecialchars($input['date']),
                'score' => ['home' => htmlspecialchars($input['score']['home']), 'away' => htmlspecialchars($input['score']['away'])],
                'betwinner' => htmlspecialchars($input['betwinner'])
            ];
            $data = json_decode(file_get_contents($filePath), true);
            $data[] = $newMatch;
            file_put_contents($filePath, json_encode($data, JSON_PRETTY_PRINT));
            echo json_encode(['status' => 'success', 'message' => 'Match ajouté', 'match' => $newMatch]);
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
    
    }else if($type === 'bet'){
        if (isset($input['action']) && $input['action'] === 'POST'){
            $newBet = [
                'id' => uniqid(),
                'match' => htmlspecialchars($input['match']),
                'user' => htmlspecialchars($input['user']),
                'name' => htmlspecialchars($input['name']),
                'winner' => htmlspecialchars($input['winner']),
                'scoreteam1' => htmlspecialchars($input['scoreteam1']),
                'scoreteam2' => htmlspecialchars($input['scoreteam2']),
                'bestscorer' => htmlspecialchars($input['bestscorer'])
            ];
            $data = json_decode(file_get_contents($filePath), true);
            $data[] = $newBet;
            file_put_contents($filePath, json_encode($data, JSON_PRETTY_PRINT));
            echo json_encode(['status' => 'success', 'message' => 'Bet ajouté', 'bet' => $newBet]);
            exit;
        }elseif (isset($input['action']) && $input['action'] === 'BTDELETE' ) {
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
        }elseif (isset($input['action']) && $input['action'] === 'MTDELETE' ) {
            $id = $input['id'];
            
            $data = json_decode(file_get_contents($filePath), true);
            $newData = [];
            $found = false;
    
            foreach ($data as $item) {
                if ($item['match'] !== $id) {
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
