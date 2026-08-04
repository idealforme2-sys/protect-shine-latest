document.body.classList.add("js");

const businessNumber = "9723385781";
let selectedPackage = "Priority Detail";

const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function smsHref(packageName) {
  const body = `Hi Protect & Shine Detailing, I'd like to book the ${packageName}.`;
  return `sms:${businessNumber}?&body=${encodeURIComponent(body)}`;
}

function syncSelectedPackage(packageName) {
  selectedPackage = packageName;
  document.querySelectorAll("[data-selected-package-label]").forEach((label) => {
    label.textContent = packageName;
  });
  document.querySelectorAll("[data-quote-service-select]").forEach((select) => {
    const personalValue = "Personal Vehicle Detail";
    const hasPersonal = Array.from(select.options).some((option) => option.value === personalValue || option.textContent === personalValue);
    if (hasPersonal) {
      select.value = personalValue;
    } else if (Array.from(select.options).some((option) => option.value === packageName)) {
      select.value = packageName;
    }
  });
  document.querySelectorAll("[data-sms-link]").forEach((link) => {
    link.setAttribute("href", smsHref(packageName));
  });
}

function setQuoteService(serviceName) {
  if (!serviceName) return;
  document.querySelectorAll("[data-quote-service-select]").forEach((select) => {
    const match = Array.from(select.options).find(
      (option) => option.value === serviceName || option.textContent === serviceName
    );
    if (match) select.value = match.value || match.textContent;
  });
}

function initServiceLinks() {
  document.querySelectorAll("[data-quote-service]").forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      const serviceName = link.dataset.quoteService;
      // Click the matching package card in the quote form
      const card = document.querySelector(`[data-package-select="${serviceName}"]`);
      if (card) card.click();
      document.querySelector("#quote")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
}

function initPreloader() {
  const preloader = document.querySelector("[data-preloader]");
  if (!preloader) return;

  const hasSeenPreloader = sessionStorage.getItem("protect-shine-preloader") === "done";
  if (hasSeenPreloader) {
    preloader.remove();
    document.body.classList.add("is-loaded");
    return;
  }

  const bar = preloader.querySelector("[data-preloader-bar]");
  const percent = preloader.querySelector("[data-preloader-percent]");
  let progress = 0;
  let hidden = false;

  const updateProgress = (value) => {
    progress = Math.max(progress, Math.min(100, Math.round(value)));
    bar?.style.setProperty("--preloader-progress", `${progress / 100}`);
    if (percent) percent.textContent = `${progress}%`;
  };

  const timer = window.setInterval(() => {
    if (hidden) return;
    const next = progress + (progress < 55 ? 7 : progress < 82 ? 4 : 2);
    updateProgress(Math.min(next, 94));
  }, 120);

  const hide = () => {
    if (hidden) return;
    hidden = true;
    document.body.classList.add("is-loaded");
    sessionStorage.setItem("protect-shine-preloader", "done");
    updateProgress(100);
    window.clearInterval(timer);
    window.setTimeout(() => {
      preloader.classList.add("is-hidden");
      window.setTimeout(() => preloader.remove(), 360);
    }, 260);
    updateHeaderState();
  };

  updateProgress(0);

  const startedAt = Date.now();
  const finishWhenReady = () => {
    const remaining = Math.max(0, 900 - (Date.now() - startedAt));
    window.setTimeout(hide, remaining);
  };
  if (document.readyState === "complete") {
    finishWhenReady();
  } else {
    window.addEventListener("load", finishWhenReady, { once: true });
    window.setTimeout(() => { if (!hidden) hide(); }, 4500);
  }
}

function updateHeaderState() {
  const header = document.querySelector("[data-header]");
  if (!header) return;
  header.classList.toggle("is-scrolled", window.scrollY > 20);
}

