// ==UserScript==
// @name         Modify FJ Rate menu
// @namespace    http://funnyjunk.com/u/FOG
// @version      0.3
// @description  Add custom rate buttons to FunnyJunk
// @author       FOG
// @match        https://funnyjunk.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Function to create and configure new buttons
    function createNewButton(id, category, shortKeyText, shortRDText, longRDText) {
        var newButton = document.createElement('div');
        newButton.id = id;
        newButton.className = 'ctButton4 desktopRate';
        newButton.innerHTML = '<div class="shortKey">' + shortKeyText + '</div>' +
                              '<span class="shortRD">' + shortRDText + '</span>' +
                              '<span class="longRD">' + longRDText + '</span>/1/1n';

        // Assign onclick function
        newButton.onclick = function() {
            quickM(category, newButton);
        };

        return newButton;
    }

    // Main function to add custom buttons to the moderation menu
    function addCustomButtons() {
        // Find the modRa element
        var modRa = document.getElementById('modRa');

        if (modRa) {
            // Find or create the quickM element within modRa
            var quickMMenu = modRa.querySelector('#quickM');

            if (quickMMenu) {
                // Create new button 7 (animeNO)
                var button7 = createNewButton('rate7key', 'animeNO', '7', 'a', 'anime');

                // Create new button 8 (gamingNO)
                var button8 = createNewButton('rate8key', 'gamingNO', '8', 'ga', 'gaming');

                // Insert buttons into the DOM
                quickMMenu.appendChild(button7);
                quickMMenu.appendChild(button8);
            }
        }
    }

    // Function to handle keydown events
    function handleKeydown(event) {
        // Prevent default behavior for testing purposes
        event.preventDefault();

        // Check for numpad and regular number key presses
        if (event.code === 'Numpad8' || (event.key === '8' && event.shiftKey)) {
            quickM('gamingNO', document.getElementById('rate8key'));
            event.stopPropagation(); // Stop other handlers from intercepting
        }
    }

    // Add event listener for keydown
    document.addEventListener('keydown', handleKeydown);

    addCustomButtons();
})();
