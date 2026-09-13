const SITE = {
  name: "TLFM Solar & Electrical",
  formspreeEndpoint: "https://formspree.io/f/xgaejnae"
};

const path = window.location.pathname;

const navItems = [
  ["HOME", "/"],
  ["SOLAR SOLUTIONS", "/solar"],
  ["EV CHARGERS", "/ev-chargers"],
  ["PROJECTS", "/projects"],
  ["ABOUT US", "/about"],
  ["CONTACT", "/contact"]
];

document.addEventListener("DOMContentLoaded", () => {

  /* =========================
     HEADER
  ========================= */

  const header = document.querySelector("#site-header");

  if (header) {
    header.innerHTML = `
      <header class="site-header">
        <nav class="navbar container" aria-label="Primary navigation">

          <a class="brand" href="/" aria-label="TLFM Solar & Electrical home">
            <img
              src="/assets/images/TLFM_nav_logo.svg"
              alt="TLFM Solar & Electrical"
            >
          </a>

          <button
            class="menu-toggle"
            type="button"
            aria-label="Open menu"
            aria-expanded="false"
          >
            ☰
          </button>

          <ul class="nav-links">
            ${navItems
              .map(
                ([label, href]) =>
                  `<li><a href="${href}">${label}</a></li>`
              )
              .join("")}
          </ul>

          <a class="btn btn-primary" href="/contact">
            GET A QUOTE
          </a>

        </nav>
      </header>
    `;
  }


  /* =========================
     FOOTER
  ========================= */

  const footer = document.querySelector("#site-footer");

  if (footer) {
    footer.innerHTML = `
      <footer class="site-footer">
        <div class="container">

          <div class="footer-grid">

            <div>
              <a class="brand" href="/" aria-label="TLFM Solar & Electrical home">
                <img
                  src="/assets/images/TLFM_nav_logo.svg"
                  alt="TLFM Energy"
                >
              </a>

              <p>
                Powering homes, businesses and communities with reliable
                solar and EV charging solutions.
              </p>
            </div>


            <div>
              <div class="footer-title">QUICK LINKS</div>

              <ul class="footer-links">
                ${navItems
                  .map(
                    ([label, href]) =>
                      `<li><a href="${href}">${label}</a></li>`
                  )
                  .join("")}
              </ul>
            </div>


            <div>
              <div class="footer-title">CONTACT US</div>

              <p>☎ +27 79 942 8006</p>
              <p>☎ +27 73 079 7046</p>

              <p>
                ✉
                <a href="mailto:info@tlfmsolarandelectrical.co.za">
                  info@tlfmsolarandelectrical.co.za
                </a>
              </p>

              <p>⌖ Gauteng, South Africa</p>
            </div>


            <div>
              <div class="footer-title">FOLLOW US</div>

              <p>
                <a
                  href="https://web.facebook.com/p/TLFM-Transportation-services-100063531940409/?_rdc=1&_rdr"
                  aria-label="Facebook"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Facebook
                </a>
              </p>

              <p>
                <a href="#" aria-label="Instagram">
                  Instagram
                </a>
              </p>

              <p>
                <a href="#" aria-label="LinkedIn">
                  LinkedIn
                </a>
              </p>
            </div>

          </div>

          <div class="footer-bottom">
            © ${new Date().getFullYear()}
            TLFM Solar and Electrical.
            All rights reserved.
          </div>

        </div>
      </footer>
    `;
  }


  /* =========================
     MOBILE MENU
  ========================= */

  const menu = document.querySelector(".menu-toggle");
  const links = document.querySelector(".nav-links");

  if (menu && links) {
    menu.addEventListener("click", () => {

      const isOpen = links.classList.toggle("open");

      menu.setAttribute(
        "aria-expanded",
        String(isOpen)
      );

      menu.setAttribute(
        "aria-label",
        isOpen ? "Close menu" : "Open menu"
      );
    });
  }


  /* =========================
     ACTIVE NAVIGATION
  ========================= */

  document.querySelectorAll(".nav-links a").forEach((link) => {

    const href = link.getAttribute("href");

    const current =
      href === path ||
      (href === "/" && (path === "/" || path === "/index.html"));

    if (current) {
      link.classList.add("active");
    }
  });


  /* =========================
     FORMSPREE CONFIGURATION
  ========================= */

  document
    .querySelectorAll("form[action*='YOUR_FORMSPREE_ID']")
    .forEach((form) => {
      form.action = SITE.formspreeEndpoint;
    });


  /* =========================
     LEAD FORMS
  ========================= */

  document.querySelectorAll(".lead-form").forEach((form) => {

    form.addEventListener("submit", async (event) => {

      if (
        !form.action ||
        form.action.includes("YOUR_FORMSPREE_ID")
      ) {
        return;
      }

      const status = form.querySelector(".form-status");

      if (!status) {
        return;
      }

      event.preventDefault();

      status.textContent = "Sending your enquiry…";

      try {

        const response = await fetch(form.action, {
          method: "POST",
          body: new FormData(form),
          headers: {
            Accept: "application/json"
          }
        });

        if (!response.ok) {
          throw new Error("Form submission failed");
        }

        form.reset();

        status.textContent =
          "Thank you — your enquiry has been sent.";

      } catch (error) {

        console.error("Form submission error:", error);

        status.textContent =
          "Something went wrong. Please try again or email us directly.";
      }
    });
  });

});