function normalizePageState() {
  document.body.classList.add("is-loaded");
  document.body.style.overflow = "";
  if (sessionStorage.getItem("protect-shine-preloader") === "done") {
    document.querySelector("[data-preloader]")?.remove();
  }
  document.querySelectorAll(".hero-content, .hero-badge-card, .hero .eyebrow, #hero-title > span, .hero-copy, .hero-actions, .hero-cred-cards").forEach((item) => {
    item.style.removeProperty("opacity");
    item.style.removeProperty("filter");
    item.style.removeProperty("transform");
    item.style.removeProperty("visibility");
  });
  document.querySelector("[data-nav]")?.classList.remove("is-open");
  document.querySelector("[data-nav-backdrop]")?.classList.remove("is-open");
  document.querySelector("[data-nav-dropdown]")?.classList.remove("is-open");
}

function initRoutePrefetch() {
  if (!document.querySelector(".hero")) return;
  const prefetch = () => ["commercial-truck-detailing.html", "first-responder-detailing.html"].forEach((href) => {
    const link = document.createElement("link");
    link.rel = "prefetch";
    link.href = href;
    document.head.append(link);
  });
  if ("requestIdleCallback" in window) window.requestIdleCallback(prefetch, { timeout: 1800 });
  else window.setTimeout(prefetch, 1200);
}

function accentTextNodes(text) {
  const nodes = [];
  const tokens = text.match(/\s+|\S+/g) || [];
  let accentedWords = 0;

  const pushAccent = (value) => {
    const span = document.createElement("span");
    span.className = accentedWords === 0 ? "accent-blue" : "accent-red";
    span.textContent = value;
    nodes.push(span);
    accentedWords += 1;
  };

  tokens.forEach((token) => {
    const isWord = /[A-Za-z0-9]/.test(token) && token !== "&";
    const hyphenated = token.match(/^([A-Za-z0-9]+)-([A-Za-z0-9].*)$/);

    if (isWord && accentedWords < 2) {
      if (hyphenated && accentedWords === 0) {
        pushAccent(hyphenated[1]);
        nodes.push(document.createTextNode("-"));
        pushAccent(hyphenated[2]);
        return;
      }

      pushAccent(token);
      return;
    }

    nodes.push(document.createTextNode(token));
  });

  return { nodes, accentedWords };
}

function accentHeadlineElement(element) {
  if (!element || element.dataset.headlineAccented === "true") return;

  const textNode = Array.from(element.childNodes).find(
    (node) => node.nodeType === Node.TEXT_NODE && /[A-Za-z0-9]/.test(node.textContent)
  );

  if (!textNode) return;

  const { nodes, accentedWords } = accentTextNodes(textNode.textContent);
  if (!accentedWords) return;

  textNode.replaceWith(...nodes);
  element.dataset.headlineAccented = "true";
  element.classList.add("headline-accented");
}

function initHeadlineAccents() {
  document
    .querySelectorAll(
      [
        ".brand-mark strong",
        "#hero-title > span",
        "main section h2",
        ".service-card h3",
        ".service-promise article h3",
        ".promise-panel span",
        ".promise-panel strong",
        ".showcase-copy > span",
        ".showcase-copy h3",
        ".package-card h3",
        ".truck-service-grid h3",
        ".trust-card h3",
        ".map-notes h3",
        ".quote-card h3",
        ".hero-badge-card h2",
        ".preloader strong",
        ".testimonial-stack small",
        ".footer-brand p",
        ".lane-panel h3",
        ".route-step h3",
        ".specialty-panel h3",
        ".why-credential-body h3",
        ".why-crest-label",
        ".faq-category-title",
        ".review-card small",
        ".truck-group h3",
        ".unit-type-card h3",
        ".fr-panel-label",
        ".fr-no-surprise strong",
        ".quote-pkg-name",
        ".car-seat-copy h2",
        ".fr-heading h2",
        ".page-hero-content h1"
      ].join(", ")
    )
    .forEach(accentHeadlineElement);
}

