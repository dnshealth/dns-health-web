$(document).ready(function(){

    let counter1 = false;
    let counter2 = false;
    let counter3 = false;
    let counter4 = false;

    $('.secret_meme1').click(function(e){
        e.preventDefault();
        if(counter1 == false){
            counter1 = true;
        }
        if(
            counter1 == true &&
            counter2 == true &&
            counter3 == true &&
            counter4 == true
        ){
            confetti.start();
        }
    });

    $('.secret_meme2').click(function(e){
        e.preventDefault();
        if(counter2 == false){
            counter2 = true;
        }
        if(
            counter1 == true &&
            counter2 == true &&
            counter3 == true &&
            counter4 == true
        ){
            confetti.start();
        }
    });

    $('.secret_meme3').click(function(e){
        e.preventDefault();
        if(counter3 == false){
            counter3 = true;
        }
        if(
            counter1 == true &&
            counter2 == true &&
            counter3 == true &&
            counter4 == true
        ){
            confetti.start();
        }
    });

    $('.secret_meme4').click(function(e){
        e.preventDefault();
        if(counter4 == false){
            counter4 = true;
        }
        if(
            counter1 == true &&
            counter2 == true &&
            counter3 == true &&
            counter4 == true
        ){
            confetti.start();
        }
    });

});