(function($){
  $(function(){

    $('.button-collapse').sideNav();
    $('.parallax').parallax();
    $('.carousel').carousel({duration:200});
	$(".dropdown-button").dropdown();
    
  }); // end of document ready
   // Initialize collapse button
  $(".button-collapse").sideNav();
  $('.carousel').carousel();
  // Initialize collapsible (uncomment the line below if you use the dropdown variation)
  //$('.collapsible').collapsible();
})(jQuery); // end of jQuery name space