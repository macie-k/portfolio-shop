<?php

    // FOR THE EMAIL SERVICE TO WORK YOU NEED 'COMPOSER'
    // RUN 'composer install' from the '/scripts' directory
    // Include 'vendor' directory on hosting

    header("Location: ../contact.html");                        // Where to redirect

    use PHPMailer\PHPMailer\Exception;
    use PHPMailer\PHPMailer\PHPMailer;
    use PHPMailer\PHPMailer\SMTP;

    // echo 'Sending mail . . .';
    $name = $_POST['name'];                                     // Sender name
    $emailFrom = $_POST['email'];                               // Sender email adress
    $topic = $_POST['topic'];                                   // Topic
    $emailMessage= $_POST['message'];                           // Message text
    $emailContent = $emailMessage.'<br><br><i>- '.$emailFrom.'</i>';     // Actual email content [message + email signature]
    // -----------------------
    $recipientMail = '--> email@domain.com <--';

    require 'vendor/autoload.php';
    $mail = new PHPMailer(true);

    try {
        // $mail->SMTPDebug = SMTP::DEBUG_SERVER;                   // Enable verbose debug output
        $mail->isSMTP();                                            // Send using SMTP
        $mail->Host       = 'smtp.gmail.com';                       // Set the SMTP server to send through
        $mail->SMTPAuth   = true;                                   // Enable SMTP authentication
        $mail->Username   = $recipientMail;                         // SMTP username
        $mail->Password   = '--> PASSWORD <--';                     // SMTP password
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;         // Enable TLS encryption; `PHPMailer::ENCRYPTION_SMTPS` encouraged
        $mail->Port       = 587;                                    // TCP port to connect to, use 465 for `PHPMailer::ENCRYPTION_SMTPS` above

        // Recipients
        $mail->setFrom($recipientMail, $emailFrom);
        $mail->addAddress($recipientMail);              // Add a recipient

        // Content
        $mail->isHTML(true);
        $mail->Subject = '['.$topic.'] - '.$name;
        $mail->Body    = nl2br($emailContent);
        $mail->AltBody = $emailMessage;

        $mail->send();
    } catch (Exception $e) {
        echo "Message could not be sent. Mailer Error: {$mail->ErrorInfo}";
    }
?>