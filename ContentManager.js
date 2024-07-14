// ==UserScript==
// @name         FOGs Content Manager Upgrades
// @namespace    http://funnyjunk.com
// @version      1.5
// @description  Improves content manager and changes the UI
// @author       FOG
// @match        https://funnyjunk.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    function makeLightBox(a) {
        const settings = {
            overlayBgColor: "#000",
            overlayOpacity: .8,
            fixedNavigation: !1,
            imageBtnPrev: "/site/js/sb/prevlabel.gif",
            imageBtnNext: "/site/js/sb/nextlabel.gif",
            imageBtnClose: "/site/js/sb/closelabel.gif",
            imageBlank: "/site/js/sb/lightbox-blank.gif",
            containerBorderSize: 10,
            containerResizeSpeed: 0,
            txtImage: "Image",
            txtOf: "of",
            keyToClose: "c",
            keyToPrev: "p",
            keyToNext: "n",
            imageArray: [],
            activeImage: 0,
            autoplay: 3,
            sound: 4
        };

        function initializeLightBox(a) {
            $("embed, object, select").css({visibility: "hidden"});
            createLightBox();
            settings.imageArray.length = 0;
            settings.activeImage = 0;
            settings.imageArray.push([a, "", a, "", ""]);
            showImage();
        }

        function createLightBox() {
            let a = $(".safeBlur");
            if (a.length) return a.removeClass("safeBlur"), !1;
            $(".onHoverImage").remove();
            $("body").append(`
                <div id="jquery-overlay"></div>
                <div id="jquery-lightbox">
                    <div id="lightbox-container-image-box">
                        <div id="lightbox-container-image">
                            <img id="lightbox-image">
                            <div id="lightbox-nav">
                                <a href="#" id="lightbox-nav-btnPrev"></a>
                                <a href="#" id="lightbox-nav-btnNext"></a>
                            </div>
                        </div>
                    </div>
                    <div id="lightbox-container-image-data-box">
                        <div id="lightbox-container-image-data">
                            <div id="lightbox-image-details">
                                <span id="lightbox-image-details-caption"></span>
                                <span id="lightbox-image-details-currentNumber"></span>
                            </div>
                            <div id="lightbox-secNav">
                                <a href="#" id="lightbox-secNav-btnClose">
                                    <img src="${settings.imageBtnClose}">
                                </a>
                            </div>
                        </div>
                    </div>
                </div>`);
            $("#jquery-overlay, #jquery-lightbox").css("z-index", 9999);
            let b = getPageDimensions();
            $("#jquery-overlay").css({backgroundColor: settings.overlayBgColor, opacity: settings.overlayOpacity, width: b[0], height: b[1]}).show();
            let c = getScrollPosition();
            $("#jquery-lightbox").css({top: c[1] + b[3] / 10, left: c[0]}).show();
            $("#jquery-overlay, #jquery-lightbox").click(closeLightBox);
            $("#lightbox-loading-link, #lightbox-secNav-btnClose").click(closeLightBox);
            $(window).resize(function() {
                let a = getPageDimensions();
                $("#jquery-overlay").css({width: a[0], height: a[1]});
                let b = getScrollPosition();
                $("#jquery-lightbox").css({top: b[1] + a[3] / 10, left: b[0]});
            });
        }

        function showImage() {
            $("#lightbox-loading").show();
            settings.fixedNavigation ? $("#lightbox-image, #lightbox-container-image-data-box, #lightbox-image-details-currentNumber").hide() : $("#lightbox-image, #lightbox-nav, #lightbox-nav-btnPrev, #lightbox-nav-btnNext, #lightbox-container-image-data-box, #lightbox-image-details-currentNumber").hide();
            let a = settings.imageArray[settings.activeImage][0],
                b = getFileType(a),
                c = settings.imageArray[0][settings.sound] ? "" : "muted",
                d = settings.imageArray[0][settings.autoplay] ? "autoplay" : "";
            ".mp4" === b ? ($("#lightbox-image").replaceWith(`<div id="lightbox-image">
                <video style="width: 100%" src="${a}" controls ${d} ${c}></video>
            </div>`), resizeLightBox(600, 400, !0)) : function() {
                let b = new Image;
                b.onload = function() {
                    $("#lightbox-image").attr("src", settings.imageArray[settings.activeImage][0]);
                    resizeLightBox(b.width, b.height);
                    b.onload = null;
                }, b.src = settings.imageArray[settings.activeImage][0];
            }();
        }

        function resizeLightBox(a, b, c = !1) {
            let d = $("#lightbox-container-image-box"),
                e = d.width(),
                f = d.height(),
                g = a + 2 * settings.containerBorderSize,
                h = b + 2 * settings.containerBorderSize;
            $("#lightbox-loading").hide();
            d.animate({width: g, height: h}, settings.containerResizeSpeed, function() {
                showLightBoxContent();
            });
            e === g && f === h ? sleep(c ? 250 : 100) : $("#lightbox-container-image-data-box").css({width: a});
            $("#lightbox-nav-btnPrev, #lightbox-nav-btnNext").css({height: b + 2 * settings.containerBorderSize});
        }

        function showLightBoxContent() {
            $("#lightbox-image").show();
            showImageDetails();
        }

        function showImageDetails() {
            $("#lightbox-container-image-data-box").show();
            $("#lightbox-image-details-caption").hide();
        }

        function closeLightBox() {
            $("#jquery-lightbox").remove();
            $("#jquery-overlay").fadeOut(function() {
                $(this).remove();
            });
            $("embed, object, select").css({visibility: "visible"});
        }

        function getPageDimensions() {
            let a, b;
            if (window.innerHeight && window.scrollMaxY) a = window.innerWidth + window.scrollMaxX, b = window.innerHeight + window.scrollMaxY;
            else if (document.body.scrollHeight > document.body.offsetHeight) a = document.body.scrollWidth, b = document.body.scrollHeight;
            else a = document.body.offsetWidth, b = document.body.offsetHeight;
            let c, d;
            if (self.innerHeight) c = document.documentElement.clientWidth ? document.documentElement.clientWidth : self.innerWidth, d = self.innerHeight;
            else if (document.documentElement && document.documentElement.clientHeight) c = document.documentElement.clientWidth, d = document.documentElement.clientHeight;
            else if (document.body) c = document.body.clientWidth, d = document.body.clientHeight;
            let e = b < d ? d : b,
                f = a < c ? c : a;
            return [e, f, c, d];
        }

        function getScrollPosition() {
            let a, b;
            if (self.pageYOffset) b = self.pageYOffset, a = self.pageXOffset;
            else if (document.documentElement && document.documentElement.scrollTop) b = document.documentElement.scrollTop, a = document.documentElement.scrollLeft;
            else if (document.body) b = document.body.scrollTop, a = document.body.scrollLeft;
            return [a, b];
        }

        function getFileType(a) {
            let b = a.substr(1 + a.lastIndexOf("/")).split("?")[0];
            return b = b.split("#")[0], b.substr(b.lastIndexOf("."));
        }

        function sleep(a) {
            for (let b = (new Date).getTime(), c = b; c < b + a;) c = (new Date).getTime();
        }

        initializeLightBox(a);
    }

    // Function to modify HTML structure as needed
    function modifyHTML() {
        console.log('modifyHTML called');

        // Show hidden elements with class .showHidden
        var elements = document.querySelectorAll('.showHidden');
        elements.forEach(function(element) {
            element.style.display = 'block';
        });

        // Replace existing click event handlers for .conImg elements
        var conImgs = document.querySelectorAll('.conRow .conImg');
        console.log('Found conImg elements:', conImgs.length);
        conImgs.forEach(function(img) {
            // Remove existing click event handler
            img.removeEventListener

            // Add new click event handler
            img.addEventListener('click', newClickEvent);
        });

        // Update SL.clickableClasses if necessary
        if (!SL.clickableClasses.includes("conRowHolder")) {
            SL.clickableClasses.push("conRowHolder");
        }

        // Add click event listener to clear selection
        var clearSelection = document.querySelector('.conCount');
        if (clearSelection) {
            clearSelection.addEventListener('click', function() {
                var checkboxes = document.querySelectorAll('#conHolder input[type="checkbox"]');
                var batchSize = 100; // Adjust batch size based on performance testing

                function processBatch(startIndex) {
                    var endIndex = Math.min(startIndex + batchSize, checkboxes.length);

                    for (var i = startIndex; i < endIndex; i++) {
                        checkboxes[i].checked = false;
                    }

                    if (endIndex < checkboxes.length) {
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

    // New click event handler function
    function newClickEvent() {
        var dataId = this.getAttribute('data-id');
        console.log('Clicked image with data-id:', dataId);
        makeLightBox(dataId); // Assuming makeLightBox is correctly implemented
    }

    // Function to handle mutations and modify HTML structure
    function handleMutations(mutationsList, observer) {
        mutationsList.forEach(function(mutation) {
            if (mutation.type === 'childList') {
                var addedNodes = Array.from(mutation.addedNodes);
                addedNodes.forEach(function(node) {
                    // Check if node or any of its descendants are .conRow elements
                    if (node.classList && node.classList.contains('conRow')) {
                        modifyHTML();
                    } else if (node.querySelectorAll) {
                        var conRowDescendants = node.querySelectorAll('.conRow');
                        if (conRowDescendants.length > 0) {
                            modifyHTML();
                        }
                    }
                });
            }
        });
    }

    // Initialize MutationObserver to watch for changes in the document body
    var observer = new MutationObserver(handleMutations);
    observer.observe(document.body, { childList: true, subtree: true });

    // Wait for the page to load before initial modification
    window.addEventListener('load', function() {
        console.log('Page loaded, calling modifyHTML');
        modifyHTML();
    });

    // Apply custom CSS styles
    var customStyles = `
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

    // Add custom styles to the document head
    var styleElement = document.createElement('style');
    styleElement.innerHTML = customStyles;
    document.head.appendChild(styleElement);
})();