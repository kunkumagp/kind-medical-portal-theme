jQuery(document).ready(function ($) {
  console.log("Search member");
  $(".member-type ul li").click(function() {
    if($(this).hasClass("active")) {
      console.log("clicked");
      $(this).removeClass("active");
    }else{
       $(this).addClass("active");
    }
  });
});