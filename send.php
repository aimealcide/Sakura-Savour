<?php
/**
 * Sakura KGL — contact & booking form handler
 * ---------------------------------------------
 * Drop this file next to your other .html pages on any PHP-capable host
 * (virtually all shared hosting, including cPanel-based Rwandan hosts,
 * supports PHP by default — no extra setup needed).
 *
 * Both forms on contact.html already point their action="" at this file,
 * so nothing else needs to change once you upload it.
 *
 * IMPORTANT: change $to below to the inbox you want submissions sent to.
 */

header('Content-Type: application/json');

$to = 'info@sakurakgl.rw';

// ---- Honeypot spam trap -------------------------------------------------
// Real visitors never see or fill in the hidden "website" field.
// If it's filled in, silently accept without sending an email.
if (!empty($_POST['website'])) {
    echo json_encode(['ok' => true]);
    exit;
}

// ---- Basic validation ----------------------------------------------------
$name  = trim($_POST['name']  ?? '');
$email = trim($_POST['email'] ?? '');

if ($name === '' || $email === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(422);
    echo json_encode(['ok' => false, 'error' => 'Please provide a valid name and email address.']);
    exit;
}

// ---- Build the email body from whatever fields were submitted -----------
$subject = trim($_POST['_subject'] ?? ('New enquiry from ' . $name . ' — Sakura KGL website'));

$labels = [
    'company'        => 'Company',
    'phone'          => 'Phone',
    'service'        => 'Interested In',
    'meeting_topic'  => 'Meeting Topic',
    'preferred_date' => 'Preferred Date',
    'preferred_time' => 'Preferred Time',
    'meeting_format' => 'Meeting Format',
    'notes'          => 'Notes',
    'message'        => 'Message',
];

$body  = "New submission from the Sakura KGL website\n\n";
$body .= "Name: $name\n";
$body .= "Email: $email\n";

foreach ($labels as $field => $label) {
    if (!empty($_POST[$field])) {
        $body .= "$label: " . trim($_POST[$field]) . "\n";
    }
}

// ---- Send the email --------------------------------------------------------
$headers  = "From: Sakura KGL Website <noreply@sakurakgl.rw>\r\n";
$headers .= "Reply-To: $name <$email>\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

$sent = @mail($to, $subject, $body, $headers);

if ($sent) {
    echo json_encode(['ok' => true]);
} else {
    http_response_code(500);
    echo json_encode([
        'ok'    => false,
        'error' => 'The message could not be sent right now. Please email us directly at info@sakurakgl.rw.',
    ]);
}
