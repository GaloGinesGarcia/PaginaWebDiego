document.addEventListener("DOMContentLoaded", () => {
    const overlay = document.getElementById("transition-overlay");
    const cinematicEntryTime = 1300;
    const quickEntryTime = 120;
    const exitTime = 700;
    const transitionFlag = "internal-page-transition";
    const cameFromInternalNav = sessionStorage.getItem(transitionFlag) === "1";
    let isLeaving = false;

    if (cameFromInternalNav) {
        sessionStorage.removeItem(transitionFlag);
    }

    if (!overlay) {
        return;
    }

    overlay.innerHTML = `
        <div class="loader-stage">
            <div class="loader-spinner"></div>
            <div class="loader-title">Diego DJ</div>
        </div>
    `;
    overlay.classList.toggle("quick", cameFromInternalNav);

    setTimeout(() => {
        requestAnimationFrame(() => {
            overlay.classList.add("hidden");
        });
    }, cameFromInternalNav ? quickEntryTime : cinematicEntryTime);

    const links = document.querySelectorAll("a[href]");

    links.forEach((link) => {
        link.addEventListener("click", (event) => {
            if (isLeaving) {
                event.preventDefault();
                return;
            }

            const href = link.getAttribute("href");
            const target = link.getAttribute("target");
            const hasDownload = link.hasAttribute("download");

            if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) {
                return;
            }

            if (target === "_blank" || hasDownload) {
                return;
            }

            const nextUrl = new URL(href, window.location.href);

            if (nextUrl.origin !== window.location.origin) {
                return;
            }

            event.preventDefault();
            isLeaving = true;
            sessionStorage.setItem(transitionFlag, "1");
            overlay.classList.add("quick");
            overlay.classList.remove("hidden");

            setTimeout(() => {
                window.location.href = nextUrl.href;
            }, exitTime);
        });
    });
});
