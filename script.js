
// FRAMEFIND - Part 3
// Image search with loading, empty and error states.

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

    // Ignore empty searches
    if (!query) return;

    // Show loading state
    showStatus(
        "Searching...",
        "Finding beautiful images for you.",
        "loading-state"
    );

    resultCount.textContent = `Searching for "${query}"...`;

    searchButton.disabled = true;
    searchButton.textContent = "Searching...";

    // 4. Wikimedia API URL
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

        // Fetch images
        const response = await fetch(apiUrl);

        if (!response.ok) {
            throw new Error("API request failed");
        }

        const data = await response.json();

        // Get image results
        const pages = Object.values(data.query?.pages || {});

        const imagePages = pages.filter(page =>
            page.imageinfo?.[0]?.thumburl ||
            page.imageinfo?.[0]?.url
        );

        // Clear previous results
        results.innerHTML = "";

        // 5. Empty state
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

        // 6. Display result count
        resultCount.textContent =
            `Showing ${imagePages.length} results for "${query}"`;

        // 7. Create image cards
        imagePages.forEach(function(page) {

            const imageInfo = page.imageinfo[0];

            const card = document.createElement("article");
            card.className = "image-card";

            const image = document.createElement("img");
            image.src = imageInfo.thumburl || imageInfo.url;
            image.alt = page.title.replace(/^File:/, "");
            image.loading = "lazy";

            const caption = document.createElement("p");
            caption.className = "image-title";
            caption.textContent = page.title.replace(/^File:/, "");

            card.appendChild(image);
            card.appendChild(caption);

            results.appendChild(card);
        });

    } catch (error) {

        // 8. Error handling
        console.error("Image search error:", error);

        showStatus(
            "Oops! Something went wrong.",
            "We couldn't load images. Please check your connection and try again.",
            "error-state"
        );

        resultCount.textContent = "Unable to load results";

    } finally {

        // Restore search button
        searchButton.disabled = false;
        searchButton.textContent = "Search →";
    }
});

