// ==UserScript==
// @name         FJme.me Rating Review
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Adds button to mark range as reviewed and open range in new tabs
// @author       You
// @match        https://fjme.me/mods/ratings/*
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';

    // Hardcoded Bearer token (Manually retrieved)
    const BEARER_TOKEN = 'PASTE YOUR TOKEN HERE';

    // Function to add the "Open Range in New Tabs" button and its functionality
    function addOpenTabsButton() {
        const referenceButton = document.querySelector('#changeDateRange');

        if (referenceButton) {
            const button = document.createElement('button');
            button.className = 'btn btn-info';
            button.id = 'openRates';
            button.textContent = 'Open Range in New Tabs';

            referenceButton.insertAdjacentElement('afterend', button);

            button.addEventListener('click', function() {
                document.querySelectorAll('.panel-heading > a[href*="funnyjunk"]').forEach(function(link) {
                    const url = link.href;
                    console.log(`Opening URL: ${url}`);
                    window.open(url, '_blank');
                });
            });
        }
    }

    // Function to add the "Mark All Ranges as Reviewed" button and its functionality
    function addMarkReviewedButton() {
        const referenceButton = document.querySelector('#changeDateRange');

        if (referenceButton) {
            const button = document.createElement('button');
            button.className = 'btn btn-info';
            button.id = 'reviewRates';
            button.textContent = 'Mark Range as Reviewed';

            button.addEventListener('click', function() {
                const contentLinks = document.querySelectorAll('.panel-heading > a[href*="/mods/contentInfo/"]');
                const toReview = [];

                contentLinks.forEach(link => {
                    const url = link.getAttribute('href');
                    const fjcontent = url.split('/').pop();
                    const panelBody = link.closest('.panel').querySelector('.panel-body');

                    // Ensure the content review check is accurate
                    const reviewed = panelBody.querySelectorAll('table tbody tr.success').length > 0;

                    if (fjcontent && !reviewed) {
                        toReview.push(fjcontent);
                    }
                });

                if (toReview.length === 0) {
                    console.log('No content to mark as reviewed.');
                    return;
                }

                let requestsCompleted = 0;
                const totalRequests = toReview.length;

                toReview.forEach(fjcontent => {
                    const requestUrl = `/api/ratings/removeNeedsReview/${fjcontent}`;
                    console.log(`Request URL: ${requestUrl}`);

                    axios.get(requestUrl, {
                        headers: {
                            'Authorization': `Bearer ${BEARER_TOKEN}`,
                            'Accept': 'application/json',
                            'X-Requested-With': 'XMLHttpRequest'
                        }
                    })
                    .then(response => {
                        // Check for expected success response
                        if (response.data && Array.isArray(response.data) && response.data[0] === "OK") {
                            console.log(`Content ${fjcontent} marked as reviewed successfully.`);
                        } else {
                            console.error(`Unexpected response data for content ${fjcontent}:`, response.data);
                        }
                    })
                    .catch(error => {
                        console.error('Error:', error.response ? error.response.data : error.message);
                    })
                    .finally(() => {
                        requestsCompleted++;
                        // Check if all requests are completed
                        if (requestsCompleted === totalRequests) {
                            console.log('All content marked as reviewed. Refreshing the page.');
                            window.location.reload();  // Refresh the page
                        }
                    });
                });
            });

            referenceButton.insertAdjacentElement('afterend', button);
        }
    }

    // Wait for the page content to load before adding the buttons
    window.addEventListener('load', function() {
        addOpenTabsButton();
        addMarkReviewedButton();
    });
})();
