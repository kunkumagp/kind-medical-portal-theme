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

    $('form#create_contact').validate({
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
            },
            'i_agree_to_the_kind_healthcare_professional_terms_of_use': {
                required: true,
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
            'how_did_you_hear_about_us': {
                required: 'At least one option must be selected',
            },
            'i_agree_to_the_kind_healthcare_professional_terms_of_use': {
                required: 'This option must be checked'
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

    $(".register-form-btn").on("click", async function (e) {
        $("input[name='membership_status']").val("Pending");
        e.preventDefault();
        var form = $("#create_contact");
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
        $('form#create_contact').find(".submit-spin").addClass("show");
        $('form#create_contact').find(".register-form-btn").addClass("disabled");
    }

    function removeLoadingIcon() {
        $('form#create_contact').find(".submit-spin").removeClass("show");
        $('form#create_contact').find(".register-form-btn").removeClass("disabled");
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
        if ($("#create_contact .form-section").find(".form-group .input-field.error").length > 0) {
            var formError = $("#create_contact .form-section").find(".form-group .input-field.error");
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
        var hutkCookie = document.cookie.replace(/(?:(?:^|.*;\s*)hubspotutk\s*\=\s*([^;]*).*$)|^.*$/, "$1");
        const formData = $(form).serializeArray();
        const accountDetailsData = convertDataIntoKeyValueObject(formData);

        if (!hutkCookie) {
            hutkCookie = "";
        }

        var requestOptions = {
            'method': 'POST',
            'headers': {
                'Content-Type': 'application/json',
            },
            'body': JSON.stringify({
                formData: formData,
                hutk: hutkCookie
            }),
        };

        return fetch("/_hcms/api/register", requestOptions)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                if (data.statusCode === 200) {
                    removeLoadingIcon();
                    window.location.href = "/thankyou";

                } else {
                    removeLoadingIcon();
                    const msg = { "msg_type": "error-msg", "message": "Registration failed!" };
                    showMessage(msg);
                }
                return data.statusCode;
            })
            .catch(error => {
                removeLoadingIcon();
                console.log("post error: " + error.message);
                throw error;
            });

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
