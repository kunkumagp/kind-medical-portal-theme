$(document).ready(function() {
  $(".product-with-tag .pd-tag").click(function() {
    if( $(this).parents(".col").hasClass("favourite")) {
       $(this).parents(".col").removeClass("favourite");
    }else {
       $(this).parents(".col").addClass("favourite");
    }
  });
  
    // open modal
  $(".compare-product-lists .product-name").click(function() {
    console.log("open modal");
//     var productColumnIndex = $(this).parents(".compare-product-lists .inner .col").index()+1;

    $(".product-modal").addClass("open");
    
  })
});