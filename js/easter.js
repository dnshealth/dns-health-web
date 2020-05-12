/** 
* @author Rūdolfs Arvīds Kalniņš
*
*/
'use strict';

// When page has loaded
$(document).ready(function(){

    // Initialize button states as false (not pressed)
    let counter1 = false;
    let counter2 = false;
    let counter3 = false;
    let counter4 = false;

    /*
     If button with class ".secret_meme1" is clicked its
     state "counter1" is set to true (pressed). Then if all other
     buttons have been pressed, confetti is displayed. This functions
     is identical for all 4 buttons.
     */
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