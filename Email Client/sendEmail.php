<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'vendor/autoload.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get the JSON input
    $data = json_decode(file_get_contents("php://input"), true);

    // Validate that 'message' field is present
    if (!isset($data['message'])) {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "Missing required field: 'message'."]);
        exit;
    }

    $mail = new PHPMailer(true);

    try {
        // SMTP configuration
        $mail->isSMTP();
        $mail->Host = 'smtp.hostinger.com'; // Hostinger SMTP server
        $mail->SMTPAuth = true;
        $mail->Username = 'noproviderfound@sahayakonline.com'; // Your Hostinger email
        $mail->Password = 'Admin@SahayakOnline@123'; // Your email password
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port = 587; // Use 465 for SSL, or 587 for STARTTLS

        // Email content
        $mail->setFrom('noproviderfound@sahayakonline.com', 'Sahayak Online Support');
        $mail->addAddress('dev.zagham@gmail.com'); // Always send to this address
        $mail->Subject = 'Provider Not Found'; // Fixed subject
        $mail->Body = $data['message']; // Use the message body from the request

        // Send the email
        $mail->send();
        echo json_encode(["success" => true, "message" => "Email sent successfully!"]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(["success" => false, "message" => $mail->ErrorInfo]);
    }
} else {
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Invalid request method."]);
}
?>
