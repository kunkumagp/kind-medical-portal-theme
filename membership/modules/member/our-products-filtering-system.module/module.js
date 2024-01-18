
$('#format').click(function() {
  $('#time-of-use-dropbox-container').hide();
  $('#time-of-use-dropbox-container-tag').hide();
  
  
  $('#format-dropbox-container').toggle();
  $('#format-dropbox-container-tag').toggle();
});

$('#time-of-use').click(function() {
    $('#format-dropbox-container').hide();
    $('#format-dropbox-container-tag').hide();
  
    $('#time-of-use-dropbox-container').toggle();
    $('#time-of-use-dropbox-container-tag').toggle();
});