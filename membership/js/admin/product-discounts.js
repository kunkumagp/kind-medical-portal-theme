jQuery(document).ready(function ($) {

  var monthOptions = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const pagination = $('#pagination');
  const tableId = 7946284;
  let currentPage = 1;
  const limit = 3;
  let totalPages;
  $('.loading').show();
  console.log("02");

  async function getHubDbTableRows() {
    $('.loading').show();
    const after = (currentPage - 1) * limit;
    var requestOptions = {
      'method': 'POST',
      'headers': {
        'Content-Type': 'application/json',
      },
      'body': JSON.stringify({
        data: '',
        tableId: tableId,
        limit: limit,
        offset: after
      }),
    };

    try {
      const response = await fetch("/_hcms/api/getHubDbTableRows", requestOptions);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log(data.Response.data.results);
      updatePagination(data.Response.data.total);
      apendData(data.Response.data.results);

      if (data.Response.statusCode !== 200) {
      }

      return data.Response.statusCode;
    } catch (error) {
      throw error;
    }
  }

  function updatePagination(totalItems) {

    const pagination = $('#pagination');
    pagination.empty();

    if (totalItems <= limit) return;

    totalPages = Math.ceil(totalItems / limit);

    const prevButton = `<a class="page page-prev"><svg width="8" height="12" viewBox="0 0 8 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6.5 11L1.5 6L6.5 1" stroke="#7F7F7F" stroke-width="2"/>
            </svg></a>`;
    pagination.append(prevButton);

    for (let i = 1; i <= totalPages; i++) {
      const button = `<a class="page${currentPage === i ? ' active' : ''}">${i}</a>`;
      pagination.append(button);
    }

    const nextButton = `<a class="page page-next"><svg width="8" height="12" viewBox="0 0 8 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1.5 1L6.5 6L1.5 11" stroke="#7F7F7F" stroke-width="2"/>
              </svg></a>`;
    pagination.append(nextButton);

    updatePaginationVisibility();

    pagination.off('click', '.page').on('click', '.page', handlePageClick);
  }

  function handlePageClick() {
    const $this = $(this);
    if ($this.hasClass('page-prev') && currentPage > 1) {
      currentPage--;
    } else if ($this.hasClass('page-next') && currentPage < totalPages) {
      currentPage++;
    } else {
      currentPage = parseInt($this.text());
    }
    getHubDbTableRows();
    updatePaginationVisibility();
  }

  function updatePaginationVisibility() {
    $('.page-prev').toggle(currentPage > 1);
    $('.page-next').toggle(currentPage < totalPages);
  }

  function apendData(data) {
    var container = $('#product-discounts');
    container.empty();
    data.forEach(item => {

      var product = item.values;

      var stockItemHtml = `
        <div class="single-product flex">
           <div class="prod-name text-blue-dark font-bold">
                ${product.product_name}<sup>TM</sup>
            </div>
          <div class="prod-discount-info flex light-secondary-label">
            <div class="price-by-size">
               <label for="product_size_price">RRP per 10g ($) :</label>
                <input type="text" name="product_size_price" value="${product.rrp ? product.rrp : ''}">
            </div>
            <div class="discounted-price">
               <label for="discount_price">Discount price ($)</label>
                <input type="text" name="discount_price" value="">
            </div>
          </div>
        </div>
      `;

      container.append(stockItemHtml);
      $('.loading').hide();
    });
  }

  $('#save-product-discounts').click(function(e) {
    e.preventDefault(); // Prevent the default form submission

    var allProductsData = [];

    $('.single-product').each(function() {
      var productData = {
        productName: $(this).find('.prod-name').text().trim(),
        rrp: $(this).find('input[name="product_size_price"]').val(),
        discountPrice: $(this).find('input[name="discount_price"]').val()
      };
      allProductsData.push(productData);
    });

    console.log(allProductsData); // Contains all products' data
    // You can now send this data to your backend
  });


  function publishATableFromDraft() {
    var requestOptions = {
      'method': 'POST',
      'headers': {
        'Content-Type': 'application/json',
      },
      'body': JSON.stringify({
        tableId: tableId,
        data: ''
      }),
    };
    return fetch("/_hcms/api/publishATableFromDraft", requestOptions)
      .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
      .then(data => {
      return data.Response.statusCode;
    })
      .catch(error => {
      throw error;
    });
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

  getHubDbTableRows();

});
