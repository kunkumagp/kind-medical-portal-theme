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

    $('form#active_member-details-form').validate({
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

    $(".update-active-member").on("click", async function (e) {
        e.preventDefault();
        var form = $("#active_member-details-form");
        if (form.valid()) {
            try {
                startLoadingIcon();
                const formSubmitResponse = await submitHubspotForm(form);
                if (formSubmitResponse == 200) {
                    removeLoadingIcon();
                }
            } catch (err) {
                removeLoadingIcon();
                console.log("Error : " + err.message)
            }
        } else {
            scrollToErrorPosition();
        }
    })

    $(".deactivate-trigger").on("click", async function (e) {
        e.preventDefault();
        try {
            startLoadingIcon();
            const accuntDeactivateResponse = await accuntDeactivate();
            if (accuntDeactivateResponse == 204) {
                removeLoadingIcon();
            }
        } catch (err) {
            removeLoadingIcon();
            console.log("Error : " + err.message)
        }
    })

    function accuntDeactivate() {

        var requestOptions = {
            'method': 'POST',
            'headers': {
                'Content-Type': 'application/json',
            },
            'body': JSON.stringify({
                data: ''
            }),
        };
      
        startLoadingIcon();
        return fetch("/_hcms/api/deleteMember", requestOptions)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                if (data.Response.statusCode === 204) {
                    localStorage.setItem('deactivationMessage', 'Account has been successfully deactivated!');
                    window.location.href = "/search-member";
                } else {
                    removeLoadingIcon();
                    const msg = { "msg_type": "error-msg", "message": "Account Deativation Failed!" };
                    showMessage(msg);
                }
                return data.Response.statusCode;
            })
            .catch(error => {
                removeLoadingIcon();
                console.log("post error: " + error.message);
                throw error;
            });
    }

    function startLoadingIcon() {
        $('form#active_member-details-form').find(".submit-spin").addClass("show");
        $('div#deactivate-member-modal').find(".submit-spin").addClass("show");
        $('form#active_member-details-form').find(".update-active-member").addClass("disabled");
    }

    function removeLoadingIcon() {
        $('form#active_member-details-form').find(".submit-spin").removeClass("show");
        $('form#active_member-details-form').find(".update-active-member").removeClass("disabled");
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
  
    function showNotificationMessage(msg) {
         if (msg.msg_type == "success-msg") {
           $('.notification-bar-message > p').text(msg.message);
           $("html, body").animate({ scrollTop: 0 }, 600);
           $('.notification-bar-message').fadeIn('slow');
           setTimeout(function() {
             $('.notification-bar-message').fadeOut('slow');
           }, 10000);
        } else if (msg.msg_type == "error-msg") {
            $("html, body").animate({ scrollTop: 0 }, 600);
            $(".submission-message").html("<span class='error-msg'>" + msg.message + "</span>");
        }
    }

    function scrollToErrorPosition() {
        if ($("#active_member-details-form .form-section").find(".form-group .input-field.error").length > 0) {
            var formError = $("#active_member-details-form .form-section").find(".form-group .input-field.error");
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

        return fetch("/_hcms/api/activeMemberDetailsUpdate", requestOptions)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                if (data.Response.statusCode === 200) {
                    removeLoadingIcon();
                    const msg = { "msg_type": "success-msg", "message": "Account details where updated!" };
                    showNotificationMessage(msg);
                } else {
                    removeLoadingIcon();
                    const msg = { "msg_type": "error-msg", "message": "Account Details Update Failed!" };
                    showMessage(msg);
                }
                return data.Response.statusCode;
            })
            .catch(error => {
                removeLoadingIcon();
                console.log("post error: " + error.message);
                throw error;
            });
    }
  
    $(".deactivate-member").click(function(e) {
      e.preventDefault();
      var modalId = $(this).attr("data-target");
      console.log('id ' + modalId);
     $("#"+modalId).addClass("open");
    });
})