function initHeader() {
  const nav = document.querySelector("[data-nav]");
  const toggle = document.querySelector("[data-nav-toggle]");
  const backdrop = document.querySelector("[data-nav-backdrop]");

  const closeNav = () => {
    nav?.classList.remove("is-open");
    backdrop?.classList.remove("is-open");
    document.body.style.overflow = "";
    toggle?.setAttribute("aria-expanded", "false");
    toggle?.setAttribute("aria-label", "Open navigation");
  };

  updateHeaderState();
  window.addEventListener("scroll", updateHeaderState, { passive: true });
  window.addEventListener("resize", updateHeaderState);
  window.addEventListener("pageshow", updateHeaderState);

  toggle?.addEventListener("click", () => {
    const isOpen = nav?.classList.toggle("is-open") || false;
    backdrop?.classList.toggle("is-open", isOpen);
    document.body.style.overflow = isOpen ? "hidden" : "";
    toggle.setAttribute("aria-expanded", String(isOpen));
    toggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
  });

  nav?.addEventListener("click", (event) => {
    if (event.target.closest("a")) closeNav();
  });

  backdrop?.addEventListener("click", closeNav);

  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeNav();
  });

  // Dropdown functionality
  const dropdown = document.querySelector("[data-nav-dropdown]");
  const dropdownToggle = document.querySelector("[data-dropdown-toggle]");
  const dropdownMenu = document.querySelector("[data-dropdown-menu]");

  if (dropdown && dropdownToggle && dropdownMenu) {
    const closeDropdown = () => {
      dropdown.classList.remove("is-open");
      dropdownToggle.setAttribute("aria-expanded", "false");
    };

    const openDropdown = () => {
      dropdown.classList.add("is-open");
      dropdownToggle.setAttribute("aria-expanded", "true");
    };

    dropdownToggle.addEventListener("click", (event) => {
      event.stopPropagation();
      const isOpen = dropdown.classList.contains("is-open");
      isOpen ? closeDropdown() : openDropdown();
    });

    dropdownToggle.addEventListener("keydown", (event) => {
      if (event.key === "ArrowDown" || event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openDropdown();
        dropdownMenu.querySelector("a")?.focus();
      }
    });

    dropdownMenu.addEventListener("keydown", (event) => {
      const items = Array.from(dropdownMenu.querySelectorAll("a"));
      const currentIndex = items.indexOf(document.activeElement);

      if (event.key === "Escape") {
        closeDropdown();
        dropdownToggle.focus();
      } else if (event.key === "ArrowDown") {
        event.preventDefault();
        items[(currentIndex + 1) % items.length]?.focus();
      } else if (event.key === "ArrowUp") {
        event.preventDefault();
        items[(currentIndex - 1 + items.length) % items.length]?.focus();
      }
    });

    document.addEventListener("click", (event) => {
      if (!dropdown.contains(event.target)) closeDropdown();
    });
  }
}

function initShowcases() {
  document.querySelectorAll("[data-showcase-card]").forEach((card) => {
    const media = card.querySelector("[data-showcase-media]");
    const counter = card.querySelector("[data-showcase-counter]");
    const sources = Array.from(card.querySelectorAll("[data-showcase-src]"))
      .map((item) => item.dataset.showcaseSrc)
      .filter(Boolean);

    if (!media || sources.length === 0) return;

    let active = 0;
    let timer = 0;
    card.classList.toggle("has-carousel", sources.length > 1);

    const render = (next) => {
      window.clearTimeout(timer);
      active = (next + sources.length) % sources.length;
      media.style.opacity = "0.32";

      window.setTimeout(() => {
        media.src = sources[active];
        media.style.opacity = "1";
        if (counter) {
          counter.textContent = `${String(active + 1).padStart(2, "0")} / ${String(sources.length).padStart(2, "0")}`;
        }
        if (sources.length > 1 && !reducedMotion()) {
          timer = window.setTimeout(() => render(active + 1), 5200);
        }
      }, 150);
    };

    card.querySelector(".showcase-prev")?.addEventListener("click", () => render(active - 1));
    card.querySelector(".showcase-next")?.addEventListener("click", () => render(active + 1));
    render(0);
  });
}

