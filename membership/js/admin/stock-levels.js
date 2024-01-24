jQuery(document).ready(function ($) {

  var monthOptions = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const pagination = $('#pagination');
  const tableId = 7946284;
  let currentPage = 1;
  const limit = 3;
  let totalPages;

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
    var container = $('#stock-lists');
    container.empty();
    data.forEach(item => {

      var product = item.values;

      var stockItemHtml = `
      <div class="single-stock flex" data-row-id="${item.id}">
        <div class="product-name text-blue-dark font-bold">
          ${product.product_name}<sup>TM</sup>
        </div>
        <div class="stock-info custom-select md grey">
          <select name="stock-level">
            <option value="">Please Select...</option>
            <option value="Low Stock" ${product.stock_levels?.name === 'Low Stock' ? 'selected' : ''}>Low Stock</option>
            <option value="Moderate Stock" ${product.stock_levels?.name === 'Moderate Stock' ? 'selected' : ''}>Moderate Stock</option>
            <option value="High Stock" ${product.stock_levels?.name === 'High Stock' ? 'selected' : ''}>High Stock</option>
            <option value="Coming Soon" ${product.stock_levels?.name === 'Coming Soon' ? 'selected' : ''}>Coming Soon</option>
          </select>
          <div class="shipment-info flex">
            <div class="col shipment-col">
              <label for="next_shipment">Next shipment</label>
              <select name="next-shipment">
                <option value="">Please Select</option>
                <option value="Discontinued" ${product.next_shipment?.name === 'Discontinued' ? 'selected' : ''}>Discontinued</option>
                <option value="Restock" ${product.next_shipment?.name === 'Restock' ? 'selected' : ''}>Restock</option>
              </select>
            </div>
            <div class="col time-col">
              <label for="time">Time</label>
              <select name="next-shipment">
                <option value="">Please Select</option>
                <option value="Early" ${product.time?.name === 'Early' ? 'selected' : ''}>Early</option>
                <option value="Mid" ${product.time?.name === 'Mid' ? 'selected' : ''}>Mid</option>
                <option value="Late" ${product.time?.name === 'Late' ? 'selected' : ''}>Late</option>
              </select>
            </div>
            <div class="col month-col">
              <label for="time">Month</label>
              <select name="next-shipment">
                ${monthOptions.map(month => `<option value="${month}" ${product.month?.name === month ? 'selected' : ''}>${month}</option>`).join('')}
              </select>
            </div>
          </div>
        </div>
      </div>
      `;

      container.append(stockItemHtml);
      $('.loading').hide();
    });
  }

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

  function updateHubDbTableRows(rowId, jsonData) {
    var requestOptions = {
      'method': 'POST',
      'headers': {
        'Content-Type': 'application/json',
      },
      'body': JSON.stringify({
        tableId: tableId,
        rowId: rowId,
        data: jsonData
      }),
    };
    return fetch("/_hcms/api/updateHubDbTableRows", requestOptions)
      .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
      .then(data => {
      // $('.loading').hide();
      if (data.Response.statusCode === 200) {
        const msg = { "msg_type": "success-msg", "message": "Stock levels updated!" };
        showNotificationMessage(msg);
        publishATableFromDraft();
      } else {
        const msg = { "msg_type": "error-msg", "message": "Stock levels update Failed!" };
        showMessage(msg);
      }
      return data.Response.statusCode;
    })
      .catch(error => {
      throw error;
    });
  }

  $('.stock-level-container').on('change', 'select', function () {
    // $('.loading').show();
    var $parentDiv = $(this).closest('.single-stock');
    var rowId = $parentDiv.data('row-id');
    var selectedStockLevel = $parentDiv.find('select[name="stock-level"]').val();
    var selectedNextShipment = $parentDiv.find('select[name="next-shipment"]').eq(0).val();
    var selectedShipmentTime = $parentDiv.find('select[name="next-shipment"]').eq(1).val();
    var selectedShipmentMonth = $parentDiv.find('select[name="next-shipment"]').eq(2).val();

    var jsonData = {
      values: {
        stock_levels: {
          name: selectedStockLevel
        },
        next_shipment: {
          name: selectedNextShipment
        },
        time: {
          name: selectedShipmentTime
        },
        month: {
          name: selectedShipmentMonth
        }
      }
    };

    updateHubDbTableRows(rowId, jsonData);
  });

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
