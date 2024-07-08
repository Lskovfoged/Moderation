// ==UserScript==
// @name         FunnyJunk NSFW rating shortcuts
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Adds numpad shortcuts to category buttons on FunnyJunk
// @author       You
// @match        https://funnyjunk.com/nsfw/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Define numpad mappings here
    const numpadMappings = {
        1: 7,   // Numpad 1 corresponds to catBlock 7 (Hentai/Comics)
        2: 8,   // Numpad 2 corresponds to catBlock 8 (Furry)
        3: 9,   // Numpad 3 corresponds to catBlock 9 (Gay)
        4: 10,  // Numpad 4 corresponds to catBlock 10 (Non-Porn)
        5: 11,  // Numpad 5 corresponds to catBlock 11 (Extreme)
        6: 12,  // Numpad 6 corresponds to catBlock 12 (Other)
        9: 'next',  // Numpad 9 corresponds to 'Next Unrated'
    };

    // Function to add numpad shortcuts
    function addNumpadShortcuts() {
        // Select the catControls container
        let catControls = document.getElementById('catControls');
        if (catControls) {
            // Get skinGuideSpan separately and exclude from style change
            let skinGuideSpan = document.getElementById('skinGuide');
            if (skinGuideSpan) {
                let shortKeyDiv = document.createElement('div');
                shortKeyDiv.classList.add('shortKey');
                shortKeyDiv.textContent = 9; // Since 9 corresponds to 'next'
                shortKeyDiv.style.display = 'block';
                shortKeyDiv.style.background = 'none 0% 0% / auto repeat scroll padding-box border-box rgb(32, 32, 32)';
                shortKeyDiv.style.font = '400 10px arial, sans-serif';
                shortKeyDiv.style.cursor = 'pointer';
                shortKeyDiv.style.color = 'rgb(241, 241, 241)';
                shortKeyDiv.style.position = 'absolute';
                shortKeyDiv.style.left = '50%'; // Center horizontally
                shortKeyDiv.style.transform = 'translateX(-50%)'; // Adjust for centering
                shortKeyDiv.style.top = '-50%'; // Move upwards by half of its own height
                shortKeyDiv.style.padding = '0px 1px';

                // Append shortKeyDiv before the text content of span
                skinGuideSpan.insertBefore(shortKeyDiv, skinGuideSpan.firstChild);
            }

            // Reverse the numpadMappings for easy lookup
            const reverseMappings = {};
            for (const key in numpadMappings) {
                if (numpadMappings[key] !== 'next') {
                    reverseMappings[numpadMappings[key]] = key;
                }
            }

            // Apply style to .ctButton4 elements, excluding skinGuideSpan
            catControls.querySelectorAll('span.ctButton4').forEach((span) => {
                if (span.id !== 'skinGuide') {
                    const catBlockId = parseInt(span.getAttribute('data-id'), 10);

                    span.style.position = 'relative';
                    span.style.background = 'none 0% 0% / auto repeat scroll padding-box border-box rgb(61, 61, 61)';
                    span.style.borderRadius = '2px';
                    span.style.cursor = 'pointer';
                    span.style.display = 'inline-block';
                    span.style.font = '700 16px arial, serif';
                    span.style.margin = '0px 0px 0px 2px';
                    span.style.padding = '2px 4px';
                    span.style.color = 'rgb(241, 241, 241)';
                    span.style.border = '1px solid rgb(68, 68, 68)';
                    span.style.textAlign = 'center'; // Ensure text alignment center

                    if (reverseMappings[catBlockId]) {
                        // Create and style the shortKey div
                        let shortKeyDiv = document.createElement('div');
                        shortKeyDiv.classList.add('shortKey');
                        shortKeyDiv.textContent = reverseMappings[catBlockId];
                        shortKeyDiv.style.display = 'block';
                        shortKeyDiv.style.background = 'none 0% 0% / auto repeat scroll padding-box border-box rgb(32, 32, 32)';
                        shortKeyDiv.style.font = '400 10px arial, sans-serif';
                        shortKeyDiv.style.cursor = 'pointer';
                        shortKeyDiv.style.color = 'rgb(241, 241, 241)';
                        shortKeyDiv.style.position = 'absolute';
                        shortKeyDiv.style.left = '50%'; // Center horizontally
                        shortKeyDiv.style.transform = 'translateX(-50%)'; // Adjust for centering
                        shortKeyDiv.style.top = '-50%'; // Move upwards by half of its own height
                        shortKeyDiv.style.padding = '0px 1px';

                        // Append shortKeyDiv before the text content of span
                        span.insertBefore(shortKeyDiv, span.firstChild);
                    }

                    // Add event listener to span element
                    span.addEventListener('click', function() {
                        admintools.catBlock(catBlockId, this); // Call the original function
                    });
                }
            });

            // Add numpad shortcut functionality
            document.addEventListener('keydown', function(event) {
                let key = event.key;
                if (numpadMappings[key]) {
                    if (numpadMappings[key] === 'next') {
                        admintools.getNextUnrated(); // Call the original function for 'Next Unrated'
                    } else {
                        let catBlockId = numpadMappings[key];
                        let catBlockSpan = catControls.querySelector(`span[data-id="${catBlockId}"]`);
                        if (catBlockSpan) {
                            admintools.catBlock(catBlockId, catBlockSpan); // Call the original function
                        }
                    }
                }
            });
        }
    }

    // Call the function to add numpad shortcuts
    addNumpadShortcuts();
})();