function initPackages() {
  syncSelectedPackage(selectedPackage);

  document.querySelectorAll("[data-package]").forEach((button) => {
    button.addEventListener("click", () => {
      const pkgName = button.dataset.package || selectedPackage;
      syncSelectedPackage(pkgName);
      // Click the matching package card in the new quote form
      const card = document.querySelector(`[data-package-select="${pkgName}"]`);
      if (card) card.click();
      document.querySelector("#quote")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
}

function initFaq() {
  document.querySelectorAll(".faq-item button").forEach((button) => {
    button.addEventListener("click", () => {
      const item = button.closest(".faq-item");
      if (!item) return;
      const isOpen = item.classList.toggle("is-open");
      button.setAttribute("aria-expanded", String(isOpen));
    });
  });
}

function initShowcaseVideos() {
  const videos = document.querySelectorAll(".showcase-card video, .finish-media video");
  if (!videos.length) return;

  const nearViewport = (video, margin = 140) => {
    const rect = video.getBoundingClientRect();
    return rect.bottom > -margin && rect.top < window.innerHeight + margin;
  };

  const ensureSource = (video) => {
    if (!video.getAttribute("src") && video.dataset.src) {
      video.src = video.dataset.src;
    }
  };

  const playVideo = (video) => {
    ensureSource(video);
    video.muted = true;
    video.playsInline = true;
    if (video.readyState < 1 && video.networkState !== 2) video.load();
    video.play().catch(() => {});
  };

  const hasIO = "IntersectionObserver" in window;
  if (!hasIO) {
    videos.forEach((video) => playVideo(video));
    return;
  }

  const loader = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      ensureSource(entry.target);
      loader.unobserve(entry.target);
    });
  }, { rootMargin: "700px 0px" });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        playVideo(entry.target);
      } else {
        entry.target.pause();
      }
    });
  }, { threshold: 0.18 });

  videos.forEach((video) => {
    video.addEventListener("stalled", () => {
      if (nearViewport(video)) window.setTimeout(() => playVideo(video), 250);
    });
    video.addEventListener("waiting", () => {
      if (nearViewport(video)) window.setTimeout(() => playVideo(video), 300);
    });
    video.addEventListener("ended", () => playVideo(video));
    video.addEventListener("error", () => {
      const tries = Number(video.dataset.retries || 0);
      if (tries >= 3) return;
      video.dataset.retries = String(tries + 1);
      window.setTimeout(() => {
        video.load();
        playVideo(video);
      }, 800 * (tries + 1));
    });
    video.closest(".showcase-card")?.addEventListener("mouseenter", () => playVideo(video));
    loader.observe(video);
    observer.observe(video);
  });

  window.setInterval(() => {
    if (document.hidden) return;
    videos.forEach((video) => {
      if (video.paused && nearViewport(video)) playVideo(video);
    });
  }, 2500);

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) return;
    videos.forEach((video) => {
      if (nearViewport(video)) playVideo(video);
    });
  });
}

