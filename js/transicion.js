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
            <div class="loader-title">ZIGO DJ</div>
        </div>
    `;
    overlay.classList.toggle("quick", cameFromInternalNav);

    setTimeout(() => {
        requestAnimationFrame(() => {
            overlay.classList.add("hidden");
        });
    }, cameFromInternalNav ? quickEntryTime : cinematicEntryTime);

    const mobileDropdown = document.querySelector(".mobile-dropdown");
    if (mobileDropdown instanceof HTMLElement) {
        const summary = mobileDropdown.querySelector("summary");
        const mobileMenuCloseTime = 280;
        let closeMenuTimer;

        const closeMobileMenu = () => {
            if (!mobileDropdown.hasAttribute("open") || mobileDropdown.classList.contains("closing")) {
                return;
            }

            mobileDropdown.classList.add("closing");
            document.body.classList.remove("mobile-menu-open");
            if (summary) {
                summary.setAttribute("aria-expanded", "false");
            }

            window.clearTimeout(closeMenuTimer);
            closeMenuTimer = window.setTimeout(() => {
                mobileDropdown.removeAttribute("open");
                mobileDropdown.classList.remove("closing");
            }, mobileMenuCloseTime);
        };

        const syncMobileMenuState = () => {
            const isOpen = mobileDropdown.hasAttribute("open");
            document.body.classList.toggle("mobile-menu-open", isOpen);
            if (summary) {
                summary.setAttribute("aria-expanded", String(isOpen));
            }
        };

        syncMobileMenuState();
        mobileDropdown.addEventListener("toggle", syncMobileMenuState);

        if (summary) {
            summary.addEventListener("click", (event) => {
                if (!mobileDropdown.hasAttribute("open")) {
                    return;
                }

                event.preventDefault();
                closeMobileMenu();
            });
        }

        mobileDropdown.addEventListener("click", (event) => {
            const targetElement = event.target;
            if (!(targetElement instanceof Element)) {
                return;
            }

            if (targetElement.closest(".mobile-dropdown__backdrop")) {
                closeMobileMenu();
                return;
            }

            if (targetElement.closest(".mobile-dropdown__panel a")) {
                closeMobileMenu();
            }
        });

        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape" && mobileDropdown.hasAttribute("open")) {
                closeMobileMenu();
            }
        });

        document.addEventListener("click", (event) => {
            if (!mobileDropdown.hasAttribute("open")) {
                return;
            }

            const targetElement = event.target;
            if (!(targetElement instanceof Element)) {
                return;
            }

            if (!targetElement.closest(".mobile-dropdown")) {
                closeMobileMenu();
            }
        });
    }

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
