var titleID = "FB3";
var userEmail;
var playFabId;
var referralPlayFabId;
var actionAfterLogin;
var actionAfterReferral;
var currentLogAreaId;

function Register() {
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
        document.getElementById("resultOutput").innerHTML = "Account created, sending mail to " + userEmail;

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
        document.getElementById("resultOutput").innerHTML = "Confirmation mail to sent to " + userEmail + "<br>Set up your password there<br>If you bought the game redeem your alpha key <a href=\"redeem-key.html\">here</a>";
    } else if (error !== null) {
        document.getElementById("resultOutput").innerHTML =
            "Error:\n" +
            PlayFab.GenerateErrorReport(error);
    }
}


function Login(name, pass) {
    PlayFabClientSDK.LoginWithPlayFab({
        TitleId: titleID,
        Password: pass,
        Username: name
    }, OnLogin);
}

function GetValueById(elementId) {
    return document.getElementById(elementId).value;
}

function SetLog(log) {
    document.getElementById(currentLogAreaId).innerHTML = log;
}

function OnLogin(result, error) {
    if (result !== null) {
        SetLog("User logged in...");
        playFabId = result.data.PlayFabId;
        actionAfterLogin();
    } else if (error !== null) {
        SetLog("Error:<br>" +
            PlayFab.GenerateErrorReport(error));
    }
}

function RedeemAlpha() {
    PlayFab.settings.titleId = titleID;
    currentLogAreaId = "resultOutput";

    var name = GetValueById("name");
    var pass = GetValueById("password");

    actionAfterLogin = function () {
        var key = GetValueById("key");
        var referral = GetValueById("referral");

        actionAfterReferral = function () {
            PlayFabClientSDK.ExecuteCloudScript({
                FunctionName: "WebsiteRedeemAlpha",
                FunctionParameter: {
                    key: key,
                    referralPlayFabId: referralPlayFabId
                },
                GeneratePlayStreamEvent: true
            }, function (result, error) {
                if (result !== null) {
                    console.log(result);
                    var msg = result.data.FunctionResult.message;
                    if (msg == "ok_key")
                        SetLog("Key redeemed successfully! Download the game from " +
                            "<a href=\"https://www.dropbox.com/s/z98ibfk7vlw91gj/BeatAimLauncher.zip?dl=0\" target=\"_blank\">dropbox</a>.");
                    else
                        SetLog("Wrong key, try again or contact me on <a href=\"https://discord.gg/6rAMBQ  target=\"_blank\">discord</a>.");
                } else if (error !== null) {
                    SetLog("Error:\n" +
                        PlayFab.GenerateErrorReport(error));
                }
            });
        }

        if (referral) {
            PlayFabClientSDK.GetAccountInfo(
                { TitleDisplayName: referral },
                OnGetReferral);
        }
        else {
            actionAfterReferral();
        }
    }

    Login(name, pass);
}

function OnGetReferral(result, error) {
    if (result !== null) {
        SetLog("Referral found...");
        // console.log(result);
        referralPlayFabId = result.data.AccountInfo.PlayFabId;
        actionAfterReferral();
    } else if (error !== null) {
        SetLog("Error referral: <br>" +
            PlayFab.GenerateErrorReport(error) + " <br>Try typing referral player name correctly or remove it completely.");
    }
}

function ExtendVip() {
    PlayFab.settings.titleId = titleID;
    currentLogAreaId = "resultOutput";

    var name = GetValueById("name");
    var pass = GetValueById("password");

    actionAfterLogin = function () {
        var key = GetValueById("key");
        var referral = GetValueById("referral");


        actionAfterReferral = function () {
            PlayFabClientSDK.ExecuteCloudScript({
                FunctionName: "WebsiteExtendVip",
                FunctionParameter: {
                    key: key,
                    referralPlayFabId: referralPlayFabId
                },
                GeneratePlayStreamEvent: true
            }, function (result, error) {
                if (result !== null) {
                    var msg = result.data.FunctionResult.message
                    if (msg == "ok_key")
                        SetLog("VIP extended successfully. Thank you and have fun!");
                    else
                        SetLog("Wrong key, try again or contact me on <a href=\"https://discord.gg/6rAMBQ  target=\"_blank\">discord</a>.");
                } else if (error !== null) {
                    SetLog("Error:\n" +
                        PlayFab.GenerateErrorReport(error));
                }
            });
        }

        if (referral) {
            PlayFabClientSDK.GetAccountInfo(
                { TitleDisplayName: referral },
                OnGetReferral);
        }
        else {
            actionAfterReferral();
        }

    }

    Login(name, pass);
}

