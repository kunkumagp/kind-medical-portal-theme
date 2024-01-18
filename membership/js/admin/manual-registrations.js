jQuery(document).ready(function ($) {
    const API_URL = "/_hcms/api/searchMember";
    const $memDetailsContainer = $(".mem-lists");
    const $pagination = $('#pagination');
    let currentPage = 1;
    const limit = 4;
    let filterValues;
    let totalPages;
    let hcpType = [];

    function fetchAndUpdateData() {
        const after = (currentPage - 1) * limit;
        const requestOptions = createRequestOptions(filterValues, limit, after);

        toggleLoading(true);

        fetch(API_URL, requestOptions)
            .then(handleResponse)
            .then(updatePage)
            .catch(handleError)
            .finally(() => toggleLoading(false));
    }

    async function fetchProperty() {
        var propertyOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ propertyName: 'hcp_type' })
        };

        try {
            const response = await fetch("/_hcms/api/getProperty", propertyOptions);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            let data = await response.json();

            if (data.Response.statusCode === 200) {
                const originalData = data.Response.data.options;
                const transformedData = originalData.reduce((acc, item) => {
                    acc[item.value] = item.label;
                    return acc;
                }, {});

                hcpType = transformedData;

            } else {
                const msg = { "msg_type": "error-msg", "message": "Contact Rejected Failed!" };
                showMessage(msg);
            }

        } catch (error) {
            // Handle the error here
            throw error;
        }
    }

    function createRequestOptions(filterValues, limit, after) {
        return {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ filterValues, limit, after })
        };
    }

    function handleResponse(response) {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    }

    function updatePage(data) {
        if (data.Response.statusCode === 200) {
            updatePagination(data.Response.data.total);
            updateDetailsContainer(data.Response.data.results);
        }
    }

    function handleError(error) {
        console.error('Error:', error);
    }

    function toggleLoading(show) {
        $('.loading').toggle(show);
    }

    function updatePagination(totalItems) {
        if (totalItems <= limit) return;

        totalPages = Math.ceil(totalItems / limit);
        $pagination.empty().append(createPaginationButtons(totalPages));
        updatePaginationVisibility();

        $pagination.off('click', '.page').on('click', '.page', handlePageClick);
    }

    function createPaginationButtons(totalPages) {
        let buttons = `<a class="page page-prev">Previous</a>`;

        for (let i = 1; i <= totalPages; i++) {
            buttons += `<a class="page${currentPage === i ? ' active' : ''}">${i}</a>`;
        }

        buttons += `<a class="page page-next">Next</a>`;
        return buttons;
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
        fetchAndUpdateData();
        updatePaginationVisibility();
    }

    function updatePaginationVisibility() {
        $('.page-prev').toggle(currentPage > 1);
        $('.page-next').toggle(currentPage < totalPages);
    }

    function updateDetailsContainer(data) {
        const detailsContent = data.map(item =>
            `<a href="/inactive/account-details?id=${item.id}" class="d-block">
                <div class="details">
                    <span class="name"><h5 class="text-primary mb-4">${item.properties.firstname} ${item.properties.lastname}</h5></span>
                    <span class="hcp-type font-small">${getHcpType(item.properties.hcp_type)}</span>
                </div>
            </a>`
        ).join('');

        $memDetailsContainer.empty().append(detailsContent);
    }

    function getHcpType(hcpTypeKey) {
        const displayValue = hcpType[hcpTypeKey] !== undefined ? hcpType[hcpTypeKey] : '';
        return displayValue;
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

    function handleFilterItemClick() {
        currentPage = 1;
        filterValues = createFilterValues();
        fetchAndUpdateData();
    }

    function createFilterValues() {
        return [
            { filters: [{ value: 'Pending', propertyName: 'membership_status', operator: 'EQ' }] }
        ];
    }
  
    function main(){
      fetchProperty().then(()=>{
        handleFilterItemClick();                          
      })
    }
  
    main();
});
