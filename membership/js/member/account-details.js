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

    $(".update-account-details").on("click", async function (e) {
        e.preventDefault();
        var form = $("#account-details-form");
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

    function startLoadingIcon() {
        $('form#account-details-form').find(".submit-spin").addClass("show");
        $('form#account-details-form').find(".update-account-details").addClass("disabled");
    }

    function removeLoadingIcon() {
        $('form#account-details-form').find(".submit-spin").removeClass("show");
        $('form#account-details-form').find(".update-account-details").removeClass("disabled");
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
        if ($("#account-details-form .form-section").find(".form-group .input-field.error").length > 0) {
            var formError = $("#account-details-form .form-section").find(".form-group .input-field.error");
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
        const contactId = $(".mem-account-details").attr("data-hubspot-contact-id");
      
        console.log(accountDetailsData);

        var requestOptions = {
            'method': 'POST',
            'headers': {
                'Content-Type': 'application/json',
            },
            'body': JSON.stringify({
                data: accountDetailsData,
                id: contactId
            }),
        };

        return fetch("/_hcms/api/accountDetails", requestOptions)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                console.log(data.Response);
                if (data.Response.statusCode === 200) {
                    removeLoadingIcon();
                    const msg = { "msg_type": "success-msg", "message": "Contact Details Update Successfully!" };
                    showMessage(msg);
                } else {
                    removeLoadingIcon();
                    const msg = { "msg_type": "error-msg", "message": "Contact Details Update Failed!" };
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
})
