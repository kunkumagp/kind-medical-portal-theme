$(document).ready(function () {
  $(".learning-modules").on("keydown", function (event) {
    if (event.which == 13) {
      var inputValue = $("input[name='query']").val();
      console.log(inputValue);
//       $(".learning-module-form").submit();
    }
  });
});
