document.addEventListener("DOMContentLoaded", function () {
    const searchIcon = document.querySelector(".search-icon");
    const searchContainer = document.querySelector(".search-container");
    const searchInput = document.querySelector(".search-input");
    const popup = document.getElementById("popup");
    const closePopupBtn = document.querySelector(".close-popup");

    searchIcon.addEventListener("click", function () {
        if (searchContainer.classList.contains("open")) {
            searchInput.style.width = "0";
            searchInput.style.opacity = "0";
            setTimeout(() => {
                searchContainer.classList.remove("open");
            }, 400); // Espera o tempo da animaÃ§Ã£o para remover a classe
        } else {
            searchContainer.classList.add("open");
            setTimeout(() => {
                searchInput.style.width = "200px";
                searchInput.style.opacity = "1";
                searchInput.focus();
            }, 10); // Pequeno atraso para permitir que a classe open seja aplicada antes de iniciar a animaÃ§Ã£o
        }
    });

    // Evento para fechar o pop-up ao clicar no botÃ£o de fechar
    closePopupBtn.addEventListener("click", function () {
        popup.classList.remove("show");
        popup.classList.add("hide");
    });

    // Evento para ocultar o pop-up apÃ³s a animaÃ§Ã£o de fechamento
    popup.addEventListener("animationend", function (event) {
        if (event.animationName === "slideDown") {
            popup.style.display = "none";
        }
    });
});