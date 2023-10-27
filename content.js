const BUTTON_TEXT = 'Block';
const STORAGE_KEY = 'blockedTags';  // Key to store/retrieve tags from localStorage

// Fetch the list of blocked tags from localStorage or use the default list
let blockedTags = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

function createBlockedTagsSection() {
    // Check if the list already exist
    if (document.getElementById('blockedTagsList')) {
        return; 
    }

    const section = document.createElement('section');
    const header = document.createElement('header');
    const divTitle = document.createElement('div');
    divTitle.className = "h3";
    divTitle.innerText = "Blocked Tag";
    header.appendChild(divTitle);
    section.appendChild(header);

    const ul = document.createElement('ul');
    ul.id = 'blockedTagsList'; 
    section.appendChild(ul);

    // Find the "Recents" section
    const recentsSection = Array.from(document.querySelectorAll('.h3')).find(el => el.innerText.trim() === "Recents");

    // Insert the new section before the "Recents" section
    recentsSection.parentNode.parentNode.insertBefore(section, recentsSection.parentNode);
}

function updateBlockedTagsSection() {
    const ulElement = document.getElementById('blockedTagsList'); 
    ulElement.innerHTML = ''; // Clear the list first

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
                filterArticles(); // Update articles again
                updateBlockedTagsSection(); // Refresh the blocked tags section
            }
        });

        li.appendChild(btn);
        ulElement.appendChild(li);
    });
}

function saveTagsToLocalStorage() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(blockedTags));
}

function getPureTagText(tagText) {
    const regex = new RegExp(BUTTON_TEXT + '$');
    return tagText.replace(regex, '').trim().toLowerCase();
}

function addBlockButton(tagElement) {
    const btn = document.createElement('button');
    btn.innerText = BUTTON_TEXT;
    btn.style.marginLeft = '5px';
    btn.addEventListener('click', function (event) {
        event.preventDefault();
        event.stopPropagation();

        const tagText = getPureTagText(tagElement.innerText);
        if (!blockedTags.includes(tagText)) {
            blockedTags.push(tagText);
            console.log(`Tag "${tagText}" added to the blocked tags list.`);
            saveTagsToLocalStorage();  // Save the tags every time a new tag is added
            filterArticles();
            updateBlockedTagsSection();
        }
    });
    tagElement.appendChild(btn);
}


function filterArticles() {
    console.log("Running filterArticles...");
    console.log("Blocked tags: " + blockedTags);

    const articles = document.querySelectorAll('article');

    articles.forEach(article => {
        const tags = Array.from(article.querySelectorAll('.post-tags a'))
            .map(tag => {
                // Add the button to each tag
                if (!tag.querySelector('button')) {
                    addBlockButton(tag);
                }
                return getPureTagText(tag.innerText);
            });

        if (tags.some(tag => blockedTags.includes(tag))) {
            if (article.style.display !== 'none') {
                console.log(`Article blocked with tags: ${tags.join(', ')}`);
                article.style.display = 'none';
            }
        } else {
            // If none of the article's tags are in the blockedTags list, show it
            if (article.style.display === 'none') {
                console.log(`Article unblocked with tags: ${tags.join(', ')}`);
                article.style.display = 'block';
            }
        }
    });
}

// Run the filter function on every page load
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
