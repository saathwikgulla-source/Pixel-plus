
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
