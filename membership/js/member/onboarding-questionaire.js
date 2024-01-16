jQuery(document).ready(function ($) {
  var form = $("#questionaire-form");

  $('#questionaire-form').validate({
    ignore: [],
    errorElement: 'div',
    errorClass: 'error',
    errorPlacement: function (error, element) {
      if (element.is(":radio")) {
        error.appendTo(element.parents('.answers'));
      } else if (element.is(":checkbox")) {
        error.appendTo(element.parents('.answers'));
      }
      else { // This is the default behavior 
        error.insertAfter(element);
      }
    }
  });

  // Generate numbers based on question
  var quesLength = $("#questionaire-form .questionaire-container .ques-wrap").length;
  var quesElem = "";
  for (var i = 1; i <= quesLength; i++) {
    quesElem += (i == 1) ? "<span class='active'>" + i + "</span>" : "<span>" + i + "</span>";;
  }
  $(".question-numbers").html(quesElem);

  // Intro button click
  $('.star-quest-btn').click(function () {
    var form = $("#questionaire-form");
    if ($('.welcome-intro').hasClass("show")) {
      $('.welcome-intro').removeClass("show")
    } else {
      $('.welcome-intro').addClass("hide");
    }

    form.addClass('show');
    form.find(".questionaire-container .ques-wrap").first().addClass("show");
    form.find('.next-btn').addClass("show");
    var activeQuesIndex = $(".ques-wrap.show").index();
    $(".question-numbers").find("span").eq(activeQuesIndex).addClass("active");
    addValidationToNextQuestion();
  })


  $(':input, select').on('change', function (e) {
    var inputType = $(this).attr('type');
    if (inputType == 'radio') {
      $(this).parents('li.text-option').siblings().removeClass('active');
      $(this).parents(".text-option").siblings().find("input[type=radio").prop('checked', false).attr('checked', false);
      $(this).parents('li.text-option').addClass("active");
      $(this).parents('li.text-option').find("input[type=radio").prop('checked', true).attr('checked', true);
    }

    if (inputType == 'checkbox') {
      if ($(this).parents('li.text-option').hasClass("active")) {
        $(this).parents('li.text-option').removeClass("active")
        $(this).prop('checked', false).attr('checked', false);
      } else {
        $(this).parents('li.text-option').addClass("active")
        $(this).prop('checked', true).attr('checked', true);
      }
    }
  });

  // GO TO PREVIOUS QUESTION
  $(".previous-ques").click(function () {
    var $currentQues = $('.questionaire-container').find(".ques-wrap.show");
    var activeQuesIndex = $currentQues.index();
    $(".question-numbers").find("span").eq(activeQuesIndex).removeClass("active");
    removeValidationFromCurrentQuestion();

    //first question
    if (activeQuesIndex == 0) {
      $("#questionaire-form").removeClass("show");
      $(".welcome-intro").addClass("show");
    }

    if (activeQuesIndex >= 1) {
      var $prev = $currentQues.prev();
      $prev.addClass('show');
      $currentQues.removeClass('show');

      if ($(".ques-wrap.show").next().length > 0) {
        $("#questionaire-form input[type='submit']").val("Next");
      }
    }
  })

  form.submit(function (event) {

    event.preventDefault();

    var formDataObject = {};
    $(this).serializeArray().forEach(function (item) {
      if (formDataObject.hasOwnProperty(item.name)) {
        formDataObject[item.name] += ';' + item.value;
      } else {
        formDataObject[item.name] = item.value;
      }
    });

    const contactId = '210401';

    var requestOptions = {
      'method': 'POST',
      'headers': {
        'Content-Type': 'application/json',
      },
      'body': JSON.stringify({
        data: formDataObject,
        id: contactId
      }),
    };

    return fetch("/_hcms/api/updateContact", requestOptions)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        if (data.Response.statusCode === 200) {
          window.location.href = "/dashboard";
        } else {
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
  });

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

  $("#questionaire-form input[type='submit']").click(function (e) {
    e.preventDefault();
    var form = $("#questionaire-form");
    if (form.valid()) {
      var $activeQues = $(".ques-wrap.show");
      if ($(".ques-wrap.show").next().length == 0) {
        $("#questionaire-form input[type='submit']").val("Done");
      }
      if ($activeQues.next().length == 0) {
        form.submit();
      }
      if ($activeQues.next().length > 0) {
        $activeQues.removeClass("show")
        $activeQues.next().addClass("show");
        var $activeQuesIndex = $(".ques-wrap.show").index();
        $(".question-numbers span").eq($activeQuesIndex).addClass("active");

        addValidationToNextQuestion();

        if ($(".ques-wrap.show").next().length == 0) {
          $("#questionaire-form input[type='submit']").val("Done");
        }
      }
    }
  })

  function addValidationToNextQuestion() {
    var nextQuestionInputname = $(".ques-wrap.show").find("input").attr("name");
    var message = "At least one option must be selected"
    updateRulesForInputs(nextQuestionInputname, 'add', message);
  }

  function removeValidationFromCurrentQuestion() {
    var $currentQues = $('.questionaire-container').find(".ques-wrap.show");
    var currentQuestionInputname = $currentQues.find("input").attr("name");
    $(form).find("input[name='" + currentQuestionInputname + "']").each(function () {
      $(this).rules("remove", "required");
    });
  }

  function updateRulesForInputs(inputName, action, msg) {
    var form = $("#questionaire-form");
    $(form).find('input[name=' + inputName + ']').each(function () {
      $(this).rules(action, {
        required: true,
        messages: { required: msg }
      });
    })
  }
})
