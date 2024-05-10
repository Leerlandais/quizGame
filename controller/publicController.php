<?php

// LOGIN CALL
if (isset($_POST["userName"], 
          $_POST["userPwd"])) 
          {
              $name = $_POST["userName"];
              $pwd  = simpleTrim($_POST["userPwd"]);
              
              $loginAttempt = attemptUserLogin ($db, $name, $pwd);
              if ($loginAttempt === true) {
                  header("Location: ./");
                  die();
                }else if ($loginAttempt === false) {
                    $title = "Incorrect Login";
                    $myMessage = 'That be bad';
                    include "../view/public/pubhome.view.php";
                    die();
                }else {
                    include "../view/public/pubhome.view.php";
                    die();
                }
            }

if (isset($_POST["seenWelcome"])) {
    $_SESSION["welcome"] = true;
    $title = 'HomePublic';
    include ("../view/public/pubhome.view.php");
    die ();
}

if (isset($_POST["leave"])) {
    include ('../model/logoutModel.php');
    die();
}

    // Appel du page d'accueil public
    $title = '???HomePublic???';
    include "../view/public/pubhome.view.php";
    die ();

