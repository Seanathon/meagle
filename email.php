<?php
	$EmailFrom = "info@openmikeeagle.net";
	$EmailTo = "mtthwbckmn@gmail.com";
	$Subject = "New Message - Open Mike Eagle - Contact Form";
	$Name = Trim(stripslashes($_POST['Name'])); 
	$Sub = Trim(stripslashes($_POST['Subject'])); 
	$Email = Trim(stripslashes($_POST['Email'])); 
	$Message = Trim(stripslashes($_POST['Message'])); 

	// Validate email content
	$validationOK=true;
	if (!$validationOK) {
		print "<meta http-equiv=\"refresh\" content=\"0;URL=error.htm\">";
		exit;
	}

	// Email body text
	$Body = "";
	$Body .= "Subject: ";
	$Body .= $Sub;
	$Body .= "\n";
	$Body .= "Name: ";
	$Body .= $Name;
	$Body .= "\n";
	$Body .= "Email: ";
	$Body .= $Email;
	$Body .= "\n";
	$Body .= "Message: ";
	$Body .= $Message;
	$Body .= "\n";

	// Send email contents
	$success = mail($EmailTo, $Subject, $Body, "From: <$EmailFrom>");

	// Upon success 
	if ($success){
	print "<meta http-equiv=\"refresh\" content=\"0;URL=index.php\">";
	}
	else{
	print "<meta http-equiv=\"refresh\" content=\"0;URL=index.htm\">";
	}
?>