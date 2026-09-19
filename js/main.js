document.documentElement.classList.add("js");

const menuToggle = document.getElementById("menuToggle");
const siteNav = document.getElementById("siteNav");
/*SLideshow instead of placeholders*/
const projectSlides = document.querySelectorAll(".project-slide");
const projectDots = document.querySelectorAll(".project-dot");
const galleryPrev = document.getElementById("galleryPrev");
const galleryNext = document.getElementById("galleryNext");
const projectSlideshow = document.querySelector(".project-slideshow");
let currentProjectSlide = 0;
let projectSlideshowTimer;

function showProjectSlide(index) {
  if (!projectSlides.length) return;

  const nextIndex = (index + 1) % projectSlides.length;

  projectSlides.forEach((slide, i) => {
    slide.classList.toggle("active", i === index);
  });

  projectDots.forEach((dot, i) => {
    dot.classList.toggle("active", i === index);
  });

  currentProjectSlide = index;

  if (projectSlideshow) {
    projectSlideshow.classList.add("is-ready");
  }

  const nextImage = projectSlides[nextIndex].querySelector("img");
  if (nextImage) {
    nextImage.loading = "eager";
  }
}

function nextProjectSlide() {
  const next = (currentProjectSlide + 1) % projectSlides.length;
  showProjectSlide(next);
}

function previousProjectSlide() {
  const previous =
    (currentProjectSlide - 1 + projectSlides.length) % projectSlides.length;
  showProjectSlide(previous);
}

if (galleryNext) {
  galleryNext.addEventListener("click", nextProjectSlide);
}

if (galleryPrev) {
  galleryPrev.addEventListener("click", previousProjectSlide);
}

projectDots.forEach((dot, index) => {
  dot.addEventListener("click", () => showProjectSlide(index));
});

function startProjectSlideshow() {
  if (projectSlides.length > 1 && !projectSlideshowTimer) {
    projectSlideshowTimer = setInterval(nextProjectSlide, 5000);
  }
}

function stopProjectSlideshow() {
  clearInterval(projectSlideshowTimer);
  projectSlideshowTimer = undefined;
}

showProjectSlide(0);

if (projectSlides.length > 1) {
  startProjectSlideshow();
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      stopProjectSlideshow();
    } else {
      startProjectSlideshow();
    }
  });
}

if (menuToggle && siteNav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = siteNav.classList.toggle("show");
    menuToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
  });

  // Close nav when a link is clicked and update aria state
  siteNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      siteNav.classList.remove("show");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });

  // Close nav with Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      if (siteNav.classList.contains("show")) {
        siteNav.classList.remove("show");
        menuToggle.setAttribute("aria-expanded", "false");
      }
    }
  });
}

const revealItems = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("visible"));
}

const slides = document.querySelectorAll(".slide");
const dots = document.querySelectorAll(".dot");
let currentSlide = 0;

function showSlide(index) {
  slides.forEach((slide, i) => {
    slide.classList.toggle("active", i === index);
  });

  dots.forEach((dot, i) => {
    dot.classList.toggle("active", i === index);
  });

  currentSlide = index;
}

dots.forEach((dot, index) => {
  dot.addEventListener("click", () => {
    showSlide(index);
  });
});

// Auto-advance main slider only when there are multiple slides
if (slides.length > 1) {
  setInterval(() => {
    const next = (currentSlide + 1) % slides.length;
    showSlide(next);
  }, 4000);
}

// Keyboard support for slides and project slideshow
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft") {
    // previous project slide if visible
    if (projectSlides.length > 0) previousProjectSlide();
  } else if (e.key === "ArrowRight") {
    if (projectSlides.length > 0) nextProjectSlide();
  }
});

const navLinks = document.querySelectorAll(".site-nav a");
const sections = document.querySelectorAll("main section[id]");

function updateActiveNav() {
  let current = "";

  sections.forEach((section) => {
    const sectionTop = section.offsetTop - 110;
    if (window.scrollY >= sectionTop) {
      current = section.getAttribute("id");
    }
  });

  navLinks.forEach((link) => {
    const href = link.getAttribute("href").replace("#", "");
    link.classList.toggle("active", href === current);
  });
}

window.addEventListener("scroll", updateActiveNav);
window.addEventListener("load", updateActiveNav);