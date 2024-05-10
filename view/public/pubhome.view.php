
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <?php include ("../view/cdn/cssBS.php"); ?>
        <link rel="stylesheet" href="css/colours.css">
        <link rel="stylesheet" href="css/style.css">
        <title><?=$title?></title>
    </head>
    <body class="mt-5 text-center">
        <?php if (isset($myMessage)) { ?> <p class="h2"><?=$myMessage?></p> <?php } ?> <!-- LEAVE ALONE AND USE ON ALL PAGES -->
        
        <?php 
        if (!isset($_SESSION["welcome"]) || 
                   $_SESSION["welcome"] === false) {
            include ("inc/welcome-message.php"); 
        }else {
            include ("inc/game-intro.php");
        } 
        
            include ("inc/game-run.php");
        ?>
        
<form action="" method="POST">
    <button class="btn" name="leave">Leave</button>
</form>
<?php include ("inc/footer.public.php"); ?>
<?php include ("../view/cdn/jsBS.php") ?>
<script src="js/script.js"></script>
<script src="js/quiz-script.js"></script>
</body>
</html>