function initQuoteForm() {
  const form = document.querySelector("[data-quote-form]");
  if (!form) return;

  const formType = form.dataset.formType || "personal";
  let selectedPkg = "Priority Detail";
  let selectedTime = null;

  // Package selection
  const packageCards = form.querySelectorAll("[data-package-select]");
  const packageGrid = form.querySelector("[data-package-grid]");
  const carSeatField = form.querySelector("[data-car-seat-field]");
  const serviceToggle = form.querySelector("[data-service-toggle]");
  const serviceOptions = form.querySelector("[data-service-options]");
  const serviceCurrent = form.querySelector("[data-service-current]");
  const servicePrice = form.querySelector("[data-service-price]");

  const closeServiceOptions = () => {
    serviceOptions?.setAttribute("hidden", "");
    serviceToggle?.setAttribute("aria-expanded", "false");
  };
  const updateServiceSummary = (card) => {
    if (!card) return;
    if (serviceCurrent) serviceCurrent.textContent = card.querySelector(".quote-pkg-name")?.textContent || selectedPkg;
    if (servicePrice) servicePrice.textContent = card.querySelector(".quote-pkg-price")?.textContent || "Custom quote";
  };

  packageGrid?.setAttribute("role", "radiogroup");
  packageCards.forEach((card) => {
    card.setAttribute("role", "radio");
    card.setAttribute("aria-checked", String(card.classList.contains("is-selected")));
  });

  packageCards.forEach((card) => {
    card.addEventListener("click", () => {
      packageCards.forEach((c) => {
        c.classList.remove("is-selected");
        c.setAttribute("aria-checked", "false");
      });
      card.classList.add("is-selected");
      card.setAttribute("aria-checked", "true");
      selectedPkg = card.dataset.packageSelect;
      syncSelectedPackage(selectedPkg);
      updateServiceSummary(card);
      closeServiceOptions();

      // Show/hide car seat count field
      if (carSeatField) {
        carSeatField.hidden = selectedPkg !== "Car Seat Cleaning";
      }
    });

    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        card.click();
      }
      if (event.key === "ArrowDown" || event.key === "ArrowRight" || event.key === "ArrowUp" || event.key === "ArrowLeft") {
        event.preventDefault();
        const cards = Array.from(packageCards);
        const direction = event.key === "ArrowDown" || event.key === "ArrowRight" ? 1 : -1;
        cards[(cards.indexOf(card) + direction + cards.length) % cards.length]?.focus();
      }
    });
  });

  updateServiceSummary(form.querySelector(".quote-package-card.is-selected"));
  serviceToggle?.addEventListener("click", () => {
    const isOpen = !serviceOptions?.hasAttribute("hidden");
    if (isOpen) {
      closeServiceOptions();
      return;
    }
    serviceOptions?.removeAttribute("hidden");
    serviceToggle.setAttribute("aria-expanded", "true");
    form.querySelector(".quote-package-card.is-selected")?.focus();
  });
  document.addEventListener("click", (event) => {
    if (serviceOptions && serviceToggle && !form.querySelector(".service-selector")?.contains(event.target)) closeServiceOptions();
  });
  form.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !serviceOptions?.hasAttribute("hidden")) {
      closeServiceOptions();
      serviceToggle?.focus();
    }
  });

  // Preselect from data attributes
  if (form.dataset.preselect) {
    const target = form.querySelector(`[data-package-select="${form.dataset.preselect}"]`);
    if (target) target.click();
  }

  // Step navigation
  const steps = form.querySelectorAll("[data-quote-step]");
  const indicators = form.closest(".quote-shell")?.querySelectorAll("[data-step-indicator]");
  const nextBtn = form.querySelector("[data-next-step]");
  const prevBtn = form.querySelector("[data-prev-step]");

  const goToStep = (stepNum) => {
    steps.forEach((step) => {
      step.classList.toggle("is-active", step.dataset.quoteStep === String(stepNum));
    });
    indicators?.forEach((ind) => {
      ind.classList.toggle("is-active", ind.dataset.stepIndicator === String(stepNum));
    });
  };

  nextBtn?.addEventListener("click", () => {
    // Validate step 1 required fields
    let firstInvalid = null;
    ["name", "phone"].forEach((fieldName) => {
      const field = form.querySelector(`[name="${fieldName}"]`);
      if (!field) return;
      const isEmpty = !String(field.value || "").trim();
      field.closest("label")?.classList.toggle("field-error", isEmpty);
      if (isEmpty && !firstInvalid) firstInvalid = field;
    });

    if (firstInvalid) {
      form.classList.remove("form-shake");
      void form.offsetWidth;
      form.classList.add("form-shake");
      firstInvalid.focus();
      return;
    }

    goToStep(2);
  });

  prevBtn?.addEventListener("click", () => goToStep(1));

  // Date picker → time slots
  const datePicker = form.querySelector("[data-date-picker]");
  const timeSlots = form.querySelector("[data-time-slots]");
  const timePlaceholder = form.querySelector("[data-time-placeholder]");
  const slotButtons = form.querySelectorAll("[data-time-slot]");

  datePicker?.addEventListener("change", () => {
    if (datePicker.value) {
      timeSlots?.removeAttribute("hidden");
      if (timePlaceholder) timePlaceholder.style.display = "none";
    } else {
      timeSlots?.setAttribute("hidden", "");
      if (timePlaceholder) timePlaceholder.style.display = "";
    }
  });

  slotButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      slotButtons.forEach((b) => b.classList.remove("is-selected"));
      btn.classList.add("is-selected");
      selectedTime = btn.dataset.timeSlot;
    });
  });

  // Clear field errors on input
  form.querySelectorAll("input, textarea, select").forEach((field) => {
    field.addEventListener("input", () => {
      field.closest("label")?.classList.remove("field-error");
    });
  });

  // Form submission
  form.addEventListener("submit", (event) => {
    event.preventDefault();

    let firstInvalid = null;
    ["name", "phone"].forEach((fieldName) => {
      const field = form.querySelector(`[name="${fieldName}"]`);
      if (!field) return;
      const isEmpty = !String(field.value || "").trim();
      field.closest("label")?.classList.toggle("field-error", isEmpty);
      if (isEmpty && !firstInvalid) firstInvalid = field;
    });

    if (firstInvalid) {
      form.classList.remove("form-shake");
      void form.offsetWidth;
      form.classList.add("form-shake");
      firstInvalid.focus();
      goToStep(1);
      return;
    }

    const data = new FormData(form);
    const details = [
      ["Name", data.get("name")],
      ["Phone", data.get("phone")],
      ["Package", selectedPkg],
      formType === "commercial-truck" ? ["Request Type", "Commercial Truck"] : null,
      formType === "first-responder" ? ["Request Type", "First Responder"] : null,
      ["Vehicle", data.get("vehicle")],
      ["Vehicle Detail", data.get("vehicle-detail")],
      ["Number of Vehicles", data.get("vehicle-count")],
      ["Unit Type", data.get("unit-type")],
      ["Agency", data.get("agency")],
      ["Car Seats", data.get("car-seats")],
      ["Area", data.get("area")],
      ["Condition", data.get("condition")],
      ["Add-Ons", data.get("addons")],
      ["Date", data.get("preferred-date")],
      ["Time", selectedTime],
      ["Notes", data.get("notes")]
    ]
      .filter((item) => item && String(item[1] || "").trim())
      .map(([label, value]) => `${label}: ${String(value).trim()}`)
      .join("\n");

    const body = `Hi Protect & Shine Detailing, I'd like a quote.\n${details}`;
    window.location.href = `sms:${businessNumber}?&body=${encodeURIComponent(body)}`;
  });
}

