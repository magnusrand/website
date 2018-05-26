/**
 * Created by Magnus on 18.12.2017.
 */


$(window).scroll(function() {

    if ($(this).scrollTop()>700)
     {
        $('#down-arrow').fadeOut();
     }
    else
     {
      $('#down-arrow').fadeIn();
     }
 });


document.getElementById("navbtn1").addEventListener("click", function(){ smoothscroll("section2");});
document.getElementById("navbtn2").addEventListener("click", function(){ smoothscroll("section3");});
document.getElementById("navbtn3").addEventListener("click", function(){ smoothscroll("section4");});

document.getElementById("down-arrow").addEventListener("click", function(){ smoothscroll("section2");});

// Scroll to a certain element
function smoothscroll(element) {
    document.getElementById(element).scrollIntoView({
        behavior: 'smooth',
        block: "start"
});}
