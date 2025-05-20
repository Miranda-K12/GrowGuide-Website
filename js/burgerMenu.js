export const renderBurgerMenu = () => {
  const burgerMenu = document.querySelector(".burger-menu");
  burgerMenu.addEventListener("click", () => {
    const navbar = document.querySelector(".nav__links");
    navbar.classList.toggle("nav__links-active");
  });
};
renderBurgerMenu();
