let currentDetailsCard = null;

// Fetch the data
const fetchData = async () => {
  try {
    const response = await fetch("./js/data.json");

    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

// Render the cards
export const renderCard = async () => {
  const data = await fetchData();
  if (!data) return;

  const container = document.querySelector(".milestones-section__cards");
  container.innerHTML = "";

  data.forEach((item) => {
    const cardHTML = `
      <div class="card" data-id="${item.id}">
        <img src="${item.image}" class="card-img" alt="${item.title}">
        <div class="card-body">
          <h3 class="card-title">${item.title}</h3>
        </div>
      </div>
    `;
    container.innerHTML += cardHTML;
  });

  const cards = document.querySelectorAll(".card");
  cards.forEach((card) => {
    card.addEventListener("click", () => {
      const cardId = card.getAttribute("data-id");
      const item = data.find(({ id }) => id === +cardId);
      if (item) {
        renderDetails(item, card);
      }
    });
  });

  setupSidebarHandlers(data);
};

//Render Card Details
const renderDetails = (item, card) => {
  if (currentDetailsCard) currentDetailsCard.remove();
  toggleCards(true);

  const detailsCard = document.createElement("div");
  detailsCard.classList.add("details-card");
  detailsCard.innerHTML = `
    <div class="details-card-content">
      <div class="details-card-image">
        <img src="${item.image}" alt="${item.title}">
      </div>
      <div class="details-info">
        <div class="details-header">
          <h3 class="section__subtitle">${item.title}</h3>
        </div>
        <div class="details-sections">
          <div class="section-titles">
            <h4 data-index="0">Social Emotional</h4>
            <h4 data-index="1">Communication</h4>
            <h4 data-index="2">Cognitive</h4>
            <h4 data-index="3">Physical</h4>
          </div>
          <div class="section-paragraphs">
            <p data-index="0">${item.details.SocialEmotional}</p>
            <p data-index="1">${item.details.Communication}</p>
            <p data-index="2" >${item.details.Cognitive}</p>
            <p data-index="3" style="display: none;">${item.details.Physical}</p>
          </div>
          <a href="./index.html" class="back-button">← Go Back</a>
        </div>
      </div>
    </div>
  `;

  document
    .querySelector(".milestones-section__cards")
    .insertAdjacentElement("afterend", detailsCard);

  const titles = detailsCard.querySelectorAll(".section-titles h4");
  const paragraphs = detailsCard.querySelectorAll(".section-paragraphs p");
  titles[0]?.classList.add("active");
  paragraphs.forEach((p, index) => {
    p.style.display = index === 0 ? "block" : "none";
  });

  titles.forEach((title) => {
    title.addEventListener("click", () => {
      const index = title.getAttribute("data-index");

      titles.forEach((header) => header.classList.remove("active"));
      title.classList.add("active");
      paragraphs.forEach((p) => (p.style.display = "none"));

      const activeParagraph = detailsCard.querySelector(
        `.section-paragraphs p[data-index="${index}"]`
      );
      if (activeParagraph) {
        activeParagraph.style.display = "block";
      }
    });
  });

  currentDetailsCard = detailsCard;
};

const toggleCards = (hideCards) => {
  const cards = document.querySelectorAll(".card");
  cards.forEach((card) => {
    card.style.display = hideCards ? "none" : "block";
  });
};

toggleCards(true);

//handle sideBar Events
const setupSidebarHandlers = (data) => {
  const sidebarItems = document.querySelectorAll(
    ".hero__sidebar .list-group-item"
  );

  sidebarItems.forEach((item) => {
    item.addEventListener("click", () => {
      const id = item.getAttribute("data-id");
      const card = document.querySelector(`.card[data-id="${id}"]`);
      const selectedItem = data.find((d) => d.id === parseInt(id));

      if (selectedItem && card) {
        renderDetails(selectedItem, card);
        toggleCards(true);
      }
    });
  });
};

renderCard();
