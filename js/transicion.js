document.addEventListener("DOMContentLoaded", () => {
    const overlay = document.getElementById("transition-overlay");
    const cinematicEntryTime = 1300;
    const quickEntryTime = 220;
    const exitTime = 700;
    let isLeaving = false;
    const url = new URL(window.location.href);
    const cameFromInternalNav = url.searchParams.get("_tr") === "1";

    if (cameFromInternalNav) {
        url.searchParams.delete("_tr");
        window.history.replaceState({}, "", url.toString());
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

    const handleNavigation = (event) => {
        const targetElement = event.target;
        if (!(targetElement instanceof Element)) {
            return;
        }

        const link = targetElement.closest("a[href]");
        if (!link) {
            return;
        }

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
        nextUrl.searchParams.set("_tr", "1");
        overlay.classList.add("quick");
        overlay.classList.remove("hidden");

        setTimeout(() => {
            window.location.href = nextUrl.href;
        }, exitTime);
    };

    document.addEventListener("click", handleNavigation);
    document.addEventListener("touchend", handleNavigation, { passive: false });
});

window.addEventListener("pageshow", (event) => {
    if (!event.persisted) {
        return;
    }

    const overlay = document.getElementById("transition-overlay");
    if (overlay) {
        overlay.classList.add("hidden");
    }
});
