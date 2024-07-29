// ==UserScript==
// @name         Modify FJ Rate menu + Spicy
// @namespace    http://funnyjunk.com/u/FOG
// @version      1.0
// @description  Add custom rate buttons to FunnyJunk
// @author       FOG
// @match        https://funnyjunk.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    function createNewButton(id, category, shortKeyText, shortRDText, longRDText, catId) {
        var newButton = document.createElement('div');
        newButton.id = id;
        newButton.className = 'ctButton4 desktopRate';

        if (id === '') {
            // Specific HTML structure for button0
            newButton.innerHTML = '<div class="shortKey">' + shortKeyText + '</div>' +
                                  '<span class="shortRD">' + shortRDText + '</span>' +
                                  '<span class="longRD">' + longRDText + '</span>/1/1';
        } else {
            // Default HTML structure for other buttons
            newButton.innerHTML = '<div class="shortKey">' + shortKeyText + '</div>' +
                                  '<span class="shortRD">' + shortRDText + '</span>' +
                                  '<span class="longRD">' + longRDText + '</span>/1/1n';
        }

        newButton.onclick = function() {
            // Apply the necessary actions
            admintools.noIndex(contentId, FJUserId, 1, this, 'skin_level');
            admintools.noIndex(contentId, FJUserId, 1, this, 'pc_level');
            admintools.catBlock(catId, this);
            admintools.noIndex(contentId, FJUserId, 1, this, 'setNoIndex');

            // Add classes for skin_level and pc_level
            document.getElementById('skinLevel1').classList.add('nsfwBg');
            document.getElementById('pcLevel1').classList.add('nsfwBg');

            // Add selected class to the appropriate category block
            var catBlockElements = document.querySelectorAll('#catControls .ctButton4');
            catBlockElements.forEach(function(el) {
                if (parseInt(el.getAttribute('data-id')) === catId) {
                    el.classList.add('selected');
                }
            });

            // Move to the next unrated content
            admintools.getNextUnrated();
        };

        return newButton;
    }

    function addCustomButtons() {
        var modRa = document.getElementById('modRa');

        if (modRa) {
            var quickMMenu = modRa.querySelector('#quickM');

            if (quickMMenu) {
                var button7 = createNewButton('rate7key', 'animeNO', '7', 'a', 'anime', 5);
                var button8 = createNewButton('rate8key', 'gamingNO', '8', 'ga', 'gaming', 1);
                var button0 = createNewButton('rate0key', 'spicyNO', '0', 'spi', 'spicy', 13);

                quickMMenu.appendChild(button7);
                quickMMenu.appendChild(button8);
                quickMMenu.appendChild(button0);
            }
        }
    }

    function handleKeydown(event) {
        var catBlockElements = document.querySelectorAll('#catControls .ctButton4');

        if (event.code === 'Numpad8' || (event.key === '8' && event.shiftKey)) {
            event.preventDefault(); // Prevent the default behavior
            admintools.noIndex(contentId, FJUserId, 1, this, 'skin_level');
            admintools.noIndex(contentId, FJUserId, 1, this, 'pc_level');
            admintools.catBlock(1, document.getElementById('rate8key'));
            admintools.noIndex(contentId, FJUserId, 1, this, 'setNoIndex');

            // Add classes for skin_level and pc_level
            document.getElementById('skinLevel1').classList.add('nsfwBg');
            document.getElementById('pcLevel1').classList.add('nsfwBg');

            // Add selected class to the gaming category block
            catBlockElements.forEach(function(el) {
                if (parseInt(el.getAttribute('data-id')) === 1) {
                    el.classList.add('selected');
                }
            });

            admintools.getNextUnrated();
        }
        if (event.code === 'Numpad0' || (event.key === '0' && event.shiftKey)) {
            event.preventDefault(); // Prevent the default behavior
            admintools.noIndex(contentId, FJUserId, 1, this, 'skin_level');
            admintools.noIndex(contentId, FJUserId, 1, this, 'pc_level');
            admintools.catBlock(13, document.getElementById('rate0key'));
            admintools.noIndex(contentId, FJUserId, 1, this, 'setNoIndex');

            // Add classes for skin_level and pc_level
            document.getElementById('skinLevel1').classList.add('nsfwBg');
            document.getElementById('pcLevel1').classList.add('nsfwBg');

            // Add selected class to the spicy category block
            catBlockElements.forEach(function(el) {
                if (parseInt(el.getAttribute('data-id')) === 13) {
                    el.classList.add('selected');
                }
            });

            admintools.getNextUnrated();
        }
    }

    // Function to handle scroll events and apply/remove styles
    function handleScroll() {
        const modCC = document.querySelector('.modCC');
        const cControlsCon = document.querySelector('#cControlsCon');

        if (!modCC || !cControlsCon) return;

        const isModFAdded = modCC.classList.contains('modF');
        const isModF1Added = modCC.classList.contains('modF1');

        if (isModFAdded && isModF1Added) {
            applyCustomStyles(modCC, cControlsCon);
        } else {
            removeCustomStyles(modCC, cControlsCon);
        }
    }

    // Function to apply custom styles
    function applyCustomStyles(modCC, cControlsCon) {
        modCC.style.top = '117px';
        cControlsCon.style.top = '263px';
    }

    // Function to remove custom styles
    function removeCustomStyles(modCC, cControlsCon) {
        modCC.style.top = '';
        cControlsCon.style.top = '';
    }

    document.addEventListener('keydown', handleKeydown);
    addCustomButtons();
    window.addEventListener('scroll', handleScroll);
    handleScroll();

})();
