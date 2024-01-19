function controlFilterBoxShowHideStatus(leaveDropBoxClass,dropContainerId,dropContainerTagId){
  var dropBoxClass = dropBoxClass;
  var dropContainerId = dropContainerId;
  var dropContainerTagId = dropContainerTagId;

  $('.drop-checkbox-container').not(leaveDropBoxClass).hide();
  $('.up-arrow').not(leaveDropBoxClass).hide();

  $(dropContainerId).toggle();
  $(dropContainerTagId ).toggle();

}

$('#format').click(function() {
  controlFilterBoxShowHideStatus(".format-drop","#format-dropbox-container","#format-dropbox-container-tag");
});

$('#time-of-use').click(function() {
  controlFilterBoxShowHideStatus(".time-of-use-drop","#time-of-use-dropbox-container","#time-of-use-dropbox-container-tag");
});

$('#potency').click(function() {
  controlFilterBoxShowHideStatus(".potency-drop","#potency-dropbox-container","#potency-dropbox-container-tag");
});

$('#Reported-effects').click(function() {
  controlFilterBoxShowHideStatus(".Reported-effects-drop","#Reported-effects-dropbox-container","#Reported-effects-dropbox-container-tag");
});

$('#TGA-Category').click(function() {
  controlFilterBoxShowHideStatus(".TGA-Category-drop","#TGA-Category-dropbox-container","#TGA-Category-dropbox-container-tag");
});


function getCheckedCheckboxCountAndControlSelectedValue(mainFilterBoxId,filterBoxSpanId){
  var mainFilterBoxId = mainFilterBoxId;
  var filterBoxSpanId = filterBoxSpanId;
  var numberChecked = $(mainFilterBoxId +' input:checkbox:checked').length;

  if(numberChecked > 0){
    $(filterBoxSpanId).text(numberChecked+" Selected");
    $(mainFilterBoxId + " .filter-block").css({'background-color':'#EBEFE7'});

  }else{
    $(filterBoxSpanId).text("All formats");
    $(mainFilterBoxId + " .filter-block").css({'background-color':'#FFFFFF'});
  }

}

$("#format input:checkbox").change(function() {
  getCheckedCheckboxCountAndControlSelectedValue("#format" , "#format-checked-checkbox-count-port");
});

$("#time-of-use input:checkbox").change(function() {
  getCheckedCheckboxCountAndControlSelectedValue("#time-of-use" , "#time-of-use-checked-checkbox-count-port");
});

$("#potency input:checkbox").change(function() {
  getCheckedCheckboxCountAndControlSelectedValue("#potency" , "#potency-checked-checkbox-count-port");
});

$("#Reported-effects input:checkbox").change(function() {
  getCheckedCheckboxCountAndControlSelectedValue("#Reported-effects" , "#Reported-effects-checked-checkbox-count-port");
});

$("#TGA-Category input:checkbox").change(function() {
  getCheckedCheckboxCountAndControlSelectedValue("#TGA-Category" , "#TGA-Category-checked-checkbox-count-port");
});