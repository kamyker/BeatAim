var titleID = "FB3";
var userEmail;

function Register(){
    PlayFab.settings.titleId = titleID;
	
	userEmail = document.getElementById("email").value;
	
    var registerRequest = {
        TitleId: titleID,// PlayFab.settings.titleId,
        Username: document.getElementById("playerName").value,
        DisplayName: document.getElementById("playerName").value,
        Email: userEmail,
		RequireBothUsernameAndEmail: true,
		Password: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15) //not important user won't be able to login anyway
    };

    PlayFabClientSDK.RegisterPlayFabUser(registerRequest, RegisterCallback);
}

var RegisterCallback = function (result, error) {
	//userEmail = document.getElementById("email").value;
    if (result !== null) {
        document.getElementById("resultOutput").innerHTML = "Account created, sending mail to "  + userEmail;
		
		var recoveryRequest = {
			TitleId: titleID,
			Email: userEmail
		};
		
		PlayFabClientSDK.SendAccountRecoveryEmail(recoveryRequest, MailSentCallback);
		
    } else if (error !== null) {
        document.getElementById("resultOutput").innerHTML =
            "Error:\n" +
            PlayFab.GenerateErrorReport(error);
    }
}

var MailSentCallback = function (result, error) {
    if (result !== null) {
        document.getElementById("resultOutput").innerHTML = "Confimation mail to sent to " + userEmail + ". Set up your password there.";
    } else if (error !== null) {
        document.getElementById("resultOutput").innerHTML =
            "Error:\n" +
            PlayFab.GenerateErrorReport(error);
    }
}