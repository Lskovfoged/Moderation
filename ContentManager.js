// ==UserScript==
// @name         FOGs Content Manager Upgrades
// @namespace    http://funnyjunk.com
// @version      1.2
// @description  Improves content manager and changes the UI
// @author       Your Name
// @match        https://funnyjunk.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
// Function to create a simple lightbox
function createLightbox() {
    var lightbox = document.createElement('div');
    lightbox.id = 'customLightbox';
    lightbox.style.display = 'none';
    lightbox.style.position = 'fixed';
    lightbox.style.top = '0';
    lightbox.style.left = '0';
    lightbox.style.width = '100%';
    lightbox.style.height = '100%';
    lightbox.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    lightbox.style.zIndex = '9999';
    lightbox.style.overflow = 'auto';
    lightbox.style.textAlign = 'center';
    lightbox.style.justifyContent = 'center';
    lightbox.style.alignItems = 'center';

    var content = document.createElement('div');
    content.id = 'customLightboxContent';
    content.style.display = 'inline-block';
    content.style.maxWidth = '80%';
    content.style.position = 'relative';

    lightbox.appendChild(content);

    lightbox.addEventListener('click', function(event) {
        if (event.target === lightbox) {
            closeLightbox();
        }
    });

    document.body.appendChild(lightbox);

    return {
        lightbox: lightbox,
        content: content
    };
}

// Function to close the lightbox
function closeLightbox() {
    var lightbox = document.getElementById('customLightbox');
    var content = document.getElementById('customLightboxContent');
    lightbox.style.display = 'none';
    content.innerHTML = ''; // Clear content
}

