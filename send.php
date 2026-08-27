<?php
/**
 * Sakura KGL — contact & booking form handler
 * Upload this file beside the HTML pages on a PHP-capable host.
 */

header('Content-Type: application/json; charset=UTF-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'error' => 'Method not allowed.']);
    exit;
}

$to = 'info@sakurakgl.rw';

function clean_text($value, $max = 2000) {
    $value = trim((string)$value);
    $value = str_replace(["\r", "\0"], '', $value);
    return mb_substr($value, 0, $max);
}

$name  = clean_text($_POST['name'] ?? '', 120);
$email = trim((string)($_POST['email'] ?? ''));

if ($name === '' || $email === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(422);
    echo json_encode(['ok' => false, 'error' => 'Please provide a valid name and email address.']);
    exit;
}

/* Honeypot spam trap. */
if (!empty($_POST['website'])) {
    echo json_encode(['ok' => true]);
    exit;
}

$subject = clean_text(
    $_POST['_subject'] ?? ('New enquiry from ' . $name . ' — Sakura KGL website'),
    180
);
$subject = str_replace(["\r", "\n"], ' ', $subject);

$fields = [
    'company'        => 'Company / Organisation',
    'phone'          => 'Phone',
    'service'        => 'Interested In',
    'meeting_topic'  => 'Meeting Topic',
    'preferred_date' => 'Preferred Date',
    'preferred_time' => 'Preferred Time',
    'meeting_format' => 'Meeting Format',
    'notes'          => 'Additional Notes',
    'message'        => 'Message',
];

$body  = "New submission from the Sakura KGL website\n";
$body .= "============================================\n\n";
$body .= "Name: " . $name . "\n";
$body .= "Email: " . $email . "\n";

foreach ($fields as $field => $label) {
    if (isset($_POST[$field]) && trim((string)$_POST[$field]) !== '') {
        $body .= $label . ': ' . clean_text($_POST[$field]) . "\n";
    }
}

$headers  = "From: Sakura KGL Website <noreply@sakurakgl.rw>\r\n";
$headers .= "Reply-To: " . str_replace(["\r", "\n"], '', $email) . "\r\n";
$headers .= "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

$sent = @mail($to, $subject, $body, $headers);

if ($sent) {
    echo json_encode(['ok' => true]);
    exit;
}

http_response_code(500);
echo json_encode([
    'ok' => false,
    'error' => 'The message could not be sent right now. Please email us directly at info@sakurakgl.rw.'
]);
