<?php
/**
 * Page de confirmation après un paiement réussi
 * Appelée par CinetPay après paiement (return_url)
 */

// ===== CONFIGURATION BASE DE DONNÉES =====
// À modifier avec tes identifiants réels
define('DB_HOST', 'localhost');
define('DB_NAME', 'olins_db');
define('DB_USER', 'root');
define('DB_PASS', '');

try {
    $pdo = new PDO("mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8", DB_USER, DB_PASS);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die("❌ Erreur de connexion à la base de données : " . $e->getMessage());
}

// ===== RÉCUPÉRATION DES PARAMÈTRES CINETPAY =====
// CinetPay renvoie ces paramètres en GET après paiement
$transaction_id = isset($_GET['transaction_id']) ? $_GET['transaction_id'] : null;
$status = isset($_GET['status']) ? $_GET['status'] : null; // 'success' ou 'cancel'
$amount = isset($_GET['amount']) ? $_GET['amount'] : 0;
$phone = isset($_GET['phone']) ? $_GET['phone'] : '';
$plan = isset($_GET['plan']) ? $_GET['plan'] : '';
$period = isset($_GET['period']) ? $_GET['period'] : '';

// ===== VALIDATION =====
if ($status !== 'success') {
    // Si le statut n'est pas "success", on redirige vers l'annulation
    header('Location: annule.php?transaction_id=' . urlencode($transaction_id));
    exit;
}

if (empty($transaction_id)) {
    die("❌ Transaction invalide.");
}

// ===== ENREGISTREMENT DE L'ABONNEMENT =====
try {
    // Vérifier si la transaction existe déjà
    $stmt = $pdo->prepare("SELECT * FROM abonnements WHERE transaction_id = ?");
    $stmt->execute([$transaction_id]);
    $existing = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($existing) {
        // Mise à jour si déjà existant (double appel)
        $stmt = $pdo->prepare("UPDATE abonnements SET statut = 'actif', date_activation = NOW() WHERE transaction_id = ?");
        $stmt->execute([$transaction_id]);
        $message = "✅ Votre abonnement a bien été renouvelé !";
    } else {
        // Insérer un nouvel abonnement
        $date_debut = date('Y-m-d H:i:s');
        // Calculer la date de fin (1 mois ou 1 an selon la période)
        if ($period === 'mois') {
            $date_fin = date('Y-m-d H:i:s', strtotime('+1 month'));
        } elseif ($period === 'an') {
            $date_fin = date('Y-m-d H:i:s', strtotime('+1 year'));
        } else {
            $date_fin = date('Y-m-d H:i:s', strtotime('+1 month'));
        }

        $stmt = $pdo->prepare("INSERT INTO abonnements (user_id, transaction_id, plan, period, montant, telephone, statut, date_debut, date_fin) VALUES (?, ?, ?, ?, ?, ?, 'actif', ?, ?)");
        // Ici, on suppose que l'utilisateur est connecté et on récupère son ID
        // Remplace USER_ID par la session ou un paramètre
        $user_id = isset($_GET['user_id']) ? $_GET['user_id'] : 1; // À adapter
        $stmt->execute([$user_id, $transaction_id, $plan, $period, $amount, $phone, $date_debut, $date_fin]);

        $message = "✅ Félicitations ! Votre abonnement **$plan** est maintenant actif !";
    }
} catch (PDOException $e) {
    die("❌ Erreur lors de l'enregistrement : " . $e->getMessage());
}
?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Paiement réussi - OLINS</title>
    <link rel="stylesheet" href="style.css" />
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />
    <style>
        body {
            background: #f8f9fa;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            margin: 0;
            font-family: 'Segoe UI', Roboto, sans-serif;
        }
        .card {
            background: white;
            border-radius: 16px;
            padding: 2.5rem 2rem;
            max-width: 500px;
            width: 90%;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
            text-align: center;
        }
        .icon-success {
            font-size: 4rem;
            color: #22c55e;
            margin-bottom: 1rem;
        }
        h1 {
            color: #0A4D3C;
            font-size: 1.8rem;
            margin-bottom: 0.5rem;
        }
        .message {
            font-size: 1.1rem;
            margin: 1rem 0;
            color: #2d3748;
        }
        .details {
            background: #f1f5f9;
            padding: 1rem;
            border-radius: 8px;
            text-align: left;
            margin: 1.5rem 0;
        }
        .btn {
            display: inline-block;
            background: #0A4D3C;
            color: white;
            padding: 0.7rem 2rem;
            border-radius: 8px;
            text-decoration: none;
            font-weight: 600;
            transition: background 0.3s;
        }
        .btn:hover {
            background: #147a5f;
        }
        .footer-note {
            margin-top: 1.5rem;
            font-size: 0.9rem;
            color: #94a3b8;
        }
    </style>
</head>
<body>
    <div class="card">
        <div class="icon-success"><i class="fas fa-check-circle"></i></div>
        <h1>✅ Paiement confirmé !</h1>
        <div class="message"><?= htmlspecialchars($message) ?></div>
        <div class="details">
            <p><strong>Transaction :</strong> <?= htmlspecialchars($transaction_id) ?></p>
            <p><strong>Offre :</strong> <?= htmlspecialchars($plan) ?></p>
            <p><strong>Montant :</strong> <?= number_format($amount, 0, ',', ' ') ?> FCFA</p>
            <p><strong>Téléphone :</strong> <?= htmlspecialchars($phone) ?></p>
        </div>
        <a href="index.html" class="btn"><i class="fas fa-home"></i> Retour à l'accueil</a>
        <div class="footer-note">Un email de confirmation vous a été envoyé.</div>
    </div>
</body>
</html>
