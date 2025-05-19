export const renderAnimations = () => {
  const observer = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach(({ target: card, isIntersecting }) => {
        isIntersecting
          ? card.classList.add("zoomed-in") && observer.unobserve(card)
          : card.classList.remove("zoomed-in");
      });
    },
    {
      threshold: 0.25,
    }
  );
  document.querySelectorAll(".zooming-card").forEach((card) => {
    observer.observe(card);
  });
};
renderAnimations();
