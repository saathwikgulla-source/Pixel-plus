
// PIXEL PLUS - Part 1
// Search functionality will be added in Part 2.

// 1. Get HTML elements
const searchForm = document.querySelector(".search-form");

const searchInput = document.getElementById("searchInput");

const searchButton = document.getElementById("searchButton");

const results = document.getElementById("results");

const emptyState = document.getElementById("emptyState");

const resultCount = document.getElementById("resultCount");


// 2. Listen for form submission
searchForm.addEventListener("submit", async function(event) {

    // Prevent page reload
    event.preventDefault();

    // Read the search query
    const query = searchInput.value.trim();

    // Ignore empty searches
    if (query === "") {
        return;
    }

    // 3. Build Wikimedia API URL
    const apiUrl =
        "https://commons.wikimedia.org/w/api.php" +
        "?action=query" +
        "&generator=search" +
        "&gsrnamespace=6" +
        "&gsrlimit=20" +
        "&gsrsearch=" + encodeURIComponent(query) +
        "&prop=imageinfo" +
        "&iiprop=url" +
        "&iiurlwidth=400" +
        "&format=json" +
        "&origin=*";

    // 4. Fetch images from API
    const response = await fetch(apiUrl);

    // Check whether request was successful
    if (!response.ok) {
        throw new Error("Failed to fetch images");
    }

    // Convert response into JSON
    const data = await response.json();

    // Get image results
    const pages = Object.values(data.query?.pages || {});

    // Keep pages that have image URLs
    const imagePages = pages.filter(page =>
        page.imageinfo?.[0]?.thumburl ||
        page.imageinfo?.[0]?.url
    );

    // 5. Clear previous results
    results.innerHTML = "";

    // Hide empty state when results exist
    emptyState.style.display =
        imagePages.length > 0 ? "none" : "block";

    // 6. Display result count (our enhancement)
    resultCount.textContent =
        `Showing ${imagePages.length} results for "${query}"`;

    // 7. Create a card for every image
    imagePages.forEach(function(page) {

        const imageInfo = page.imageinfo[0];

        // Create card
        const card = document.createElement("article");
        card.className = "image-card";

        // Create image
        const image = document.createElement("img");

        image.src = imageInfo.thumburl || imageInfo.url;
        image.alt = page.title.replace(/^File:/, "");
        image.loading = "lazy";

        // Create image title
        const caption = document.createElement("p");

        caption.className = "image-title";
        caption.textContent =
            page.title.replace(/^File:/, "");

        // Add image and caption to card
        card.appendChild(image);
        card.appendChild(caption);

        // Add card to results grid
        results.appendChild(card);

    });

});


// 1. Get HTML elements
const searchForm = document.querySelector(".search-form");
const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");
const results = document.getElementById("results");
const emptyState = document.getElementById("emptyState");
const resultCount = document.getElementById("resultCount");


// 2. Function to display status messages
function showStatus(title, message, className) {
    results.innerHTML = "";

    emptyState.style.display = "block";
    emptyState.className = `empty-state ${className}`;

    emptyState.innerHTML = "";

    const heading = document.createElement("h3");
    heading.textContent = title;

    const paragraph = document.createElement("p");
    paragraph.textContent = message;

    emptyState.appendChild(heading);
    emptyState.appendChild(paragraph);
}


// 3. Listen for form submission
searchForm.addEventListener("submit", async function(event) {

    event.preventDefault();

    const query = searchInput.value.trim();

    // Ignore blank searches
    if (query === "") {
        return;
    }

    // Show loading state immediately
    showStatus(
        "Searching...",
        "Finding beautiful images for you.",
        "loading-state"
    );

    resultCount.textContent = `Searching for "${query}"...`;

    searchButton.disabled = true;
    searchButton.textContent = "Searching...";

    // Wikimedia API URL
    const apiUrl =
        "https://commons.wikimedia.org/w/api.php" +
        "?action=query" +
        "&generator=search" +
        "&gsrnamespace=6" +
        "&gsrlimit=20" +
        "&gsrsearch=" + encodeURIComponent(query) +
        "&prop=imageinfo" +
        "&iiprop=url" +
        "&iiurlwidth=400" +
        "&format=json" +
        "&origin=*";

    try {

        // 4. Fetch data
        const response = await fetch(apiUrl);

        // Check response
        if (!response.ok) {
            throw new Error("API request failed");
        }

        // Convert to JSON
        const data = await response.json();

        // Get image results
        const pages = Object.values(data.query?.pages || {});

        // Keep valid image results
        const imagePages = pages.filter(page =>
            page.imageinfo?.[0]?.thumburl ||
            page.imageinfo?.[0]?.url
        );

        // Clear old results
        results.innerHTML = "";

        // 5. Check for empty results
        if (imagePages.length === 0) {

            showStatus(
                "No images found!",
                `No results for "${query}". Try another search.`,
                "no-results-state"
            );

            resultCount.textContent = "No results found";
            return;
        }

        // Hide empty state
        emptyState.style.display = "none";

        // 6. Show result count
        resultCount.textContent =
            `Showing ${imagePages.length} results for "${query}"`;

        // 7. Create image cards
        imagePages.forEach(function(page) {

            const imageInfo = page.imageinfo[0];

            // Create card
            const card = document.createElement("article");
            card.className = "image-card";

            // Create image
            const image = document.createElement("img");

            image.src = imageInfo.thumburl || imageInfo.url;
            image.alt = page.title.replace(/^File:/, "");
            image.loading = "lazy";

            // Create caption
            const caption = document.createElement("p");

            caption.className = "image-title";
            caption.textContent =
                page.title.replace(/^File:/, "");

            // Add image and caption
            card.appendChild(image);
            card.appendChild(caption);

            // Add card to grid
            results.appendChild(card);

        });

    } catch (error) {

        // 8. Show friendly error message
        console.error("Image search error:", error);

        showStatus(
            "Oops! Something went wrong.",
            "We couldn't load images. Please check your connection and try again.",
            "error-state"
        );

        resultCount.textContent = "Unable to load results";

    } finally {

        // 9. Restore search button
        searchButton.disabled = false;
        searchButton.textContent = "Search →";

    }

});