// Function to open content in lightbox
function openInLightbox(dataId, isVideo) {
    var lightbox = document.getElementById('customLightbox');
    var content = document.getElementById('customLightboxContent');

    // Check if the lightbox is already open with the same content
    if (lightbox.style.display === 'flex' && content.firstChild && content.firstChild.getAttribute('data-type') === (isVideo ? 'video' : 'image') && content.firstChild.getAttribute('data-src') === dataId) {
        closeLightbox();
        return;
    }

    // Clear existing content
    content.innerHTML = '';

    if (isVideo) {
        // Create new video element
        var videoElement = document.createElement('video');
        videoElement.src = dataId;
        videoElement.controls = true;
        videoElement.style.maxWidth = '100%';
        videoElement.style.maxHeight = '80vh';
        videoElement.style.margin = 'auto';
        videoElement.setAttribute('data-type', 'video');
        videoElement.setAttribute('data-src', dataId);

        // Append video to lightbox content
        content.appendChild(videoElement);
    } else {
        // Create new image element
        var imageElement = document.createElement('img');
        imageElement.src = dataId;
        imageElement.style.maxWidth = '100%';
        imageElement.style.maxHeight = '80vh';
        imageElement.style.margin = 'auto';
        imageElement.setAttribute('data-type', 'image');
        imageElement.setAttribute('data-src', dataId);

        // Add click listener to the image to close the lightbox
        imageElement.addEventListener('click', function() {
            closeLightbox();
        });

        // Append image to lightbox content
        content.appendChild(imageElement);
    }

    // Display lightbox
    lightbox.style.display = 'flex';
}

    // Function to modify HTML structure as needed
    function modifyHTML(conRows) {
        conRows.forEach(function(conRow) {
            var conFlexRow = conRow.querySelector('.conFlexRow.conBigRow');
            if (!conFlexRow) return;

            var viewU2 = conFlexRow.querySelector('.viewU2');
            if (viewU2) {
                viewU2.remove();

                var conImg = conFlexRow.querySelector('.conImg');
                if (conImg) {
                    var dataId = viewU2.getAttribute('data-id');
                    var isVideo = dataId.toLowerCase().endsWith('.mp4');

                    conImg.addEventListener('click', function() {
                        if (isVideo) {
                            openInLightbox(dataId, true);
                        } else {
                            openInLightbox(dataId, false);
                        }
                    });
                }
            }
        });

        // Add click event listener to clear selection
        var clearSelection = document.querySelector('.conCount');
        if (clearSelection) {
            clearSelection.addEventListener('click', function() {
                var checkboxes = document.querySelectorAll('#conHolder input[type="checkbox"]');
                var checkboxesArray = Array.from(checkboxes);
                var batchSize = 100; // Adjust batch size based on performance testing

                function processBatch(startIndex) {
                    var endIndex = Math.min(startIndex + batchSize, checkboxesArray.length);

                    for (var i = startIndex; i < endIndex; i++) {
                        checkboxesArray[i].checked = false;
                    }

                    if (endIndex < checkboxesArray.length) {
                        // Schedule next batch after a short delay
                        setTimeout(function() {
                            processBatch(endIndex);
                        }, 0); // Adjust delay as needed for performance
                    } else {
                        // Update CMCount text content after clearing checkboxes
                        var cmCount = document.querySelector('.CMCount');
                        if (cmCount) {
                            cmCount.textContent = '(0)';
                        }
                    }
                }

                // Start processing batches
                processBatch(0);
            });
        }
    }

    // Function to handle mutations and modify HTML structure
    function handleMutations(mutationsList, observer) {
        for (var mutation of mutationsList) {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                var conRowElements = document.querySelectorAll('.conRow');
                if (conRowElements.length > 0) {
                    modifyHTML(conRowElements);
                    SL.clickableClasses.push("conRowHolder");

                    // Select all elements with class .showHidden
                    var elements = document.querySelectorAll('.showHidden');

                    // Iterate over each element and trigger a click event
                    elements.forEach(function(element) {
                        element.click(); // Trigger the click event
                    });
                }
            }
        }
    }

    // Initialize MutationObserver to watch for changes in the document body
    var observer = new MutationObserver(handleMutations);
    observer.observe(document.body, { childList: true, subtree: true });

    // Wait for the page to load before initial modification
    window.addEventListener('load', function() {
        createLightbox();
        var conRowElements = document.querySelectorAll('.conRow');
        if (conRowElements.length > 0) {
            modifyHTML(conRowElements);
        }
    });

    // Apply custom CSS styles
    var customStyles = `
        /* Adjustments for .conHolder */
        div.conHolder {
            display: flex;
            flex-wrap: wrap;
            justify-content: space-around;
            padding: 10px;
            background-color: rgb(40, 40, 40);
        }

        /* Adjustments for .conRow */
        div.conRow {
            display: inline-flex;
            align-items: center;
            justify-content: center; /* Changed to center the content */
            height: 175px;
            width: 175px;
            margin: 10px;
            background-color: rgb(40, 40, 40);
            font: 400 14px arial, sans-serif;
            text-align: center;
            color: rgb(241, 241, 241);
            position: relative;
            overflow: hidden;
        }

        /* Adjustments for .conFlexRow.conBigRow */
        div.conRow .conFlexRow.conBigRow {
            width: 100%;
            display: flex;
            flex-direction: column;
            justify-content: center; /* Changed to center the content */
            align-items: center; /* Center the items horizontally */
            font: 400 14px arial, sans-serif;
            text-align: center;
            color: rgb(241, 241, 241);
            background-color: rgb(40, 40, 40);
            position: relative;
            overflow: hidden;
        }

        /* Adjustments for img.conImg */
        div.conRow img.conImg {
            display: block;
            background-color: rgb(51, 0, 62);
            height: auto;
            max-width: 100%;
            margin: 0 auto;
        }

        /* Adjustments for input.conCheck */
        div.conRow input.conCheck {
            outline: none;
            cursor: pointer;
            height: 20px;
            width: 20px;
            background-color: rgb(43, 43, 43);
            color: rgb(255, 255, 255);
            font: 400 13.3333px Arial;
            position: absolute;
            top: 5px;
            right: 5px;
        }

        /* Adjustments for .repostKT, .clockNow, .isRe, .delKT */
        .repostKT, .clockNow, .isRe, .delKT {
            position: absolute;
            cursor: pointer;
            font: 400 14px arial, sans-serif;
            text-align: center;
            color: rgb(241, 241, 241);
            background-color: rgb(40, 40, 40);
        }

        .repostKT {
            top: 5px;
            right: 84%;
        }

        .clockNow {
            top: 30px;
            right: 90%;
            transform: translateX(50%);
        }

        .isRe {
            top: 60px;
            right: 10px;
            transform: translateY(-50%);
        }

        .delKT {
            top: 40px;
            right: 15px;
            transform: translateY(-50%);
        }

        /* Adjustments for div.conRelease */
        div.conRow div.conRelease {
            display: block;
            background-color: rgb(64, 64, 64);
            margin: 5px 0;
            width: 120px;
            font: 400 14px arial, sans-serif;
            text-align: center;
            color: rgb(241, 241, 241);
        }

        /* Adjustments for div.thumbRow */
        div.conRow div.thumbRow {
            display: block;
            width: 150px;
            font: 400 14px arial, sans-serif;
            text-align: center;
            color: rgb(241, 241, 241);
            background-color: rgb(40, 40, 40);
            margin-top: 5px;
        }

        /* Adjustments for div.conChan2 */
        div.conRow div.conChan2 {
            display: flex;
            flex-direction: column;
            justify-content: center; /* Changed to center the content */
            align-items: center; /* Center the items horizontally */
            font: 400 14px arial, sans-serif;
            text-align: center;
            color: rgb(241, 241, 241);
            background-color: rgb(40, 40, 40);
        }

        /* Adjustments for a.chanSearchBox */
        div.conRow a.chanSearchBox {
            color: rgb(170, 170, 170);
            text-decoration: none solid rgb(170, 170, 170);
            background-color: rgb(25, 1, 45);
            border-radius: 2px;
            display: inline-block;
            margin: 2px;
            padding: 2px 3px;
            font: 400 14px arial, sans-serif;
            text-align: center;
            border: 1px solid rgb(82, 16, 118);
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            max-width: 100%;
            transition: font-size 0.2s;
        }

        /* Adjustments for a.conRowA */
        div.conRow a.conRowA {
            display: block;
            width: 100%;
            font: 400 14px arial, sans-serif;
            text-align: center;
            color: rgb(170, 170, 170);
            text-decoration: none solid rgb(170, 170, 170);
            background-color: rgb(40, 40, 40);
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            transition: font-size 0.2s;
        }

        /* Adjustments for .conCount */
        .conCount {
            background-color: rgb(58, 58, 58);
            left: 10px;
            padding: 1px 4px;
            position: absolute;
            text-align: center;
            font-family: Arial, Verdana, sans-serif;
            font-size: 12px;
            border: 1px solid rgb(77, 77, 77);
            top: 175px; /* Adjusted top position */
            cursor: pointer;
        }

        .conCount:hover {
            background-color: rgb(78, 78, 78);
        }
    `;

    var styleElement = document.createElement('style');
    styleElement.textContent = customStyles;
    document.head.appendChild(styleElement);

})();