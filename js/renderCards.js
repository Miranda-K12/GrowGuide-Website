import { renderAnimations } from "./animations.js";
import { handleAgeCategories } from "./renderAgeCategories.js";
import { renderDetails, toggleCards } from "./renderCardDetails.js";
let cardsPerPage = 3;
let currentPage = 1;
let totalCards = [];
const setCardsPerPage = () => {
  if (window.innerWidth <= 768) {
    cardsPerPage = 2;
  } else {
    cardsPerPage = 3;
  }
};
export const fetchData = async () => {
  try {
    setCardsPerPage();
    const response = await fetch("./js/data.json");
    const data = await response.json();
    totalCards = data;
    renderCard(currentPage);
    renderPagination();
    handleAgeCategories(data);
  } catch (err) {
    console.error("Data fetch error:", err);
  }
};
fetchData();

export const renderCard = (page, data = totalCards) => {
  const container = document.querySelector(".milestones-section__cards");
  container.innerHTML = "";

  const start = (page - 1) * cardsPerPage;
  const end = start + cardsPerPage;
  const currentItems = data.slice(start, end);

  currentItems.forEach((item) => {
    const cardHTML = `
      <div class="card zooming-card" data-id="${item.id}">
        <img src="${item.image}" class="card-img" alt="${item.title}">
        <div class="card-body">
          <h3 class="card-title">${item.title}</h3>
        </div>
      </div>
    `;
    container.innerHTML += cardHTML;
  });

  setupCardClickHandlers();
  renderAnimations();
};

//Pagination
const renderPagination = (data = totalCards) => {
  const paginationContainer = document.querySelector(".pagination");
  paginationContainer.innerHTML = "";

  const totalPages = Math.ceil(data.length / cardsPerPage);

  const prevButton = document.createElement("li");
  prevButton.className = "page-item";
  prevButton.innerHTML = `<a class="page-link prev" href="#">Previous</a>`;
  prevButton.addEventListener("click", (e) => {
    e.preventDefault();
    if (currentPage > 1) {
      currentPage--;
      renderCard(currentPage, data);
      renderPagination(data);
    }
  });
  paginationContainer.appendChild(prevButton);

  for (let i = 1; i <= totalPages; i++) {
    const pageItem = document.createElement("li");
    pageItem.className = "page-item" + (i === currentPage ? " active" : "");

    const link = document.createElement("a");
    link.className = "page-link";
    link.href = "#";
    link.textContent = i;
    link.dataset.page = i;

    link.addEventListener("click", (e) => {
      e.preventDefault();
      currentPage = i;
      renderCard(currentPage, data);
      renderPagination(data);
    });

    pageItem.appendChild(link);
    paginationContainer.appendChild(pageItem);
  }

  const nextButton = document.createElement("li");
  nextButton.className = "page-item";
  nextButton.innerHTML = `<a class="page-link next" href="#">Next</a>`;
  nextButton.addEventListener("click", (e) => {
    e.preventDefault();
    if (currentPage < totalPages) {
      currentPage++;
      renderCard(currentPage, data);
      renderPagination(data);
    }
  });
  paginationContainer.appendChild(nextButton);
};

window.addEventListener("resize", () => {
  const previousCardsPerPage = cardsPerPage;

  setCardsPerPage();

  if (cardsPerPage !== previousCardsPerPage) {
    currentPage = 1;
    renderPagination();
    renderCard(currentPage);
  }
});

//Search Functionality

let searchCards = totalCards;
const searchInput = document.querySelector(".header__search-input");
const searchButton = document.querySelector(".header__search-button");

searchButton.addEventListener("click", () => {
  const userInput = searchInput.value;
  handleSearch(userInput);
});

searchInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    handleSearch(searchInput.value);
  }
});

export const handleSearch = (searchValue) => {
  const searchTerm = searchValue.toLowerCase().trim();

  // Filter the cards based on the search term
  searchCards = searchTerm
    ? totalCards.filter((item) => item.title.toLowerCase().includes(searchTerm))
    : totalCards;

  currentPage = 1;

  // Handle error message
  let errorMessage = document.querySelector(".error-message");
  if (!errorMessage) {
    errorMessage = document.createElement("h4");
    errorMessage.className = "error-message";
    document.querySelector(".milestones__section").appendChild(errorMessage);
  }

  if (searchCards.length === 0) {
    errorMessage.style.display = "block";
    errorMessage.innerHTML = "No results found";
  } else {
    errorMessage.style.display = "none";
    renderCard(currentPage, searchCards);
    renderPagination(searchCards);
  }

  searchInput.value = "";
};

export const setupCardClickHandlers = () => {
  const cards = document.querySelectorAll(".card");
  cards.forEach((card) => {
    card.addEventListener("click", () => {
      const cardId = card.getAttribute("data-id");
      const item = totalCards.find(({ id }) => id === +cardId);
      if (item) {
        renderDetails(item);
        toggleCards(true);
      }
    });
  });
};
