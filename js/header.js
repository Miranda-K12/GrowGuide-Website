export const scrollHeader = () => {
  const header = document.querySelector(".header");
  const headerText = header.querySelectorAll(".nav__link");

  const changeBackground = () => {
    if (window.scrollY > 80) {
      header.style.backgroundColor = "#d1ecfe";
      headerText.forEach((element) => {
        element.style.color = "#0d6efd";
      });
    } else {
      header.style.backgroundColor = "#0d6efd";
      headerText.forEach((element) => {
        element.style.color = "#ffffff";
      });
    }
  };

  window.addEventListener("scroll", changeBackground);
};

scrollHeader();
