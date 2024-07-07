// ==UserScript==
// @name         Modify FunnyJunk Moderation Menu
// @namespace    http://funnyjunk.com
// @version      0.1
// @description  Add custom moderation buttons to FunnyJunk
// @author       FOG
// @match        https://funnyjunk.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Function to create and configure new buttons
    function createNewButton(id, onclickFunction, shortKeyText, shortRDText, longRDText) {
        var newButton = document.createElement('div');
        newButton.id = id;
        newButton.className = 'ctButton4 desktopRate';
        newButton.innerHTML = '<div class="shortKey">' + shortKeyText + '</div>' +
                              '<span class="shortRD">' + shortRDText + '</span>' +
                              '<span class="longRD">' + longRDText + '</span>/1/1n';

        // Assign onclick function
        newButton.onclick = function(event) {
            onclickFunction();
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
                var button7 = createNewButton('rate7key', function() {
                    quickM('animeNO', this); // Adjust as needed
                }, '7', 'a', 'anime');

                // Create new button 8 (gamingNO)
                var button8 = createNewButton('rate8key', function() {
                    quickM('gamingNO', this); // Adjust as needed
                }, '8', 'ga', 'gaming');

                // Insert buttons into the DOM
                quickMMenu.appendChild(button7);
                quickMMenu.appendChild(button8);
            }
        }
    }

    // Call the function to add custom buttons when the DOM is ready
    addCustomButtons();

})();
