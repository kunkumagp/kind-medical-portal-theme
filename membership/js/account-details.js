 import { updateContact } from "{{ get_asset_url('../../membership/js/hubspot.js') }}";

// console.log(config.endpoint.updateContact);
// import { Hubspot } from "{{ get_asset_url('../../membership/js/hubspot.js') }}";

jQuery(document).ready(function ($) {
    $.validator.addMethod(
        'validateEmail',
        function (value, element) {
            return (
                this.optional(element) ||
                /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(
                    value
                )
            );
        },
        'Please enter a valid email address.'
    );
    $.validator.addMethod("validatePhone", function (value) {
        if (/^((\+[1-9]{1,4}[ \-]*)|(\([0-9]{2,3}\)[ \-]*)|([0-9]{2,4})[ \-]*)*?[0-9]{3,4}?[ \-]*[0-9]{3,4}?$/.test(value)) {
            return true;
        } else {
            return false;
        }
    }, 'Please enter a number');

    $('form#account-details-form').validate({
        ignore: [],
        errorElement: 'span',
        errorClass: 'input-field error',
        rules: {
            'firstname': {
                required: true
            },
            'lastname': {
                required: true
            },
            'hcp_type': {
                required: true
            },
            'practice_name': {
                required: true
            },
            'practice_address': {
                required: true
            },
            'phone': {
                required: true,
                validatePhone: true
            },
            'email': {
                required: true,
                validateEmail: true,
            }
        },
        messages: {
            'firstname': {
                required: "First name is required.",
            },
            'lastname': {
                required: "Last name is required.",
            },
            'hcp_type': {
                required: 'You must select one option',
            },
     
            'practice_name': {
                required: 'Practice name is required',
            },
            'practice_address': {
                required: 'Practice address is required',
            },
            'phone': {
                required: 'Phone number is required',
            },
            'email': {
                required: 'Email address is required',
            }
        },
        errorPlacement: function (error, element) {
            if (element.is(":radio")) {
                error.appendTo(element.parents('.form-group'));
            } else if (element.is(":checkbox")) {
                error.appendTo(element.parents('.form-group'));
            }
            else { // This is the default behavior 
                error.insertAfter(element);
            }
        }
    });


    $(".update-account-details").on("click", async function (e) {
        e.preventDefault();
        var form = $("#account-details-form");
        if (form.valid()) {
            try {
                startLoadingIcon();
                const formData = $(form).serializeArray();
                const accountDetailsData = convertDataIntoKeyValueObject(formData);
                const contactId = $(".mem-account-details").attr("data-hubspot-contact-id");
           
                // create instance of class import Hubspot
//                 let hs = new Hubspot();
//                 await hs.updateContact(contactId, accountDetailsData); 
                await updateContact(contactId, accountDetailsData);
                removeLoadingIcon();
                const msg = { "msg_type": "success-msg", "message" : "Account details updated successfully" };
                showMessage(msg);
             
            } catch (err) {
                removeLoadingIcon();
                const msg = { "msg_type": "error-msg", "message" : "There is a server error in updating account details." };
                showMessage(msg);
                console.log("Error : " + err.message)
            }
        } else {
            scrollToErrorPosition();
        }
    })

    
  /****
   * JSON.stringify(formData)
   * [{"name":"firstname","value":"Raynash"},{"name":"lastname","value":"Manandhar"},{"name":"hcp_type","value":"Medical Specailist"}]
   ****/
  
  
  function convertDataIntoKeyValueObject(accountDetailsData) {
    var finalObj = {};
    accountDetailsData.forEach(function (elem, index) {
        if (!finalObj.hasOwnProperty(elem.name)) {
            finalObj[elem.name] = elem.value;
        }
    });

    return finalObj;
  }
  
  function showMessage(msg) {
     if(msg.msg_type == "success-msg") {
       $(".submission-message").html(""); 
       $(".submission-message").html("<span class='success-msg'>"+msg.message+"</span>");
        $("html, body").animate({ scrollTop: 0 }, 600);
       setTimeout(() => {
         $(".submission-message .success-msg").fadeOut('slow', function(){
           $(this).remove();
         });
       },3000);
     }else if (msg.msg_type == "error-msg") {
        $("html, body").animate({ scrollTop: 0 }, 600);
        $(".submission-message").html("<span class='error-msg'>"+msg.message+"</span>");
     }
  }
 
  
    function startLoadingIcon() {
       $('form#account-details-form').find(".submit-spin").addClass("show");
       $('form#account-details-form').find(".update-account-details").addClass("disabled");
    }
  
    function removeLoadingIcon() {
       $('form#account-details-form').find(".submit-spin").removeClass("show");
       $('form#account-details-form').find(".update-account-details").removeClass("disabled");
    }

    function scrollToErrorPosition() {
        if ($("#account-details-form .form-section").find(".form-group .input-field.error").length > 0) {
            var formError = $("#account-details-form .form-section").find(".form-group .input-field.error");
            var scrollTo = formError.closest(".form-group");
            $('html, body').animate({
                scrollTop: scrollTo.offset().top - 40
            }, 500);
        }
        return;
    }
  
  $('input[type=checkbox]').keypress(function (e) {
    if (e.which == 13) {
      clickCheckBox(this);
    }
  });

  function clickCheckBox(box) {
    var $box = $(box);
    if ($box.attr('checked')) {
      $box.attr('checked', false);
    } else {
      $box.attr('checked', true);
    }
  }
})


