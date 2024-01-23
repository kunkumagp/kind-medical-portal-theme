jQuery(document).ready(function ($) {

  console.log("13");
  const tableId = 7946284;

  function updateHubDbTableRows(rowId, jsonData) {
    console.log(jsonData);
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
      console.log(data.Response);
      if (data.Response.statusCode === 200) {
      } else {
      }
      return data.Response.statusCode;
    })
      .catch(error => {
      throw error;
    });
  }

  $('.stock-level-container').on('change', 'select', function() {
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










});
