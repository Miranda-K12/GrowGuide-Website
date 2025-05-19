export const toggleCards = (hideCards) => {
  const cards = document.querySelectorAll(".card");
  cards.forEach((card) => {
    card.style.display = hideCards ? "none" : "block";
  });
};

export const renderDetails = (item) => {
  const existingCard = document.querySelector(".details-card");
  if (existingCard) existingCard.remove();
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
            <p data-index="2">${item.details.Cognitive}</p>
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
  paragraphs.forEach((p, i) => (p.style.display = i === 0 ? "block" : "none"));

  titles.forEach((title) => {
    title.addEventListener("click", () => {
      const index = title.getAttribute("data-index");
      titles.forEach((t) => t.classList.remove("active"));
      title.classList.add("active");

      paragraphs.forEach((p) => (p.style.display = "none"));
      const paragraph = detailsCard.querySelector(
        `.section-paragraphs p[data-index="${index}"]`
      );
      if (paragraph) paragraph.style.display = "block";
    });
  });

  const pagination = document.querySelector(".pagination");
  if (pagination) pagination.style.display = "none";
};
