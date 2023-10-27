const BUTTON_TEXT = 'Block';
const STORAGE_KEY = 'blockedTags';  // Key to store/retrieve tags from localStorage

// Fetch the list of blocked tags from localStorage or use the default list
let blockedTags = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

/**
 * Creates and inserts a "Blocked Tags" section into the 9GAG page.
 * If the section already exists, the function will exit early.
 * The new section is placed before the "Recents" section.
 */
function createBlockedTagsSection() {
    // Check if the list already exists to avoid duplication
    if (document.getElementById('blockedTagsList')) {
        return; 
    }

    // Create the main section element
    const section = document.createElement('section');
    const header = document.createElement('header');
    const divTitle = document.createElement('div');
    divTitle.className = "h3";
    divTitle.innerText = "Blocked Tag";
    header.appendChild(divTitle);
    section.appendChild(header);

    // Create and attach the list to the section
    const ul = document.createElement('ul');
    ul.id = 'blockedTagsList'; 
    section.appendChild(ul);

    // Find the "Recents" section
    const recentsSection = Array.from(document.querySelectorAll('.h3')).find(el => el.innerText.trim() === "Recents");

    // Insert the new "Blocked Tags" section before the "Recents" section
    recentsSection.parentNode.parentNode.insertBefore(section, recentsSection.parentNode);
}

/**
 * Updates the "Blocked Tags" section on the 9GAG page with the current set of blocked tags.
 * Each tag in the section has an "Unblock" button that allows users to unblock and display articles with that tag.
 */
function updateBlockedTagsSection() {
    // Get the "Blocked Tags" list element and clear its current content
    const ulElement = document.getElementById('blockedTagsList'); 
    ulElement.innerHTML = ''; 

    // Loop through each blocked tag and create a list item with an "Unblock" button
    blockedTags.forEach(tag => {
        const li = document.createElement('li');
        li.innerText = tag + " ";

        const btn = document.createElement('button');
        btn.innerText = 'Unblock';
        btn.addEventListener('click', function () {
            const index = blockedTags.indexOf(tag);
            if (index > -1) {
                blockedTags.splice(index, 1); // Remove the tag from the blocked list
                saveTagsToLocalStorage();
                filterArticles(); // Update articles based on new set of blocked tags
                updateBlockedTagsSection(); // Refresh the "Blocked Tags" section
            }
        });

        li.appendChild(btn);
        ulElement.appendChild(li);
    });
}

/**
 * Persists the current set of blocked tags to the browser's local storage.
 */
function saveTagsToLocalStorage() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(blockedTags));
}

/**
 * Extracts the pure text of a tag from its display text by removing appended button text.
 */
function getPureTagText(tagText) {
    const regex = new RegExp(BUTTON_TEXT + '$');
    return tagText.replace(regex, '').trim().toLowerCase();
}


/**
 * Adds a "Block" button next to each tag on 9GAG. Clicking the button will block all articles 
 * containing that tag and update the blocked tags list.
 * @param {HTMLElement} tagElement - The DOM element of the tag to which the block button should be added.
 */
function addBlockButton(tagElement) {
    const btn = document.createElement('button');
    btn.innerText = BUTTON_TEXT;
    btn.style.marginLeft = '5px';
    btn.addEventListener('click', function (event) {
        event.preventDefault();
        event.stopPropagation();

        // Extract the actual tag text from the element
        const tagText = getPureTagText(tagElement.innerText);

        // Add the tag to the blocked list if it's not already present
        if (!blockedTags.includes(tagText)) {
            blockedTags.push(tagText);
            console.log(`Tag "${tagText}" added to the blocked tags list.`);
            saveTagsToLocalStorage();  // Persist the updated blocked tags list
            filterArticles();         // Re-filter articles based on the updated list
            updateBlockedTagsSection();
        }
    });

    tagElement.appendChild(btn);
}

/**
 * Filters 9GAG articles based on the blocked tags list. Articles containing any of the blocked tags 
 * will be hidden from view. This function also ensures that each tag on 9GAG has a "Block" button next to it.
 */
function filterArticles() {
    console.log("Running filterArticles...");
    console.log("Blocked tags: " + blockedTags);

    // Get all article elements on the page
    const articles = document.querySelectorAll('article');

    articles.forEach(article => {
        // Extract tags from the current article and ensure each tag has a "Block" button
        const tags = Array.from(article.querySelectorAll('.post-tags a'))
            .map(tag => {
                if (!tag.querySelector('button')) {
                    addBlockButton(tag);
                }
                return getPureTagText(tag.innerText);
            });

        // Hide the article if it contains any of the blocked tags
        if (tags.some(tag => blockedTags.includes(tag))) {
            if (article.style.display !== 'none') {
                console.log(`Article blocked with tags: ${tags.join(', ')}`);
                article.style.display = 'none';
            }
        } else {
            // Show the article if none of its tags are in the blocked list
            if (article.style.display === 'none') {
                console.log(`Article unblocked with tags: ${tags.join(', ')}`);
                article.style.display = 'block';
            }
        }
    });
}


// Run on every page load :
createBlockedTagsSection(); 
updateBlockedTagsSection();
filterArticles();

// Use MutationObserver to detect changes in the DOM
const observer = new MutationObserver((mutationsList, observer) => {
    for (let mutation of mutationsList) {
        if (mutation.type === 'childList') {
            filterArticles();
        }
    }
});

// Observer configuration:
const config = { attributes: true, childList: true, subtree: true };

// Pass in the target node, as well as the observer configurations
observer.observe(document.body, config);
