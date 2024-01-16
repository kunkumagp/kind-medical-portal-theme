jQuery(document).ready(function($) {
  console.log("script.js loading");
  $(".hs-login-widget-show-password").text("show password");
  
  $(".hs-login-widget-show-password, .hs-register-widget-show-password, .hs-reset-widget-show-password").click(function() {
    if($(this).text() == "Show password") {
      $(this).text("Hide password");
    }else{
        $(this).text("Show password");
    }
  });
  

  $(".member-navigation ul li.has-sub-menu > a").click(function(e) {
    e.preventDefault();
    e.stopPropagation();
    console.log("Menu clicked");
    if ($(this).parent("li").hasClass("active")) {
      $(this).parent("li").removeClass("active");
    }else{
      $(this).parent("li").siblings("li").removeClass("active");
      $(this).parent("li").addClass("active");
    }
  });
  
  
  $(".close-modal").click(function() {
    $(this).parents('.modal').removeClass('open');
  });
  
//   var attr = $('body').attr('data-isonboarding');
//     // For some browsers, `attr` is undefined; for others,
//     // `attr` is false.  Check for both.
//     if (typeof attr !== 'undefined' && attr !== false) {
//         window.location.href = "/dashboard";
//     }
  
});