function initCustomCursor() {
  const isTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
  if (!window.matchMedia("(pointer: fine)").matches || isTouch) return;

  const dot = document.querySelector("[data-cursor-dot]");
  const ring = document.querySelector("[data-cursor-ring]");
  if (!dot || !ring) return;

  document.body.classList.add("has-custom-cursor");

  const gsapApi = window.gsap;
  if (gsapApi) {
    gsapApi.set([dot, ring], { xPercent: -50, yPercent: -50 });
  }

  const moveDot = gsapApi
    ? gsapApi.quickTo(dot, "x", { duration: 0.12, ease: "power3.out" })
    : null;
  const moveDotY = gsapApi
    ? gsapApi.quickTo(dot, "y", { duration: 0.12, ease: "power3.out" })
    : null;
  const moveRing = gsapApi
    ? gsapApi.quickTo(ring, "x", { duration: 0.34, ease: "power3.out" })
    : null;
  const moveRingY = gsapApi
    ? gsapApi.quickTo(ring, "y", { duration: 0.34, ease: "power3.out" })
    : null;

  window.addEventListener("mousemove", (event) => {
    dot.classList.add("is-visible");
    ring.classList.add("is-visible");

    if (gsapApi) {
      moveDot(event.clientX);
      moveDotY(event.clientY);
      moveRing(event.clientX);
      moveRingY(event.clientY);
      return;
    }

    dot.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0) translate(-50%, -50%)`;
    ring.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0) translate(-50%, -50%)`;
  }, { passive: true });

  document.querySelectorAll("a, button, input, select, textarea, .service-card, .package-card, .lane-panel, .specialty-panel, .review-card, .why-credential, .route-step").forEach((item) => {
    item.addEventListener("mouseenter", () => ring.classList.add("is-hovering"));
    item.addEventListener("mouseleave", () => ring.classList.remove("is-hovering"));
  });
}

