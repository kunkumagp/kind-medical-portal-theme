$(document).ready(function() {
  $(".product-with-tag .pd-tag").click(function() {
    if( $(this).parents(".col").hasClass("favourite")) {
       $(this).parents(".col").removeClass("favourite");
    }else {
       $(this).parents(".col").addClass("favourite");
    }
  });
  
});