/* Project photo gallery: masonry grid + swipe/scroll lightbox.
   Only runs on pages that contain #projectGallery (projects.html). */

const PROJECT_PHOTOS = [
  { file: "project-01", tag: "INVERTER & BATTERY", title: "Battery & Inverter Install" },
  { file: "project-02", tag: "ROOFTOP SOLAR",       title: "Residential Rooftop Array" },
  { file: "project-03", tag: "ROOFTOP SOLAR",       title: "Tiled Roof PV Installation" },
  { file: "project-04", tag: "ROOFTOP SOLAR",       title: "Residential Solar System" },
  { file: "project-05", tag: "ROOFTOP SOLAR",       title: "Multi-Array Rooftop System" },
  { file: "project-06", tag: "ROOFTOP SOLAR",       title: "Tiled Roof Solar Array" },
  { file: "project-07", tag: "ROOFTOP SOLAR",       title: "Angled Panel Installation" },
  { file: "project-08", tag: "ROOFTOP SOLAR",       title: "Residential PV System" },
  { file: "project-09", tag: "INVERTER & BATTERY",  title: "Wall-Mounted Battery Bank" },
  { file: "project-10", tag: "ROOFTOP SOLAR",       title: "Panel Row Close-Up" },
  { file: "project-11", tag: "ROOFTOP SOLAR",       title: "Rooftop Array, Wide View" },
  { file: "project-12", tag: "ROOFTOP SOLAR",       title: "Tiled Roof Solar Install" },
  { file: "project-13", tag: "ROOFTOP SOLAR",       title: "Rooftop Solar System" },
  { file: "project-14", tag: "INVERTER & BATTERY",  title: "Indoor Inverter Setup" },
  { file: "project-15", tag: "INVERTER & BATTERY",  title: "Battery Storage Install" },
  { file: "project-16", tag: "ROOFTOP SOLAR",       title: "Panel Installation Detail" },
  { file: "project-17", tag: "INVERTER & BATTERY",  title: "Inverter Wall Mount" },
  { file: "project-18", tag: "INVERTER & BATTERY",  title: "Distribution & Inverter Setup" },
  { file: "project-19", tag: "INVERTER & BATTERY",  title: "Home Battery Installation" },
  { file: "project-20", tag: "INVERTER & BATTERY",  title: "Inverter & Battery Bank" },
  { file: "project-21", tag: "INVERTER & BATTERY",  title: "Complete Storage Setup" }
];

