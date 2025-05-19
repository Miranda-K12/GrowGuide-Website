import { renderAnimations } from "./animations.js";
import { handleAgeCategories } from "./renderAgeCategories.js";
import { renderDetails, toggleCards } from "./renderCardDetails.js";

const cardsPerPage = 4;
let currentPage = 1;
let fullData = [];

const fetchData = async () => {
  try {
    const response = await fetch("./js/data.json");
    const data = await response.json();
    fullData = data;
    renderCard(currentPage);
    setupPagination();
    handleAgeCategories(data);
  } catch (err) {
    console.error("Data fetch error:", err);
  }
};

export const renderCard = (page) => {
  const container = document.querySelector(".milestones-section__cards");
  container.innerHTML = "";

  const start = (page - 1) * cardsPerPage;
  const end = start + cardsPerPage;
  const currentItems = fullData.slice(start, end);

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

  addCardClickListeners();
  renderAnimations();
};

const setupPagination = () => {
  const pageLinks = document.querySelectorAll(".page-link[data-page]");

  pageLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      currentPage = parseInt(link.dataset.page);
      renderCard(currentPage);
    });
  });

  document.querySelector(".page-link.prev")?.addEventListener("click", (e) => {
    e.preventDefault();
    if (currentPage > 1) {
      currentPage--;
      renderCard(currentPage);
    }
  });

  document.querySelector(".page-link.next")?.addEventListener("click", (e) => {
    e.preventDefault();
    const maxPage = Math.ceil(fullData.length / cardsPerPage);
    if (currentPage < maxPage) {
      currentPage++;
      renderCard(currentPage);
    }
  });
};

const addCardClickListeners = () => {
  const cards = document.querySelectorAll(".card");
  cards.forEach((card) => {
    card.addEventListener("click", () => {
      const cardId = card.getAttribute("data-id");
      const item = fullData.find(({ id }) => id === +cardId);
      if (item) {
        renderDetails(item);
        toggleCards(true);
      }
    });
  });
};

fetchData();
