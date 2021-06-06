<?php
/*
|--------------------------------------------------------------------------
| Mailer module
|--------------------------------------------------------------------------
|
| These module are used when sending email from contact form
|
*/



/*SECTION I - CONFIGURATION*/

//$receiver_mail = 'youremail@example.com';
$receiver_mail = 'youremail@example.com';
$mail_title = '[MyBlog]';



/*SECTION II - CODE*/

if( !empty($_POST['name']) && !empty($_POST['email']) && !empty($_POST['message']) ){
        $subject = $mail_title.' message from '.$_POST['name'];
	$header = 'From: '.$_POST['email'].'\r\nReply-To: '.$_POST['email'];
	if ( mail($receiver_mail, $subject, $_POST['message']+"\n\n"+$_POST['website'], $header) )
		$result = "Your message was successfully sent.";
	else
		$result = "Operation could not be completed.";
}else
{
	$result = "Error processing your request.";
}
echo $result;
?>
