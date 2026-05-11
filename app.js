document.addEventListener("DOMContentLoaded", () => {
    const menuWrap = document.querySelector(".menu-wrap");
    const menuToggle = document.querySelector(".menu-toggle");
    const menuPanel = document.getElementById("site-menu");

    if (!menuWrap || !menuToggle || !menuPanel) {
        return;
    }

    const openMenu = () => {
        menuPanel.hidden = false;
        menuPanel.classList.add("is-open");
        menuToggle.setAttribute("aria-expanded", "true");
    };

    const closeMenu = () => {
        menuPanel.classList.remove("is-open");
        menuPanel.hidden = true;
        menuToggle.setAttribute("aria-expanded", "false");
    };

    const toggleMenu = () => {
        const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";

        if (isExpanded) {
            closeMenu();
        } else {
            openMenu();
        }
    };

    menuToggle.addEventListener("click", (event) => {
        event.stopPropagation();
        toggleMenu();
    });

    document.addEventListener("click", (event) => {
        if (!menuWrap.contains(event.target)) {
            closeMenu();
        }
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            closeMenu();
        }
    });

    menuPanel.addEventListener("click", () => {
        closeMenu();
    });
});