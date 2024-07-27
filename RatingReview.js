// ==UserScript==
// @name         FJme.me Rating Review
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Adds button to mark range as reviewed and open range in new tabs
// @author       You
// @match        https://fjme.me/mods/ratings/*
// @match        https://funnyjunk.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_notification
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';

    const TOKEN_STORAGE_KEY = 'PT_memeToken';

    // Function to add a button on funnyjunk.com to retrieve and save the token
    function addTokenRetrievalButton() {
        const topME = document.querySelector('#topME');
        if (!topME) return;

        const span = document.createElement('span');
        span.className = 'smallLeftMenu smallLines mIte tpO';
        span.textContent = 'Get Review Token';
        span.title = 'Rating Review Token';
        span.style.cursor = 'pointer';

        span.addEventListener('click', function() {
            const token = localStorage.getItem('PT_memeToken');
            if (token) {
                GM_setValue(TOKEN_STORAGE_KEY, token);
                flashMessage.showSuccess(`Got review token`);
                console.log(localStorage.getItem("PT_memeToken"));
                GM_notification('PT_memeToken saved successfully!', 'Success');
            } else {
                flashMessage.showError(`Token not found`);
                GM_notification('Token not found.', 'Error');
            }
        });

        topME.appendChild(span);
    }

    if (window.location.href.startsWith('https://funnyjunk.com')) {
        console.log('Adding token retrieval button to funnyjunk.com');
        addTokenRetrievalButton();
        return;
    }

    if (window.location.href.startsWith('https://fjme.me/mods/ratings/')) {
        // Function to add the "Open Range in New Tabs" button and its functionality
        function addOpenTabsButton() {
            const referenceButton = document.querySelector('#changeDateRange');

            if (referenceButton) {
                console.log('Adding "Open Range in New Tabs" button');
                const button = document.createElement('button');
                button.className = 'btn btn-info';
                button.id = 'openRates';
                button.textContent = 'Open Range in New Tabs';

                referenceButton.insertAdjacentElement('afterend', button);

                button.addEventListener('click', function() {
                    document.querySelectorAll('.panel-heading > a[href*="funnyjunk"]').forEach(function(link) {
                        const url = link.href;
                        // Skip links that contain '/nsfw/'
                        if (url.includes('/nsfw/')) {
                            console.log(`Skipping NSFW URL: ${url}`);
                            return;
                        }
                        console.log(`Opening URL: ${url}`);
                        window.open(url, '_blank');
                    });
                });
            } else {
                console.log('Reference button not found for "Open Range in New Tabs" button.');
            }
        }

        // Function to add the "Mark All Ranges as Reviewed" button and its functionality
        function addMarkReviewedButton() {
            const referenceButton = document.querySelector('#changeDateRange');

            if (referenceButton) {
                console.log('Adding "Mark Range as Reviewed" button');
                const button = document.createElement('button');
                button.className = 'btn btn-info';
                button.id = 'reviewRates';
                button.textContent = 'Mark Range as Reviewed';

                button.addEventListener('click', function() {
                    document.body.style.cursor = 'wait'; // Change cursor to loading icon

                    const contentLinks = document.querySelectorAll('.panel-heading > a[href*="/mods/contentInfo/"]');
                    const toReview = [];

                    contentLinks.forEach(link => {
                        const url = link.getAttribute('href');
                        const fjcontent = url.split('/').pop();
                        const panelHeading = link.closest('.panel-heading');
                        const panelBody = link.closest('.panel').querySelector('.panel-body');

                        // Skip if panel-heading URL has NSFW
                        const hasNSFW = panelHeading.querySelector('a[href*="/nsfw/"]');
                        if (hasNSFW) {
                            console.log(`Skipping NSFW content: ${url}`);
                            return;
                        }

                        // Check if the specific div is present in panelBody
                        const reviewNeeded = panelBody.querySelector('.label.label-warning.content_needs_review');

                        if (fjcontent && reviewNeeded) {
                            toReview.push(fjcontent);
                        }
                    });

                    if (toReview.length === 0) {
                        console.log('No content to mark as reviewed.');
                        document.body.style.cursor = ''; // Change cursor back
                        return;
                    }

                    let requestsCompleted = 0;
                    const totalRequests = toReview.length;

                    // Retrieve the Bearer token from Tampermonkey storage
                    const BEARER_TOKEN = GM_getValue(TOKEN_STORAGE_KEY);

                    if (!BEARER_TOKEN) {
                        alert('Bearer token not found. Please visit funnyjunk.com and click "Get Review Token" button.');
                        document.body.style.cursor = ''; // Change cursor back
                        return;
                    }

                    console.log('Bearer token retrieved successfully.');

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
                                    document.body.style.cursor = ''; // Change cursor back
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
            } else {
                console.log('Reference button not found for "Mark Range as Reviewed" button.');
                document.body.style.cursor = ''; // Change cursor back
            }
        }

        // Wait for the page content to load before adding the buttons
        window.addEventListener('load', function() {
            console.log('Page loaded. Adding buttons.');
            addOpenTabsButton();
            addMarkReviewedButton();
        });
    }
})();
