// sidebar.js
import { renderDetails } from "./renderCardDetails.js";
import { toggleCards } from "./renderCardDetails.js";
export const handleAgeCategories = (data) => {
  const sidebarButtons = document.querySelectorAll(".age-categories-box .btn");

  sidebarButtons.forEach((button) => {
    button.addEventListener("click", () => {
      sidebarButtons.forEach((btn) => btn.classList.remove("active"));

      button.classList.add("active");

      const id = button.getAttribute("data-id");
      const selectedItem = data.find((d) => d.id === parseInt(id));
      if (selectedItem) {
        renderDetails(selectedItem);
        toggleCards(true);
      }
    });
  });
};

handleAgeCategories();
