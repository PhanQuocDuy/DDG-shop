<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <!--Icon-->
    <link rel="stylesheet" href="./DDGSHOP/view/fonts/themify-icons/themify-icons.css">
    <link rel="stylesheet" href="./DDGSHOP/view/fonts/fontawesome/all.css">
    <!--CSS-->
    <link rel="stylesheet" href="./DDGSHOP/view/CSS/bootstrap.min.css">
    <link rel="stylesheet" href="./DDGSHOP/view/CSS/style-themes.scss.css">
    <!--JS-->
    <script src="./DDGSHOP/view/JS/jquery-3.5.1.min.js"></script>
    <script src="./DDGSHOP/view/JS/scripts.js"></script>
    <script src="./DDGSHOP/view/JS/LinhTinhJS/api.jquery.js"></script>
    <script src="./DDGSHOP/view/JS/LinhTinhJS/beacon.min.js"></script>
    <script src="./DDGSHOP/view/JS/LinhTinhJS/cast_sender.js"></script>

    <title>Document</title>
</head>

<body>



    <?php include "./view/header.php"; 

         switch ($act){
                case "":
                    include("");
                    break;
                 default :
                    include("");
                    break;
        };
 
    

   
    include "./view/main.php"; 
   
    
    include "./view/footer.php"; ?>


</body>

</html>