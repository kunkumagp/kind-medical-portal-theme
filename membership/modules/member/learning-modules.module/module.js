$(document).ready(function() {
  $(".learning-modules").on("keydown", function(event) {
      if(event.which == 13) {
        $(".learning-module-form").submit();
      }
    });
});