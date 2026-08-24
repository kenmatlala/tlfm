
const SITE = {
  name: "TLFM Energy & Training",
  formspreeEndpoint: "https://formspree.io/f/YOUR_FORMSPREE_ID"
};

const path = window.location.pathname.replace(/\\/g, "/");
const inPages = path.includes("/pages/");
const prefix = inPages ? "../" : "";

const navItems = [
  ["HOME", `${prefix}index.html`],
  ["SOLAR SOLUTIONS", `${prefix}pages/solar.html`],
  ["EV CHARGERS", `${prefix}pages/ev-chargers.html`],
  ["TRAINING & CERTIFICATION", `${prefix}pages/training.html`],
  ["PROJECTS", `${prefix}pages/projects.html`],
  ["ABOUT US", `${prefix}pages/about.html`],
  ["CONTACT", `${prefix}pages/contact.html`]
];

document.addEventListener("DOMContentLoaded", () => {
  document.querySelector("#site-header").innerHTML = `
    <header class="site-header">
      <nav class="navbar container" aria-label="Primary navigation">
        <a class="brand" href="${prefix}index.html" aria-label="TLFM Energy & Training home">
          <span class="brand-mark">☀</span>
          <span>TLFM<small>ENERGY & TRAINING</small></span>
        </a>
        <button class="menu-toggle" aria-label="Open menu" aria-expanded="false">☰</button>
        <ul class="nav-links">
          ${navItems.map(([label, href]) => `<li><a href="${href}">${label}</a></li>`).join("")}
        </ul>
        <a class="btn btn-primary" href="${prefix}pages/contact.html">GET A QUOTE</a>
      </nav>
    </header>`;

  document.querySelector("#site-footer").innerHTML = `
    <footer class="site-footer">
      <div class="container">
        <div class="footer-grid">
          <div>
            <a class="brand" href="${prefix}index.html"><span class="brand-mark">☀</span><span>TLFM<small>ENERGY & TRAINING</small></span></a>
            <p>Powering homes, businesses and communities with clean energy solutions and empowering people through certified training.</p>
          </div>
          <div><div class="footer-title">QUICK LINKS</div><ul class="footer-links">${navItems.slice(0,6).map(([label,href]) => `<li><a href="${href}">${label}</a></li>`).join("")}</ul></div>
          <div><div class="footer-title">CONTACT US</div><p>☎ +27 11 123 4567</p><p>✉ info@tlfm.co.za</p><p>⌖ Gauteng, South Africa</p></div>
          <div><div class="footer-title">FOLLOW US</div><p><a href="#" aria-label="Facebook">Facebook</a></p><p><a href="#" aria-label="Instagram">Instagram</a></p><p><a href="#" aria-label="LinkedIn">LinkedIn</a></p></div>
        </div>
        <div class="footer-bottom">© ${new Date().getFullYear()} TLFM Energy & Training. All rights reserved.</div>
      </div>
    </footer>`;

  const menu = document.querySelector(".menu-toggle");
  const links = document.querySelector(".nav-links");
  menu?.addEventListener("click", () => {
    const open = links.classList.toggle("open");
    menu.setAttribute("aria-expanded", String(open));
  });

  // Mark active navigation link.
  document.querySelectorAll(".nav-links a").forEach(a => {
    const href = a.getAttribute("href");
    const current = path.endsWith(href.replaceAll("../", "")) || (href.endsWith("index.html") && (path.endsWith("/") || path.endsWith("/index.html")));
    if (current) a.classList.add("active");
  });

  // Use the configured Formspree endpoint on every site form.
  document.querySelectorAll("form[action*='YOUR_FORMSPREE_ID']").forEach(form => {
    form.action = SITE.formspreeEndpoint;
  });

  document.querySelectorAll(".lead-form").forEach(form => {
    form.addEventListener("submit", async (event) => {
      if (form.action.includes("YOUR_FORMSPREE_ID")) return;
      const status = form.querySelector(".form-status");
      if (!status) return;
      event.preventDefault();
      status.textContent = "Sending your enquiry…";
      try {
        const response = await fetch(form.action, {
          method: "POST",
          body: new FormData(form),
          headers: { Accept: "application/json" }
        });
        if (!response.ok) throw new Error("Form submission failed");
        form.reset();
        status.textContent = "Thank you — your enquiry has been sent.";
      } catch (error) {
        status.textContent = "Something went wrong. Please try again or email us directly.";
      }
    });
  });
});