function initGsapAnimations() {
  const gsapApi = window.gsap;
  if (!gsapApi || reducedMotion()) return;

  if (window.ScrollTrigger) {
    gsapApi.registerPlugin(window.ScrollTrigger);

    gsapApi.to(".hero-content", {
      y: -70,
      ease: "none",
      scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true }
    });

    gsapApi.to(".hero-badge-card", {
      y: -110,
      ease: "none",
      scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true }
    });
  }

  document.querySelectorAll(".package-card").forEach((card) => {
    card.addEventListener("mousemove", (event) => {
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      gsapApi.to(card, {
        rotateX: y * -2,
        rotateY: x * 2,
        transformPerspective: 900,
        duration: 0.35,
        ease: "power3.out"
      });
    });

    card.addEventListener("mouseleave", () => {
      gsapApi.to(card, { rotateX: 0, rotateY: 0, duration: 0.45, ease: "power3.out" });
    });
  });
}

function initReveal() {
  const items = Array.from(document.querySelectorAll(
    ".section-kicker, .section-heading, .lane-panel, .route-step, .route-end, .route-actions, .process-intro, .showcase-card, .package-card, .package-note, .finish-media, .finish-copy, .truck-service-grid article, .finish-actions, .car-seat-copy, .car-seat-details, .fr-heading, .fr-panel, .fr-actions, .why-identity, .why-credential, .why-footer, .area-map, .area-copy, .area-tags, .faq-item, .reviews-intro, .review-card, .quote-copy, .quote-card, .quote-progress, .hero-cred-cards, .faq-heading, .truck-group, .driver-reset-inner, .unit-type-card, .fr-detail-inner, .fr-monthly-inner, .fr-addons-inner, .fr-trust-inner, .fr-conversion-banner, .page-hero-content"
  )).filter((item) => !item.closest(".packages"));

  if (!("IntersectionObserver" in window) || reducedMotion()) {
    items.forEach((item) => item.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  }, { rootMargin: "0px 0px -12% 0px", threshold: 0.12 });

  items.forEach((item, index) => {
    item.classList.add("reveal-ready");
    item.style.setProperty("--reveal-delay", `${Math.min(index % 5, 4) * 55}ms`);
    observer.observe(item);
  });
}

function initScrollProgress() {
  const bar = document.querySelector("[data-scroll-progress]");
  if (!bar) return;

  let ticking = false;
  const update = () => {
    ticking = false;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const ratio = max > 0 ? Math.min(1, window.scrollY / max) : 0;
    bar.style.transform = `scaleX(${ratio})`;
  };
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(update);
  };

  update();
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
}

