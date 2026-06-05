document.addEventListener("DOMContentLoaded", () => {
  const roles = [
    "IT Officer",
    "Network Engineer",
    "MikroTik Certified (MTCNA)"
  ];

  const typewriterElement = document.getElementById("typewriter");
  const filterButtons = document.querySelectorAll(".filter-btn");
  const portfolioItems = document.querySelectorAll(".portfolio-item");
  const revealElements = document.querySelectorAll(".reveal");
  const progressBars = document.querySelectorAll(".progress-bar[data-progress]");
  const contactForm = document.getElementById("contactForm");
  const certificateModal = document.getElementById("certificateModal");
  const navbarCollapse = document.querySelector(".navbar-collapse");
  const navbar = document.getElementById("mainNav");
  const navLinks = document.querySelectorAll(".nav-link");

  /* === TYPEWRITER EFFECT === */
  if (typewriterElement) {
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    const type = () => {
      const currentRole = roles[roleIndex];
      typewriterElement.textContent = currentRole.slice(0, charIndex);

      if (!isDeleting && charIndex < currentRole.length) {
        charIndex += 1;
        setTimeout(type, 90);
        return;
      }

      if (isDeleting && charIndex > 0) {
        charIndex -= 1;
        setTimeout(type, 45);
        return;
      }

      if (!isDeleting) {
        isDeleting = true;
        setTimeout(type, 1300);
      } else {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        setTimeout(type, 250);
      }
    };

    type();
  }

  /* === SCROLL REVEAL === */
  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");

          const bars = entry.target.querySelectorAll(".progress-bar[data-progress]");
          bars.forEach((bar, index) => {
            window.setTimeout(() => {
              bar.style.width = `${bar.dataset.progress}%`;
            }, index * 120);
          });

          revealObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.18
    });

    revealElements.forEach((element) => revealObserver.observe(element));
  } else {
    revealElements.forEach((element) => element.classList.add("is-visible"));
    progressBars.forEach((bar) => {
      bar.style.width = `${bar.dataset.progress}%`;
    });
  }

  /* === PORTFOLIO FILTER === */
  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const selectedFilter = button.dataset.filter;

      filterButtons.forEach((item) => item.classList.remove("active"));
      button.classList.add("active");

      portfolioItems.forEach((card) => {
        const matches = selectedFilter === "all" || card.dataset.category === selectedFilter;
        card.classList.toggle("is-hidden", !matches);

        if (matches) {
          card.classList.remove("is-pop");
          window.requestAnimationFrame(() => {
            card.classList.add("is-pop");
          });
        }
      });
    });
  });

  /* === CONTACT FORM === */
  if (contactForm) {
    contactForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const name = contactForm.querySelector("#name");
      const email = contactForm.querySelector("#email");
      const message = contactForm.querySelector("#message");

      if (!name.value.trim() || !email.value.trim() || !message.value.trim()) {
        window.alert("Mohon lengkapi nama, email, dan pesan terlebih dahulu.");
        return;
      }

      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(email.value.trim())) {
        window.alert("Mohon masukkan alamat email yang valid.");
        return;
      }

      window.alert("Pesan Anda berhasil dikirim. Terima kasih sudah menghubungi Ilman.");
      contactForm.reset();
    });
  }

  /* === CERTIFICATE MODAL === */
  if (certificateModal) {
    certificateModal.addEventListener("show.bs.modal", (event) => {
      const trigger = event.relatedTarget;
      if (!trigger) {
        return;
      }

      const modalTitle = certificateModal.querySelector("#certificateModalLabel");
      const modalCategory = certificateModal.querySelector("#certificateModalCategory");
      const modalImage = certificateModal.querySelector("#certificateModalImage");

      modalTitle.textContent = trigger.dataset.certTitle || "Certificate Preview";
      modalCategory.innerHTML = trigger.dataset.certCategory || "Certificate";
      modalImage.src = trigger.dataset.certSrc || "";
      modalImage.alt = trigger.dataset.certTitle || "Certificate preview";
    });
  }

  /* === NAVBAR ACTIVE STATE FALLBACK === */
  const sections = document.querySelectorAll("main section[id]");
  const setActiveLink = () => {
    const offsetPosition = window.scrollY + 120;
    let currentSection = "home";

    sections.forEach((section) => {
      if (offsetPosition >= section.offsetTop) {
        currentSection = section.id;
      }
    });

    navLinks.forEach((link) => {
      const isCurrent = link.getAttribute("href") === `#${currentSection}`;
      link.classList.toggle("active", isCurrent);
    });

    navbar.classList.toggle("is-scrolled", window.scrollY > 24);
  };

  setActiveLink();
  window.addEventListener("scroll", setActiveLink, { passive: true });

  /* === MOBILE NAV CLOSE === */
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      if (window.innerWidth < 992 && navbarCollapse.classList.contains("show")) {
        const collapseInstance = bootstrap.Collapse.getOrCreateInstance(navbarCollapse);
        collapseInstance.hide();
      }
    });
  });
});
