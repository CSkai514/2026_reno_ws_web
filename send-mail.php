<?php
header('Content-Type: application/json');

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    echo json_encode(['success' => false, 'error' => 'Invalid request method.']);
    exit;
}

// Honeypot — bots fill hidden fields, humans don't
if (!empty($_POST['website'])) {
    echo json_encode(['success' => false, 'error' => 'Submission blocked.']);
    exit;
}

$name      = htmlspecialchars(trim($_POST['name'] ?? ''));
$phone     = htmlspecialchars(trim($_POST['phone'] ?? ''));
$treatment = htmlspecialchars(trim($_POST['treatment'] ?? ''));
$clinic    = htmlspecialchars(trim($_POST['clinic'] ?? ''));
$message   = htmlspecialchars(trim($_POST['message'] ?? ''));

// --- Server-side validation ---
$errors = [];

if ($name === '' || mb_strlen($name) < 2 || !preg_match('/[aeiou]/i', $name)) {
    $errors[] = 'valid name';
}

$digits = preg_replace('/\D/', '', $phone);
if ($phone === '' || !preg_match('/^[0-9+()\-\s]+$/', $phone) || strlen($digits) < 9 || strlen($digits) > 12) {
    $errors[] = 'valid phone number';
}

if ($treatment === '') $errors[] = 'treatment';
if ($clinic === '')    $errors[] = 'clinic';

if ($treatment === 'Other Inquiry') {
    if ($message === '' || mb_strlen($message) < 5 || !preg_match('/[aeiou]/i', $message)) {
        $errors[] = 'inquiry details';
    }
}

if (!empty($errors)) {
    echo json_encode(['success' => false, 'error' => 'Please provide a ' . implode(', ', $errors) . '.']);
    exit;
}
// --- end validation ---

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require __DIR__ . '/PHPMailer-7.1.1/src/Exception.php';
require __DIR__ . '/PHPMailer-7.1.1/src/PHPMailer.php';
require __DIR__ . '/PHPMailer-7.1.1/src/SMTP.php';

$mail = new PHPMailer(true);

try {
    $mail->isSMTP();
    $mail->Host       = 'mail.devsite.wongandsimdental.com';   // if this fails, try 'mail.devsite.wongandsimdental.com'
    $mail->SMTPAuth   = true;
    $mail->Username   = 'devsite_mail@devsite.wongandsimdental.com';
    $mail->Password   = '7&m5A67bf';   // same password used for webmail
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
    $mail->Port       = 465;

    $mail->setFrom('devsite_mail@devsite.wongandsimdental.com', 'Wong & Sim Website');
    $mail->addAddress('wsdentalwebdev@gmail.com');
    $mail->addReplyTo('devsite_mail@devsite.wongandsimdental.com');

    $mail->Subject = "New Enquiry: $treatment — $clinic";
    $mail->Body =
        "You have received a new enquiry:\n\n" .
        "Name: $name\n" .
        "Phone: $phone\n" .
        "Treatment: $treatment\n" .
        "Preferred Clinic: $clinic\n\n" .
        "Message:\n" . ($message !== '' ? $message : '(none)');

    $mail->send();
    echo json_encode(['success' => true]);
} catch (Exception $e) {
    // Shows the real reason while testing — change to a friendly message before going live
    echo json_encode(['success' => false, 'error' => 'Mail error: ' . $mail->ErrorInfo]);
}
?>