function initScrollSpy() {
  const links = Array.from(document.querySelectorAll(".site-nav a[href^='#']"));
  if (!links.length || !("IntersectionObserver" in window)) return;

  const map = new Map();
  links.forEach((link) => {
    const href = link.getAttribute("href") || "";
    const id = href.startsWith("#") ? href.slice(1) : null;
    const section = id ? document.getElementById(id) : null;
    if (section) map.set(section, link);
  });
  if (!map.size) return;

  const setActive = (activeLink) => {
    links.forEach((link) => link.classList.toggle("is-active", link === activeLink));
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) setActive(map.get(entry.target));
    });
  }, { rootMargin: "-40% 0px -55% 0px", threshold: 0 });

  map.forEach((_, section) => observer.observe(section));
}

function initBackToTop() {
  const button = document.querySelector("[data-back-to-top]");
  if (!button) return;

  const sync = () => button.classList.toggle("is-visible", window.scrollY > 600);
  sync();
  window.addEventListener("scroll", sync, { passive: true });

  button.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: reducedMotion() ? "auto" : "smooth" });
  });
}

function initScrollCue() {
  const cue = document.querySelector("[data-scroll-cue]");
  if (!cue) return;

  const sync = () => cue.classList.toggle("is-hidden", window.scrollY > 40);
  sync();
  window.addEventListener("scroll", sync, { passive: true });
}

function initStickyBar() {
  const bar = document.querySelector(".sticky-book-bar");
  const quote = document.getElementById("quote");
  if (!bar || !quote || !("IntersectionObserver" in window)) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      bar.classList.toggle("is-hidden-bar", entry.isIntersecting);
    });
  }, { threshold: 0.12 });

  observer.observe(quote);
}

function initSpotlight() {
  if (!window.matchMedia("(pointer: fine)").matches) return;
  if ("ontouchstart" in window || navigator.maxTouchPoints > 0) return;

  document
    .querySelectorAll(".lane-panel, .package-card, .why-credential, .review-card, .route-step, .fr-panel, .truck-group, .unit-type-card, .quote-package-card")
    .forEach((target) => {
      if (target.querySelector(":scope > .spot-fx")) return;
      const spot = document.createElement("div");
      spot.className = "spot-fx";
      spot.setAttribute("aria-hidden", "true");
      target.prepend(spot);

      target.addEventListener("pointermove", (event) => {
        const rect = target.getBoundingClientRect();
        target.style.setProperty("--mx", `${event.clientX - rect.left}px`);
        target.style.setProperty("--my", `${event.clientY - rect.top}px`);
      }, { passive: true });
    });
}

// Cross-page package preselect via URL hash
function initCrossPagePreselect() {
  // Handle data-truck-package and data-fr-plan attributes
  document.querySelectorAll("[data-truck-package]").forEach((link) => {
    link.addEventListener("click", () => {
      const pkg = link.dataset.truckPackage;
      // Will be handled by the form on the target page
      sessionStorage.setItem("preselect-package", pkg);
    });
  });

  document.querySelectorAll("[data-fr-plan]").forEach((link) => {
    link.addEventListener("click", () => {
      const plan = link.dataset.frPlan;
      sessionStorage.setItem("preselect-package", plan);
    });
  });

  // Check for preselected package on page load
  const preselect = sessionStorage.getItem("preselect-package");
  if (preselect) {
    sessionStorage.removeItem("preselect-package");
    const card = document.querySelector(`[data-package-select="${preselect}"]`);
    if (card) {
      card.click();
      document.querySelector("#commercial-quote, #first-responder-quote, #quote")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }
}

normalizePageState();
window.addEventListener("pageshow", () => {
  document.querySelector("[data-preloader]")?.remove();
  normalizePageState();
});
initPreloader();
initHeader();
initHeadlineAccents();
initShowcases();
initPackages();
initServiceLinks();
initFaq();
initShowcaseVideos();
initQuoteForm();
initCustomCursor();
initReveal();
initGsapAnimations();
initScrollProgress();
initScrollSpy();
initBackToTop();
initScrollCue();
initStickyBar();
initSpotlight();
initCrossPagePreselect();
initRoutePrefetch();
