import { renderAnimations } from "./animations.js";
import { handleAgeCategories } from "./renderAgeCategories.js";
import  {renderDetails, toggleCards} from './renderCardDetails.js';
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

export const renderCard = (page) => {
  const container = document.querySelector(".milestones-section__cards");
  container.innerHTML = "";

  const start = (page - 1) * cardsPerPage;
  const end = start + cardsPerPage;
  const currentItems = totalCards.slice(start, end);

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
const renderPagination = () => {
  const paginationContainer = document.querySelector(".pagination");
  paginationContainer.innerHTML = "";

  const totalPages = Math.ceil(totalCards.length / cardsPerPage);

  // Previus Button
  const prevButton = document.createElement("li");
  prevButton.className = "page-item";
  prevButton.innerHTML = `
    <a class="page-link prev" href="#">Previous</a>
  `;
  prevButton.addEventListener("click", (e) => {
    e.preventDefault();
    if (currentPage > 1) {
      currentPage--;
      renderCard(currentPage);
      renderPagination();
    }
  });
  paginationContainer.appendChild(prevButton);

  // Page Number Buttons
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
      renderCard(currentPage);
      renderPagination();
    });

    pageItem.appendChild(link);
    paginationContainer.appendChild(pageItem);
  }

  // Next Button
  const nextButton = document.createElement("li");
  nextButton.className = "page-item";
  nextButton.innerHTML = `
    <a class="page-link next" href="#">Next</a>
  `;
  nextButton.addEventListener("click", (e) => {
    e.preventDefault();
    if (currentPage < totalPages) {
      currentPage++;
      renderCard(currentPage);
      renderPagination();
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
