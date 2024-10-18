// Base URL for your Express backend
const BASE_URL = "http://localhost:8000/api/news"; // Update this if your backend is deployed

// Define the number of articles per page and initialize pagination variables
const articlesPerPage = 12; 
let currentPage = 1;
let totalPages = 1;
let currentQuery = "India"; 

// Fetch news when the page is loaded
window.addEventListener("load", () => fetchNews(currentQuery, currentPage));

// Asynchronous function to fetch news articles from the backend based on the query and page number
async function fetchNews(query, page) {
    try {
        const res = await fetch(`${BASE_URL}?q=${query}&page=${page}`);
        const data = await res.json();
        
        // Check if the response has articles
        if (data.articles) {
            totalPages = Math.ceil(data.totalResults / articlesPerPage);
            bindData(data.articles);
        } else {
            console.error("No articles found");
        }
        updateButtons();
    } catch (error) {
        console.error("Error fetching news:", error);
    }
}

// Function to bind the fetched data to the HTML elements
function bindData(articles) {
    const cardsContainer = document.getElementById("cards-container");
    const newsCardTemplate = document.getElementById("template-news-card");

    cardsContainer.innerHTML = "";

    // Iterate through each article and populate the news card template
    articles.forEach((article) => {
        if (!article.urlToImage) return;
        const cardClone = newsCardTemplate.content.cloneNode(true);
        fillDataInCard(cardClone, article);
        cardsContainer.appendChild(cardClone);
    });
}

// Function to fill the data into the news card template
function fillDataInCard(cardClone, article) {
    const newsImg = cardClone.querySelector("#news-img");
    const newsTitle = cardClone.querySelector("#news-title");
    const newsSource = cardClone.querySelector("#news-source");
    const newsDesc = cardClone.querySelector("#news-desc");

    newsImg.src = article.urlToImage;
    newsTitle.innerHTML = article.title;
    newsDesc.innerHTML = article.description;

    const date = new Date(article.publishedAt).toLocaleString("en-US", {
        timeZone: "Asia/Jakarta",
    });

    newsSource.innerHTML = `${article.source.name} · ${date}`;

    // Add click event to open the news article in a new tab
    cardClone.firstElementChild.addEventListener("click", () => {
        window.open(article.url, "_blank");
    });
}

// Function to update the pagination buttons
function updateButtons() {
    document.getElementById("prev-button").style.display = (currentPage === 1) ? 'none' : 'inline-block';
    document.getElementById("next-button").style.display = (currentPage === totalPages) ? 'none' : 'inline-block';
}

// Add click event listener to the previous button
document.getElementById("prev-button").addEventListener("click", () => {
    if (currentPage > 1) {
        currentPage--;
        fetchNews(currentQuery, currentPage);
    }
});

// Add click event listener to the next button
document.getElementById("next-button").addEventListener("click", () => {
    if (currentPage < totalPages) {
        currentPage++;
        fetchNews(currentQuery, currentPage);
    }
});

let curSelectedNav = null;

// Function to handle navigation item clicks
function onNavItemClick(id) {
    currentPage = 1; // Reset to first page when a new category is selected
    currentQuery = id; // Update current query to the selected category
    fetchNews(id, currentPage);
    const navItem = document.getElementById(id);
    curSelectedNav?.classList.remove("bg-red-600");
    curSelectedNav = navItem;
    curSelectedNav.classList.add("bg-red-600");
}

// Add click event listener to the search button
const searchButton = document.getElementById("search-button");
const searchText = document.getElementById("search-text");

searchButton.addEventListener("click", () => {
    const query = searchText.value;
    if (!query) return;
    currentPage = 1; 
    currentQuery = query; 
    fetchNews(query, currentPage);
});
