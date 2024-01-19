
$('#format').click(function() {
  $('#time-of-use-dropbox-container').hide();
  $('#time-of-use-dropbox-container-tag').hide();
  $('#potency-dropbox-container').hide();
  $('#potency-dropbox-container-tag').hide();
  $('#Reported-effects-dropbox-container').hide();
  $('#Reported-effects-dropbox-container-tag').hide();
  $('#TGA-Category-dropbox-container').hide();
  $('#TGA-Category-dropbox-container-tag').hide();


  $('#format-dropbox-container').toggle();
  $('#format-dropbox-container-tag').toggle();
});

$('#time-of-use').click(function() {
  $('#format-dropbox-container').hide();
  $('#format-dropbox-container-tag').hide();
  $('#potency-dropbox-container').hide();
  $('#potency-dropbox-container-tag').hide();
  $('#Reported-effects-dropbox-container').hide();
  $('#Reported-effects-dropbox-container-tag').hide();
  $('#TGA-Category-dropbox-container').hide();
  $('#TGA-Category-dropbox-container-tag').hide();

  $('#time-of-use-dropbox-container').toggle();
  $('#time-of-use-dropbox-container-tag').toggle();
});

$('#potency').click(function() {
  $('#format-dropbox-container').hide();
  $('#format-dropbox-container-tag').hide();
  $('#time-of-use-dropbox-container').hide();
  $('#time-of-use-dropbox-container-tag').hide();
  $('#Reported-effects-dropbox-container').hide();
  $('#Reported-effects-dropbox-container-tag').hide();
  $('#TGA-Category-dropbox-container').hide();
  $('#TGA-Category-dropbox-container-tag').hide();

  $('#potency-dropbox-container').toggle();
  $('#potency-dropbox-container-tag').toggle();
});

$('#Reported-effects').click(function() {
  $('#format-dropbox-container').hide();
  $('#format-dropbox-container-tag').hide();
  $('#time-of-use-dropbox-container').hide();
  $('#time-of-use-dropbox-container-tag').hide();
  $('#potency-dropbox-container').hide();
  $('#potency-dropbox-container-tag').hide();
  $('#TGA-Category-dropbox-container').hide();
  $('#TGA-Category-dropbox-container-tag').hide();

  $('#Reported-effects-dropbox-container').toggle();
  $('#Reported-effects-dropbox-container-tag').toggle();

});

$('#TGA-Category').click(function() {
  $('#format-dropbox-container').hide();
  $('#format-dropbox-container-tag').hide();
  $('#time-of-use-dropbox-container').hide();
  $('#time-of-use-dropbox-container-tag').hide();
  $('#potency-dropbox-container').hide();
  $('#potency-dropbox-container-tag').hide();
  $('#Reported-effects-dropbox-container').hide();
  $('#Reported-effects-dropbox-container-tag').hide();
  
  $('#TGA-Category-dropbox-container').toggle();
  $('#TGA-Category-dropbox-container-tag').toggle();

});

function getcheckedCheckboxCount(){
   var numberNotChecked = $('#format input:checkbox:checked').length;
   console.log(numberNotChecked);
}

getcheckedCheckboxCount();

$("#format input:checkbox").change(function() {
    getcheckedCheckboxCount();
});

