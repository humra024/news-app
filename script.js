const API_KEY = "1d3a0eefa97b499d8fbc4ee93eeb40b7";
const url = "https://newsapi.org/v2/everything?q=";

// when the page loads, fetch news related to India
window.addEventListener("load", () => fetchNews("world"));

function reload() {
    window.location.reload();
}

async function fetchNews(query) {
    const res = await fetch(`${url}${query}&apiKey=${API_KEY}`); //in the format of api mentioned
    const data = await res.json();//converting res to json format. Await used because res awaits promise
    bindData(data.articles);
}

function bindData(articles) {
    const cardsContainer = document.getElementById("cards-container");
    const newsCardTemplate = document.getElementById("template-news-card");

    cardsContainer.innerHTML = ""; //No extra cards during each api call

    articles.forEach((article) => {
        if (!article.urlToImage) return; //in case of no image, return i.e card not displayed
        //creating clones from template
        const cardClone = newsCardTemplate.content.cloneNode(true); //deep cloning i.e. not only card but also the contents of card is cloned
        fillDataInCard(cardClone, article);
        cardsContainer.appendChild(cardClone); //appending to cards container that will be displayed
    });
}

function fillDataInCard(cardClone, article) {
    const newsImg = cardClone.querySelector("#news-img");
    const newsTitle = cardClone.querySelector("#news-title");
    const newsSource = cardClone.querySelector("#news-source");
    const newsDesc = cardClone.querySelector("#news-desc");

    newsImg.src = article.urlToImage; //article is the key in api, so are title,urlToImage...
    newsTitle.innerHTML = article.title;
    newsDesc.innerHTML = article.description;

    //to convert data into readable form and our timeZone
    const date = new Date(article.publishedAt).toLocaleString("en-US", { 
        timeZone: "Asia/Jakarta",
    });

    newsSource.innerHTML = `${article.source.name} · ${date}`;

    cardClone.firstElementChild.addEventListener("click", () => {
        window.open(article.url, "_blank");
    });
}

let curSelectedNav=null;
function onNavItemClick(id){
   fetchNews(id);
   const navItem = document.getElementById(id);
   curSelectedNav?.classList.remove("active"); //if not null then remove active class tag
   curSelectedNav = navItem; 
   curSelectedNav.classList.add("active"); //add active class tag to current selected nav item
}

const searchButton = document.getElementById("search-button");
const searchText = document.getElementById("search-text");

searchButton.addEventListener("click", () => {
    const query = searchText.value;
    if (!query) return;
    fetchNews(query);
    curSelectedNav?.classList.remove("active");
    curSelectedNav = null;
});