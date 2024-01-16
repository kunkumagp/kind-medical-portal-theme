jQuery(document).ready(function ($) {
    const API_URL = "/_hcms/api/searchMember";
    const $memberTypeListItems = $(".member-type ul li");
    const $memDetailsContainer = $(".mem-lists");
    let currentPage = 1;
    const limit = 4;
    let filterValues;
    let hcpType;
    const deactivationMessage = localStorage.getItem('deactivationMessage');

    function fetchPropertyAndSaveLS() {
        var propertyOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ propertyName: 'hcp_type' })
        };

        toggleLoading(true);

        return fetch("/_hcms/api/getProperty", propertyOptions)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                if (data.Response.statusCode === 200) {
                    const originalData = data.Response.data.options;
                    const transformedData = originalData.reduce((acc, item) => {
                        acc[item.value] = item.label;
                        return acc;
                    }, {});

                    hcpType = transformedData;

                    localStorage.setItem('hcpType', JSON.stringify(hcpType));

                    return hcpType;

                } else {
                    const msg = { "msg_type": "error-msg", "message": "Contact Rejected Failed!" };
                    showMessage(msg);
                }

            })
            .catch(error => {
                throw error;
            });
    }

    async function getHcpTypeFromLocalStorage() {
        let storedHcpType = localStorage.getItem('hcpType');

        if (storedHcpType) {
            hcpType = JSON.parse(storedHcpType);
        } else {
            try {
                hcpType = await fetchPropertyAndSaveLS();
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }
    }

    async function fetchData() {
        try {
            await getHcpTypeFromLocalStorage();
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    function fetchAndUpdateData() {
        let after = (currentPage - 1) * limit;
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                filterValues: filterValues,
                limit: limit,
                after: after
            }),
        };

        $('.loading').show();

        return fetch(API_URL, requestOptions)
            .then(response => {
                $('.loading').hide();

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                if (data.Response.statusCode === 200) {
                    pagination(data.Response.data.total);
                    updateDetailsContainer(data.Response.data.results);
                }
            })
            .catch(error => {
                console.error('Error:', error);
                $('.loading').hide();
            });
    }

    function pagination(totalItems) {
        const $pagination = $('#pagination');
        $pagination.empty();

        if (totalItems <= limit) {
            return;
        }

        const totalPages = Math.ceil(totalItems / limit);

        const prevButton = `<a class="page page-prev"><svg width="8" height="12" viewBox="0 0 8 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6.5 11L1.5 6L6.5 1" stroke="#7F7F7F" stroke-width="2"/>
              </svg></a>`;
        $pagination.append(prevButton);

        for (let i = 1; i <= totalPages; i++) {
            const button = `<a class="page${currentPage === i ? ' active' : ''}">${i}</a>`;
            $pagination.append(button);
        }

        const nextButton = `<a class="page page-next"><svg width="8" height="12" viewBox="0 0 8 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1.5 1L6.5 6L1.5 11" stroke="#7F7F7F" stroke-width="2"/>
                </svg></a>`;
        $pagination.append(nextButton);

        updatePaginationVisibility();

        $pagination.off('click', '.page');

        $pagination.on('click', '.page', function () {
            if ($(this).hasClass('page-prev') && currentPage > 1) {
                currentPage--;
                fetchDataAndUpdate();
                updatePaginationVisibility();
            } else if ($(this).hasClass('page-next') && currentPage < totalPages) {
                currentPage++;
                fetchDataAndUpdate();
                updatePaginationVisibility();
            } else {
                currentPage = parseInt($(this).text());
                fetchDataAndUpdate();
            }
        });

        function updatePaginationVisibility() {
            $('.page-prev').toggle(currentPage > 1);
            $('.page-next').toggle(currentPage < totalPages);
        }
    }

    function updateDetailsContainer(data) {
        $memDetailsContainer.empty();

        data.forEach(item => {
            const detailsContent = `<a href="/active/member-details?id=${item.id}" class="d-block">
                    <div class="details">
                        <span class="name">
                            <h5 class="text-primary mb-4">${item.properties.firstname} ${item.properties.lastname}</h5>
                        </span>
                        <span class="hcp-type font-small">${item.properties.hcp_type}</span>
                    </div>
                </a>`;
//           <span class="hcp-type font-small">${getHcpType(item.properties.hcp_type)}</span>

            $memDetailsContainer.append(detailsContent);
        });
    }

    function getHcpType(hcpTypeKey) {
        const displayValue = hcpType[hcpTypeKey] !== undefined ? hcpType[hcpTypeKey] : '';
        return displayValue;
    }

    function handleFilterItemClick() {
        $(this).toggleClass("active");

        const activeFilters = $memberTypeListItems
            .filter(".active")
            .map(function () {
                return [
                    {
                        filters: [
                            {
                                value: this.id,
                                propertyName: 'hcp_type',
                                operator: 'EQ',
                            },
                            {
                                value: 'manually_verified',
                                propertyName: 'membership_status',
                                operator: 'EQ',
                            }
                        ]
                    },
                    {
                        filters: [
                            {
                                value: this.id,
                                propertyName: 'hcp_type',
                                operator: 'EQ',
                            },
                            {
                                value: 'aphra_verified',
                                propertyName: 'membership_status',
                                operator: 'EQ',
                            }
                        ]
                    }
                ];
            })
            .get();

        const combinedFilters = [].concat.apply([], activeFilters);

        currentPage = 1;
        filterValues = combinedFilters.length > 0 ? combinedFilters : [
            {
                filters: [
                    {
                        value: 'manually_verified',
                        propertyName: 'membership_status',
                        operator: 'EQ',
                    }
                ]
            },
            {
                filters: [
                    {
                        value: 'aphra_verified',
                        propertyName: 'membership_status',
                        operator: 'EQ',
                    }
                ]
            }
        ];
        fetchDataAndUpdate();
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

    function fetchDataAndUpdate() {
        fetchAndUpdateData();
    }
  
    if (deactivationMessage) {
      const msg = { "msg_type": "success-msg", "message": deactivationMessage };
      showMessage(msg);
      localStorage.removeItem('deactivationMessage');
    }

    fetchData();
    handleFilterItemClick();
    $memberTypeListItems.click(handleFilterItemClick);
});