document.addEventListener("DOMContentLoaded", () => {
  const grid = document.querySelector("#projectGallery");
  if (!grid) return; // Not on the projects page.

  const path = window.location.pathname.replace(/\\/g, "/");
  const prefix = path.includes("/pages/") ? "../" : "";
  const thumbBase = `${prefix}assets/images/projects/thumb/`;
  const fullBase = `${prefix}assets/images/projects/full/`;

  const lightbox = document.querySelector("#lightbox");
  const track = document.querySelector("#lightboxTrack");
  const counter = document.querySelector("#lightboxCounter");
  const btnClose = document.querySelector("#lightboxClose");
  const btnPrev = document.querySelector("#lightboxPrev");
  const btnNext = document.querySelector("#lightboxNext");

  // Build the masonry grid.
  const gridFrag = document.createDocumentFragment();
  PROJECT_PHOTOS.forEach((photo, index) => {
    const fig = document.createElement("figure");
    fig.className = "gallery-item";
    fig.tabIndex = 0;
    fig.setAttribute("role", "button");
    fig.setAttribute("aria-label", `View photo: ${photo.title}`);
    fig.dataset.index = String(index);

    const img = document.createElement("img");
    img.src = `${thumbBase}${photo.file}.jpg`;
    img.alt = photo.title;
    img.loading = "lazy";
    img.decoding = "async";

    const cap = document.createElement("figcaption");
    cap.innerHTML = `<span>${photo.tag}</span>`;

    fig.appendChild(img);
    fig.appendChild(cap);
    gridFrag.appendChild(fig);
  });
  grid.appendChild(gridFrag);

  // Build the lightbox slides.
  const trackFrag = document.createDocumentFragment();
  PROJECT_PHOTOS.forEach((photo) => {
    const slide = document.createElement("div");
    slide.className = "lightbox-slide";

    const img = document.createElement("img");
    img.src = `${fullBase}${photo.file}.jpg`;
    img.alt = photo.title;
    img.loading = "lazy";

    const cap = document.createElement("div");
    cap.className = "lightbox-caption";
    cap.innerHTML = `<span>${photo.tag}</span><b>${photo.title}</b>`;

    slide.appendChild(img);
    slide.appendChild(cap);
    trackFrag.appendChild(slide);
  });
  track.appendChild(trackFrag);

  const slides = Array.from(track.querySelectorAll(".lightbox-slide"));
  let currentIndex = 0;
  let lastFocused = null;

  function updateCounter() {
    counter.textContent = `${currentIndex + 1} / ${PROJECT_PHOTOS.length}`;
  }

  function goTo(index, smooth = true) {
    currentIndex = (index + PROJECT_PHOTOS.length) % PROJECT_PHOTOS.length;
    const target = slides[currentIndex];
    track.scrollTo({ left: target.offsetLeft, behavior: smooth ? "smooth" : "auto" });
    updateCounter();
  }

  function openLightbox(index, triggerEl) {
    lastFocused = triggerEl || document.activeElement;
    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.classList.add("lightbox-lock");
    goTo(index, false);
    btnClose.focus();
  }

  function closeLightbox() {
    lightbox.classList.remove("open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.classList.remove("lightbox-lock");
    if (lastFocused && typeof lastFocused.focus === "function") lastFocused.focus();
  }

  // Grid interactions: click/tap opens the lightbox on any device.
  grid.querySelectorAll(".gallery-item").forEach((item) => {
    item.addEventListener("click", () => openLightbox(Number(item.dataset.index), item));
    item.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openLightbox(Number(item.dataset.index), item);
      }
    });
  });

  btnClose.addEventListener("click", closeLightbox);
  btnPrev.addEventListener("click", () => goTo(currentIndex - 1));
  btnNext.addEventListener("click", () => goTo(currentIndex + 1));

  // Close on backdrop click (but not when clicking a slide/image/controls).
  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) closeLightbox();
  });

  // Keyboard navigation.
  document.addEventListener("keydown", (event) => {
    if (!lightbox.classList.contains("open")) return;
    if (event.key === "Escape") closeLightbox();
    if (event.key === "ArrowRight") goTo(currentIndex + 1);
    if (event.key === "ArrowLeft") goTo(currentIndex - 1);
  });

  // Let a plain vertical mouse-wheel also move the horizontal track (desktop convenience).
  // Touch devices ignore this and use native swipe/scroll on the track.
  track.addEventListener(
    "wheel",
    (event) => {
      if (Math.abs(event.deltaY) > Math.abs(event.deltaX)) {
        track.scrollLeft += event.deltaY;
        event.preventDefault();
      }
    },
    { passive: false }
  );

  // Keep currentIndex in sync if the user free-scrolls/swipes the track.
  let scrollDebounce;
  track.addEventListener("scroll", () => {
    clearTimeout(scrollDebounce);
    scrollDebounce = setTimeout(() => {
      const trackCenter = track.scrollLeft + track.clientWidth / 2;
      let closest = 0;
      let closestDist = Infinity;
      slides.forEach((slide, i) => {
        const slideCenter = slide.offsetLeft + slide.clientWidth / 2;
        const dist = Math.abs(trackCenter - slideCenter);
        if (dist < closestDist) {
          closestDist = dist;
          closest = i;
        }
      });
      currentIndex = closest;
      updateCounter();
    }, 100);
  });

  // Re-align the active slide after a viewport resize (scroll position is width-dependent).
  window.addEventListener("resize", () => goTo(currentIndex, false));
});
