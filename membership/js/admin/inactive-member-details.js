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

    $('form#inactive_member-details-form').validate({
        ignore: [],
        errorElement: 'span',
        errorClass: 'error',
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
            'ahpra_number': {
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
            },
            'how_did_you_hear_about_us': {
                required: false,
            }
        },
        messages: {
            'lastname': {
                required: "First name is required.",
            },
            'lastname': {
                required: "Last name is required.",
            },
            'hcp_type': {
                required: 'You must select one option',
            },
            'ahpra_number': {
                required: 'You Ahpra number is required',
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
            },
        },
    });

    $(".accept-member").on("click", async function (e) {
        e.preventDefault();
        var form = $("#inactive_member-details-form");
        if (form.valid()) {
            try {
                startLoadingIconOnAccept();
                const formSubmitResponse = await submitHubspotForm(form);
                if (formSubmitResponse == 200) {
                    removeLoadingIconOnAccept();
                }
            } catch (err) {
                removeLoadingIconOnAccept();
                console.log("Error : " + err.message)
            }
        } else {
            scrollToErrorPosition();
        }
    })
  
    $(".reject-member").on("click", async function (e) {
      e.preventDefault();
        try {
          startLoadingIconOnReject();
          const formSubmitResponse = await rejectHubspotForm();
          if (formSubmitResponse == 200) {
            removeLoadingIconOnReject();
          }
        } catch (err) {
          removeLoadingIconOnReject();
          console.log("Error : " + err.message)
        }
    })

    function startLoadingIconOnReject() {
        $('form#inactive_member-details-form').find(".reject").addClass("show");
        $('form#inactive_member-details-form').find(".accept-member").addClass("disabled");
    }

    function removeLoadingIconOnReject() {
        $('form#inactive_member-details-form').find(".reject").removeClass("show");
        $('form#inactive_member-details-form').find(".accept-member").removeClass("disabled");
    }
  
    function startLoadingIconOnAccept() {
        $('form#inactive_member-details-form').find(".accept").addClass("show");
        $('form#inactive_member-details-form').find(".accept-member").addClass("disabled");
    }

    function removeLoadingIconOnAccept() {
        $('form#inactive_member-details-form').find(".accept").removeClass("show");
        $('form#inactive_member-details-form').find(".accept-member").removeClass("disabled");
    }

    function showMessage(msg) {
        if (msg.msg_type == "success-msg") {
            $(".submission-message").html("");
            $(".submission-message").html("<span class='success-msg'>" + msg.message + "</span>");
            $("html, body").animate({ scrollTop: 0 }, 600);
            setTimeout(() => {
                $(".submission-message .success-msg").fadeOut('slow', function () {
                    $(this).remove();
                });
            }, 3000);
        } else if (msg.msg_type == "error-msg") {
            $("html, body").animate({ scrollTop: 0 }, 600);
            $(".submission-message").html("<span class='error-msg'>" + msg.message + "</span>");
        }
    }

    function scrollToErrorPosition() {
        if ($("#inactive_member-details-form .form-section").find(".form-group .input-field.error").length > 0) {
            var formError = $("#inactive_member-details-form .form-section").find(".form-group .input-field.error");
            var scrollTo = formError.closest(".form-group");
            $('html, body').animate({
                scrollTop: scrollTo.offset().top - 40
            }, 500);
        }
        return;
    }

    function convertDataIntoKeyValueObject(accountDetailsData) {
        var finalObj = {};
        accountDetailsData.forEach(function (elem, index) {
            if (!finalObj.hasOwnProperty(elem.name)) {
                finalObj[elem.name] = elem.value;
            }
        });
        return finalObj;
    }

    function submitHubspotForm(form) {

        const formData = $(form).serializeArray();
        const accountDetailsData = convertDataIntoKeyValueObject(formData);

        var requestOptions = {
            'method': 'POST',
            'headers': {
                'Content-Type': 'application/json',
            },
            'body': JSON.stringify({
                data: accountDetailsData
            }),
        };

        return fetch("/_hcms/api/inactiveMemberDetailsUpdate", requestOptions)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                if (data.Response.statusCode === 200) {
                    removeLoadingIconOnAccept();
                    const msg = { "msg_type": "success-msg", "message": "Contact Details Update Successfully!" };
                    showMessage(msg);
                } else {
                    removeLoadingIconOnAccept();
                    const msg = { "msg_type": "error-msg", "message": "Contact Details Update Failed!" };
                    showMessage(msg);
                }
                return data.Response.statusCode;
            })
            .catch(error => {
                removeLoadingIconOnAccept();
                console.log("post error: " + error.message);
                throw error;
            });
    }
  
      function rejectHubspotForm() {

        var requestOptions = {
            'method': 'POST',
            'headers': {
                'Content-Type': 'application/json',
            },
            'body': JSON.stringify({
                data: ''
            }),
        };

        return fetch("/_hcms/api/inactiveMemberReject", requestOptions)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                if (data.Response.statusCode === 200) {
                    removeLoadingIconOnReject();
                    const msg = { "msg_type": "success-msg", "message": "Contact Rejected Successfully!" };
                    showMessage(msg);
                } else {
                    removeLoadingIconOnReject();
                    const msg = { "msg_type": "error-msg", "message": "Contact Rejected Failed!" };
                    showMessage(msg);
                }
                return data.Response.statusCode;
            })
            .catch(error => {
                removeLoadingIconOnReject();
                console.log("post error: " + error.message);
                throw error;
            });
      }
})
