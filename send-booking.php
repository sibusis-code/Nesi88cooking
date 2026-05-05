<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

function value(string $key): string
{
    return trim((string)($_POST[$key] ?? ''));
}

if (value('website') !== '') {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Spam rejected']);
    exit;
}

$name = value('name');
$phone = value('phone');
$email = value('email');
$eventDate = value('eventDate');
$eventType = value('eventType');
$guests = value('guests');
$location = value('location');
$budget = value('budget');
$message = value('message');

$required = [$name, $phone, $eventDate, $eventType, $guests, $location];
foreach ($required as $field) {
    if ($field === '') {
        http_response_code(422);
        echo json_encode(['success' => false, 'message' => 'Missing required fields']);
        exit;
    }
}

if ($email !== '' && filter_var($email, FILTER_VALIDATE_EMAIL) === false) {
    http_response_code(422);
    echo json_encode(['success' => false, 'message' => 'Invalid email format']);
    exit;
}

$to = 'nesi88cooking@gmail.com';
$subject = 'New Catering Booking Request';

$bodyLines = [
    'New booking enquiry from website:',
    '',
    'Name: ' . $name,
    'Phone: ' . $phone,
    'Email: ' . ($email !== '' ? $email : 'Not provided'),
    'Event Date: ' . $eventDate,
    'Event Type: ' . $eventType,
    'Estimated Guests: ' . $guests,
    'Location: ' . $location,
    'Budget: ' . ($budget !== '' ? $budget : 'Not specified'),
    'Menu Notes: ' . ($message !== '' ? $message : 'No extra notes')
];

$body = implode("\r\n", $bodyLines);

$sanitizedName = str_replace(["\r", "\n"], '', $name);
$sanitizedEmail = str_replace(["\r", "\n"], '', $email);

$headers = [
    'MIME-Version: 1.0',
    'Content-type: text/plain; charset=UTF-8',
    'From: Nesi88 Website <no-reply@nesi88cooking.co.za>',
    'Reply-To: ' . ($sanitizedEmail !== '' ? $sanitizedEmail : 'nesi88cooking@gmail.com'),
    'X-Lead-Name: ' . $sanitizedName
];

$mailSent = mail($to, $subject, $body, implode("\r\n", $headers));

if (!$mailSent) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Unable to send email']);
    exit;
}

echo json_encode(['success' => true, 'message' => 'Booking sent']);
