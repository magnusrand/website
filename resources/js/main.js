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