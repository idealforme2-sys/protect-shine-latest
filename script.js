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

  const isMobile = window.matchMedia("(max-width: 820px), (hover: none)").matches;
  const hasVisitedSession = sessionStorage.getItem("ps_has_loaded_session");

  // On mobile or return visits, skip preloader immediately for instant page entry
  if (isMobile || hasVisitedSession) {
    preloader.remove();
    document.body.classList.add("is-loaded");
    updateHeaderState();
    return;
  }

  sessionStorage.setItem("ps_has_loaded_session", "true");

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
    const next = progress + 20;
    updateProgress(Math.min(next, 96));
  }, 40);

  const hide = () => {
    if (hidden) return;
    hidden = true;
    document.body.classList.add("is-loaded");
    updateProgress(100);
    window.clearInterval(timer);
    preloader.classList.add("is-hidden");
    window.setTimeout(() => preloader.remove(), 250);
    updateHeaderState();
  };

  if (document.readyState === "complete" || document.readyState === "interactive") {
    window.setTimeout(hide, 100);
  } else {
    window.addEventListener("DOMContentLoaded", () => window.setTimeout(hide, 100), { once: true });
    window.setTimeout(hide, 1000);
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
    const prefetch = () => ["/commercial-truck-detailing", "/first-responder-detailing"].forEach((href) => {
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
        ".preloader strong",
        ".testimonial-stack small",
        ".footer-brand p",
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
        "[data-service-summary-title]",
        ".car-seat-copy h2",
        ".fr-heading h2"
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

  const isMobile = window.matchMedia("(max-width: 820px), (hover: none)").matches;
  let activePlayingVideo = null;

  const ensureSource = (video) => {
    if (!video.getAttribute("src") && video.dataset.src) {
      video.src = video.dataset.src;
    }
  };

  const playVideo = (video) => {
    ensureSource(video);
    video.muted = true;
    video.playsInline = true;

    // On mobile, only allow a single video to play at any given time to avoid decoder overload
    if (isMobile && activePlayingVideo && activePlayingVideo !== video) {
      activePlayingVideo.pause();
    }

    const p = video.play();
    if (p !== undefined) {
      p.then(() => {
        activePlayingVideo = video;
      }).catch(() => {});
    }
  };

  const pauseVideo = (video) => {
    video.pause();
    if (activePlayingVideo === video) activePlayingVideo = null;
  };

  if (!("IntersectionObserver" in window)) {
    if (videos[0]) playVideo(videos[0]);
    return;
  }

  // Just-in-time source loader: loads source when within 150px of viewport
  const loader = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      ensureSource(entry.target);
      loader.unobserve(entry.target);
    });
  }, { rootMargin: "150px 0px" });

  // Viewport playback observer: plays when clearly visible, pauses immediately when scrolling past
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        playVideo(entry.target);
      } else {
        pauseVideo(entry.target);
      }
    });
  }, { threshold: 0.25 });

  videos.forEach((video) => {
    video.addEventListener("ended", () => playVideo(video));
    video.closest(".showcase-card")?.addEventListener("mouseenter", () => playVideo(video));
    loader.observe(video);
    observer.observe(video);
  });

  document.addEventListener("visibilitychange", () => {
    if (document.hidden && activePlayingVideo) {
      activePlayingVideo.pause();
    }
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
  const serviceCurrent = form.querySelector("[data-service-summary-title]");
  const servicePrice = form.querySelector("[data-service-summary-price]");

  const closeServiceOptions = () => {
    serviceOptions?.setAttribute("hidden", "");
    serviceToggle?.setAttribute("aria-expanded", "false");
  };
  const updateServiceSummary = (card) => {
    if (!card) return;
    const nameEl = card.querySelector(".quote-pkg-name");
    const nameText = nameEl?.textContent.trim() || selectedPkg;
    const priceText = card.querySelector(".quote-pkg-price")?.textContent || "Custom Quote";
    if (serviceCurrent) {
      if (nameEl && nameEl.children.length > 0) {
        serviceCurrent.innerHTML = nameEl.innerHTML;
        serviceCurrent.classList.add("headline-accented");
        serviceCurrent.dataset.headlineAccented = "true";
      } else {
        serviceCurrent.textContent = nameText;
        delete serviceCurrent.dataset.headlineAccented;
        serviceCurrent.classList.remove("headline-accented");
        accentHeadlineElement(serviceCurrent);
      }
    }
    if (servicePrice) servicePrice.textContent = priceText;
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
  const arrowSVG = `<svg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32'><path d='M7 2 7 25 12.6 20.2 16 29 20.6 27 17.2 18.6 25 18.6Z' fill='#14356f' stroke='#fff' stroke-width='2' stroke-linejoin='round'/><path d='M12.5 9.5 13.6 12.5 16.8 12.6 14.3 14.6 15.2 17.6 12.5 15.9 9.9 17.6 10.7 14.6 8.2 12.6 11.4 12.5Z' fill='#ffd34d' stroke='#c9971c' stroke-width='1' stroke-linejoin='round'/></svg>`;

  const badgeSVG = `<svg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32'><path d='M16 2 L27 6 L27 14 C27 21.5 22.4 26.8 16 29.5 C9.6 26.8 5 21.5 5 14 L5 6 Z' fill='#ffd34d' stroke='#14356f' stroke-width='2' stroke-linejoin='round'/><path d='M16 9 17.5 12.9 21.7 13.2 18.5 15.8 19.5 19.9 16 17.6 12.5 19.9 13.5 15.8 10.3 13.2 14.5 12.9Z' fill='#14356f'/></svg>`;

  const cur = (svg, x, y, fb) =>
    `url("data:image/svg+xml,${encodeURIComponent(svg)}") ${x} ${y}, ${fb}`;

  document.documentElement.style.setProperty('--cur-default', cur(arrowSVG, 7, 2, 'auto'));
  document.documentElement.style.setProperty('--cur-pointer', cur(badgeSVG, 16, 16, 'pointer'));

  const siren = document.getElementById('siren');
  if (siren) {
    window.addEventListener('mousemove', (e) => {
      siren.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
    }, { passive: true });
  }
}

function initGsapAnimations() {
  const gsapApi = window.gsap;
  if (!gsapApi || reducedMotion()) return;

  if (window.ScrollTrigger && window.matchMedia("(min-width: 821px)").matches) {
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
  } else {
    gsapApi.set(".hero-content, .hero-badge-card", { clearProps: "transform" });
  }

  window.addEventListener("resize", () => {
    if (window.matchMedia("(max-width: 820px)").matches) {
      gsapApi.set(".hero-content, .hero-badge-card", { clearProps: "transform" });
    }
  }, { passive: true });

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
    ".section-kicker, .section-heading, .lane-panel, .route-step, .route-end, .route-actions, .process-intro, .showcase-card, .package-card, .package-note, .finish-media, .finish-copy, .truck-service-grid article, .finish-actions, .car-seat-copy, .car-seat-details, .fr-heading, .fr-panel, .fr-dispatch, .why-identity, .why-credential, .why-footer, .area-map, .area-copy, .area-tags, .faq-item, .reviews-intro, .quote-copy, .quote-card, .quote-progress, .hero-cred-cards, .faq-heading, .truck-group, .driver-reset-inner, .unit-type-card, .fr-detail-inner, .fr-monthly-inner, .fr-addons-inner, .fr-trust-inner, .fr-conversion-banner, .page-hero-content"
  )).filter((item) => !item.closest(".packages, [data-no-reveal]"));

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

  let ticking = false;
  const sync = () => {
    button.classList.toggle("is-visible", window.scrollY > 600);
  };
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(() => {
      sync();
      ticking = false;
    });
  };
  sync();
  window.addEventListener("scroll", onScroll, { passive: true });

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
    .querySelectorAll(".lane-panel, .package-card, .route-step, .fr-panel, .truck-group, .unit-type-card, .quote-package-card")
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

function initHeroRotators() {
  const rotators = document.querySelectorAll("[data-hero-rotator], [data-hero-rotator-commercial], [data-hero-rotator-fr]");
  rotators.forEach((rotator) => {
    const items = Array.from(rotator.querySelectorAll(".rotator-item"));
    if (items.length <= 1) return;
    let index = 0;

    items.forEach((item, i) => {
      if (i === 0) {
        item.classList.add("is-active");
        item.classList.remove("is-leaving");
      } else {
        item.classList.remove("is-active", "is-leaving");
      }
    });

    setInterval(() => {
      const prevIndex = index;
      index = (index + 1) % items.length;

      items[prevIndex].classList.remove("is-active");
      items[prevIndex].classList.add("is-leaving");

      items[index].classList.remove("is-leaving");
      items[index].classList.add("is-active");
    }, 3500);
  });
}

function initKineticHoverSpotlight() {
  const isMobile = window.matchMedia("(max-width: 768px)").matches;
  if (isMobile) return;
  if (!document.querySelector("[data-kinetic-key], .kinetic-keyword-trigger")) return;

  const UNIT_DATA = {
    "patrol": {
      title: "Patrol + Take-Home Units",
      desc: "High-contact surface sanitation, center console crevice detailing, light stain cleanup, and complete glass clarity for maximum field visibility.",
      tag: "Standard Patrol Units",
      tagClass: "tag-blue",
      image: "./patrol.jpg"
    },
    "k9": {
      title: "K9 Tactical Vehicles",
      desc: "Specialized heavy pet hair removal, odor neutralization, thermal steam extraction on rear kennels, and bio-safe interior surface treatment.",
      tag: "K9 Specialized Care",
      tagClass: "tag-gold",
      image: "./K9.jpg"
    },
    "fire": {
      title: "Fire Personnel Rides",
      desc: "Soot and smoke film removal, heavy soil wash, wheel metal polish, and deep interior upholstery deodorization.",
      tag: "Fire & Rescue Personnel",
      tagClass: "tag-red",
      image: "./firefighter.jpg"
    },
    "ems": {
      title: "EMS Ambulance Units",
      desc: "Medical-grade steam sanitation of high-touch driver cabins, door handles, gear selectors, and dashboard controls.",
      tag: "EMS Cab Sanitation",
      tagClass: "tag-cyan",
      image: "./ambulance.jpg"
    },
    "undercover": {
      title: "Detective + Unmarked",
      desc: "Low-profile, ultra-discreet mobile service. Deep interior upholstery steam clean, stain recovery, and fresh cabin restoration.",
      tag: "Discreet & Unmarked",
      tagClass: "tag-silver",
      image: "./undercover.jpg"
    },
    "personal": {
      title: "Personal Vehicles",
      desc: "First responders get dedicated officer-rate pricing on their personal cars, trucks, and SUVs so off-duty rides stay pristine.",
      tag: "Personal Officer Rates",
      tagClass: "tag-orange",
      image: "./personal.jpg"
    }
  };

  // Create floating card DOM if missing
  let floatingCard = document.querySelector(".kinetic-floating-card");
  if (!floatingCard) {
    floatingCard = document.createElement("div");
    floatingCard.className = "kinetic-floating-card";
    floatingCard.setAttribute("aria-hidden", "true");
    floatingCard.innerHTML = `
      <div class="kinetic-card-media" data-kinetic-media>
        <div class="kinetic-card-badge">
          <span class="kinetic-badge-dot"></span>
          <span>ACTIVE UNIT</span>
        </div>
      </div>
      <div class="kinetic-card-content">
        <span class="kinetic-card-tag" data-kinetic-tag>TAG</span>
        <h4 class="kinetic-card-title" data-kinetic-title>Title</h4>
        <p class="kinetic-card-desc" data-kinetic-desc>Description</p>
      </div>
    `;
    document.body.appendChild(floatingCard);
  }

  const mediaEl = floatingCard.querySelector("[data-kinetic-media]");
  const tagEl = floatingCard.querySelector("[data-kinetic-tag]");
  const titleEl = floatingCard.querySelector("[data-kinetic-title]");
  const descEl = floatingCard.querySelector("[data-kinetic-desc]");

  let targetX = 0;
  let targetY = 0;
  let currentX = 0;
  let currentY = 0;
  let activeUnitKey = null;
  let animationFrameId = null;

  function updateCardPosition() {
    // Smooth lerp physics
    currentX += (targetX - currentX) * 0.15;
    currentY += (targetY - currentY) * 0.15;

    floatingCard.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) scale(${activeUnitKey ? 1 : 0.85})`;

    if (activeUnitKey || Math.abs(targetX - currentX) > 0.5 || Math.abs(targetY - currentY) > 0.5) {
      animationFrameId = requestAnimationFrame(updateCardPosition);
    } else {
      animationFrameId = null;
    }
  }

  function showUnitCard(key, e) {
    const data = UNIT_DATA[key];
    if (!data) return;

    activeUnitKey = key;
    mediaEl.style.backgroundImage = `url('${data.image}')`;
    tagEl.textContent = data.tag;
    tagEl.className = `kinetic-card-tag ${data.tagClass}`;
    titleEl.textContent = data.title;
    descEl.textContent = data.desc;

    targetX = e.clientX + 24;
    targetY = e.clientY + 24;

    // Constrain within viewport bounds
    const cardWidth = 340;
    const cardHeight = 320;
    if (targetX + cardWidth > window.innerWidth - 20) {
      targetX = e.clientX - cardWidth - 20;
    }
    if (targetY + cardHeight > window.innerHeight - 20) {
      targetY = e.clientY - cardHeight - 20;
    }

    if (!animationFrameId) {
      currentX = targetX;
      currentY = targetY;
      animationFrameId = requestAnimationFrame(updateCardPosition);
    }

    floatingCard.classList.add("is-active");
  }

  function hideUnitCard() {
    activeUnitKey = null;
    floatingCard.classList.remove("is-active");
  }

  // Bind unit-card-v2 elements
  document.querySelectorAll(".unit-card-v2[data-kinetic-preview]").forEach((card) => {
    let key = "patrol";
    if (card.classList.contains("unit-k9")) key = "k9";
    else if (card.classList.contains("unit-fire")) key = "fire";
    else if (card.classList.contains("unit-ems")) key = "ems";
    else if (card.classList.contains("unit-undercover")) key = "undercover";
    else if (card.classList.contains("unit-personal")) key = "personal";

    card.addEventListener("mouseenter", (e) => showUnitCard(key, e));
    card.addEventListener("mousemove", (e) => {
      if (!activeUnitKey) return;
      targetX = e.clientX + 24;
      targetY = e.clientY + 24;
      if (targetX + 340 > window.innerWidth - 20) targetX = e.clientX - 360;
      if (targetY + 320 > window.innerHeight - 20) targetY = e.clientY - 340;
      if (!animationFrameId) animationFrameId = requestAnimationFrame(updateCardPosition);
    });
    card.addEventListener("mouseleave", hideUnitCard);
  });

  // Global Keyword triggers excluding header/nav & quote forms
  document.body.addEventListener("mouseover", (e) => {
    // Exclude header, nav, quote forms
    if (e.target.closest("header, nav, .site-header, #quote, .quote-section, #first-responder-quote, #commercial-quote")) {
      return;
    }

    const trigger = e.target.closest("[data-kinetic-key], .kinetic-keyword-trigger");
    if (trigger) {
      const key = trigger.getAttribute("data-kinetic-key") || trigger.dataset.key;
      if (key) showUnitCard(key, e);
    }
  });

  document.body.addEventListener("mousemove", (e) => {
    if (!activeUnitKey) return;
    if (e.target.closest("header, nav, .site-header, #quote, .quote-section, #first-responder-quote, #commercial-quote")) {
      hideUnitCard();
      return;
    }
    targetX = e.clientX + 24;
    targetY = e.clientY + 24;
    if (targetX + 340 > window.innerWidth - 20) targetX = e.clientX - 360;
    if (targetY + 320 > window.innerHeight - 20) targetY = e.clientY - 340;
    if (!animationFrameId) animationFrameId = requestAnimationFrame(updateCardPosition);
  });

  document.body.addEventListener("mouseout", (e) => {
    const trigger = e.target.closest("[data-kinetic-key], .kinetic-keyword-trigger");
    if (trigger && !e.relatedTarget?.closest("[data-kinetic-key], .kinetic-keyword-trigger")) {
      hideUnitCard();
    }
  });
}

normalizePageState();
window.addEventListener("pageshow", (event) => {
  if (!event.persisted) return;
  document.querySelector("[data-preloader]")?.remove();
  normalizePageState();
});
initPreloader();
initHeader();
initHeadlineAccents();
initHeroRotators();
initShowcases();
initPackages();
initServiceLinks();
initFaq();
initShowcaseVideos();
initQuoteForm();
initCustomCursor();
initReveal();
initGsapAnimations();
initKineticHoverSpotlight();
initScrollProgress();
initScrollSpy();
initBackToTop();
initScrollCue();
initStickyBar();
initSpotlight();
initCrossPagePreselect();
initRoutePrefetch();

/* ── 3D INFINITE FLIP CAROUSEL CONTROLLER ────────────────────────── */
function init3DCircularCarousel() {
  const wrapper = document.querySelector('[data-truck-carousel]');
  const stage   = wrapper && wrapper.querySelector('[data-carousel-stage]');
  const prevBtn = wrapper && wrapper.querySelector('[data-carousel-prev]');
  const nextBtn = wrapper && wrapper.querySelector('[data-carousel-next]');
  if (!wrapper || !stage) return;

  const cards = Array.from(stage.querySelectorAll('.truck-panel-v3'));
  const total = cards.length;
  if (total === 0) return;

  let currentIndex = 0; // Starts with Card 01 in front center
  let isAnimating  = false;

  /* Deterministic Relative Position Calculation:
     Calculates every card's slot (-1, 0, 1, hidden) relative to currentIndex from scratch.
     Zero accumulated transforms. Same active index = 100% identical layout state every time. */
  function updateSlots() {
    cards.forEach((card) => {
      const cardIndex = parseInt(card.dataset.cardIndex, 10);
      let rawDiff = cardIndex - currentIndex;
      let diff = ((rawDiff % total) + total) % total;
      if (diff > total / 2) diff -= total;
      if (diff < -total / 2) diff += total;

      // Distance >= 2 hides behind stage so active card always has 1 prev (-1) & 1 next (1)
      if (Math.abs(diff) >= 2) {
        card.setAttribute('data-slot', 'hidden');
      } else {
        card.setAttribute('data-slot', String(diff));
      }
    });
  }

  function navigate(direction) {
    if (isAnimating) return; // Prevent race conditions during CSS transition
    isAnimating = true;

    currentIndex = (currentIndex + direction + total) % total;
    updateSlots();

    // Release animation lock after transition duration (450ms)
    setTimeout(() => {
      isAnimating = false;
    }, 450);
  }

  function jumpTo(targetIndex) {
    if (isAnimating || targetIndex === currentIndex) return;
    isAnimating = true;

    currentIndex = (targetIndex % total + total) % total;
    updateSlots();

    setTimeout(() => {
      isAnimating = false;
    }, 450);
  }

  /* ── Event Handlers ── */
  if (prevBtn) prevBtn.addEventListener('click', (e) => { e.preventDefault(); navigate(-1); });
  if (nextBtn) nextBtn.addEventListener('click', (e) => { e.preventDefault(); navigate(1); });

  // Direct card click to bring into center
  cards.forEach((card) => {
    card.addEventListener('click', (e) => {
      if (e.target.closest('a, button')) return;
      const cardIndex = parseInt(card.dataset.cardIndex, 10);
      jumpTo(cardIndex);
    });
  });

  // Touch / Pointer swipe step flip (NO wheel hijacking)
  let startX = 0;
  let isSwiping = false;

  stage.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
    isSwiping = true;
  }, { passive: true });

  stage.addEventListener('touchend', (e) => {
    if (!isSwiping) return;
    isSwiping = false;
    const endX = e.changedTouches[0].clientX;
    const deltaX = endX - startX;
    if (deltaX < -40) navigate(1);
    else if (deltaX > 40) navigate(-1);
  }, { passive: true });

  stage.addEventListener('mousedown', (e) => {
    startX = e.clientX;
    isSwiping = true;
  });

  window.addEventListener('mouseup', (e) => {
    if (!isSwiping) return;
    isSwiping = false;
    const deltaX = e.clientX - startX;
    if (deltaX < -50) navigate(1);
    else if (deltaX > 50) navigate(-1);
  });

  // Keyboard navigation when stage or page focus
  stage.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); navigate(1); }
    if (e.key === 'ArrowLeft')  { e.preventDefault(); navigate(-1); }
  });

  // Initial slot render from scratch
  updateSlots();
}

init3DCircularCarousel();

/* ── LIGHTWEIGHT 3D MOUSE-TRACKING TILT ENGINE ([data-tilt-card]) ── */
function initTiltCards() {
  if (window.matchMedia('(hover: none) and (pointer: coarse)').matches) return;
  const cards = document.querySelectorAll('[data-tilt-card]');
  if (!cards.length) return;

  const maxTilt = 3.5;
  const scale = 1.015;
  const perspective = 1400;

  cards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateY = ((x - centerX) / centerX) * maxTilt;
      const rotateX = ((y - centerY) / centerY) * -maxTilt;

      card.style.transform = `perspective(${perspective}px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale(${scale})`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = `perspective(${perspective}px) rotateX(0deg) rotateY(0deg) scale(1)`;
    });
  });
}

/* ── REACT BITS CANVAS ELECTRIC BORDER ENGINE (#electricBorderPriority) ── */
function initCanvasElectricBorder() {
  const container = document.getElementById('electricBorderPriority');
  const canvas = document.getElementById('ebCanvasPriority');
  if (!container || !canvas) return;

  // On touch/mobile devices, disable continuous high-frequency 60fps canvas Perlin noise calculations
  if (window.matchMedia('(max-width: 820px), (hover: none) and (pointer: coarse)').matches) {
    canvas.style.display = 'none';
    return;
  }

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const color = '#7df9ff';
  const speed = 0.8;
  const chaos = 0.03;
  const borderRadius = 20;

  const octaves = 5;
  const lacunarity = 1.6;
  const gain = 0.6;
  const amplitude = chaos;
  const frequency = 4;
  const baseFlatness = 0;
  const displacement = 14;
  const borderOffset = 30;

  let time = 0;
  let lastFrameTime = performance.now();

  const random = (x) => (Math.sin(x * 12.9898) * 43758.5453) % 1;

  const noise2D = (x, y) => {
    const i = Math.floor(x);
    const j = Math.floor(y);
    const fx = x - i;
    const fy = y - j;
    const a = random(i + j * 57);
    const b = random(i + 1 + j * 57);
    const c = random(i + (j + 1) * 57);
    const d = random(i + 1 + (j + 1) * 57);
    const ux = fx * fx * (3.0 - 2.0 * fx);
    const uy = fy * fy * (3.0 - 2.0 * fy);
    return a * (1 - ux) * (1 - uy) + b * ux * (1 - uy) + c * (1 - ux) * uy + d * ux * uy;
  };

  const octavedNoise = (x, seed) => {
    let y = 0;
    let amp = amplitude;
    let freq = frequency;
    for (let i = 0; i < octaves; i++) {
      let octaveAmplitude = amp;
      if (i === 0) octaveAmplitude *= baseFlatness;
      y += octaveAmplitude * noise2D(freq * x + seed * 100, time * freq * 0.3);
      freq *= lacunarity;
      amp *= gain;
    }
    return y;
  };

  const getCornerPoint = (centerX, centerY, radius, startAngle, arcLength, progress) => {
    const angle = startAngle + progress * arcLength;
    return {
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle)
    };
  };

  const getRoundedRectPoint = (t, left, top, width, height, radius) => {
    const straightWidth = width - 2 * radius;
    const straightHeight = height - 2 * radius;
    const cornerArc = (Math.PI * radius) / 2;
    const totalPerimeter = 2 * straightWidth + 2 * straightHeight + 4 * cornerArc;
    const distance = t * totalPerimeter;

    let accumulated = 0;
    if (distance <= accumulated + straightWidth) {
      const progress = (distance - accumulated) / straightWidth;
      return { x: left + radius + progress * straightWidth, y: top };
    }
    accumulated += straightWidth;

    if (distance <= accumulated + cornerArc) {
      const progress = (distance - accumulated) / cornerArc;
      return getCornerPoint(left + width - radius, top + radius, radius, -Math.PI / 2, Math.PI / 2, progress);
    }
    accumulated += cornerArc;

    if (distance <= accumulated + straightHeight) {
      const progress = (distance - accumulated) / straightHeight;
      return { x: left + width, y: top + radius + progress * straightHeight };
    }
    accumulated += straightHeight;

    if (distance <= accumulated + cornerArc) {
      const progress = (distance - accumulated) / cornerArc;
      return getCornerPoint(left + width - radius, top + height - radius, radius, 0, Math.PI / 2, progress);
    }
    accumulated += cornerArc;

    if (distance <= accumulated + straightWidth) {
      const progress = (distance - accumulated) / straightWidth;
      return { x: left + width - radius - progress * straightWidth, y: top + height };
    }
    accumulated += straightWidth;

    if (distance <= accumulated + cornerArc) {
      const progress = (distance - accumulated) / cornerArc;
      return getCornerPoint(left + radius, top + height - radius, radius, Math.PI / 2, Math.PI / 2, progress);
    }
    accumulated += cornerArc;

    if (distance <= accumulated + straightHeight) {
      const progress = (distance - accumulated) / straightHeight;
      return { x: left, y: top + height - radius - progress * straightHeight };
    }
    accumulated += straightHeight;

    const progress = (distance - accumulated) / cornerArc;
    return getCornerPoint(left + radius, top + radius, radius, Math.PI, Math.PI / 2, progress);
  };

  const updateSize = () => {
    const rect = container.getBoundingClientRect();
    const width = rect.width + borderOffset * 2;
    const height = rect.height + borderOffset * 2;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.scale(dpr, dpr);

    return { width, height };
  };

  let { width, height } = updateSize();
  let lastDpr = Math.min(window.devicePixelRatio || 1, 2);
  let isVisible = false;
  let rafId = null;

  const draw = (currentTime) => {
    if (!isVisible) {
      rafId = null;
      return;
    }

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    if (dpr !== lastDpr) {
      lastDpr = dpr;
      const newSize = updateSize();
      width = newSize.width;
      height = newSize.height;
    }

    const deltaTime = (currentTime - lastFrameTime) / 1000;
    time += deltaTime * speed;
    lastFrameTime = currentTime;

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.scale(dpr, dpr);

    ctx.strokeStyle = color;
    ctx.lineWidth = 1.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    const left = borderOffset;
    const top = borderOffset;
    const borderWidth = width - 2 * borderOffset;
    const borderHeight = height - 2 * borderOffset;
    const maxRadius = Math.min(borderWidth, borderHeight) / 2;
    const radius = Math.min(borderRadius, maxRadius);

    const approximatePerimeter = 2 * (borderWidth + borderHeight) + 2 * Math.PI * radius;
    const sampleCount = Math.floor(approximatePerimeter / 2);

    ctx.beginPath();

    for (let i = 0; i <= sampleCount; i++) {
      const progress = i / sampleCount;
      const point = getRoundedRectPoint(progress, left, top, borderWidth, borderHeight, radius);

      const xNoise = octavedNoise(progress * 4, 0);
      const yNoise = octavedNoise(progress * 4, 1);

      const displacedX = point.x + xNoise * displacement;
      const displacedY = point.y + yNoise * displacement;

      if (i === 0) {
        ctx.moveTo(displacedX, displacedY);
      } else {
        ctx.lineTo(displacedX, displacedY);
      }
    }

    ctx.closePath();
    ctx.stroke();

    rafId = requestAnimationFrame(draw);
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        isVisible = entry.isIntersecting;
        if (isVisible && !rafId) {
          lastFrameTime = performance.now();
          rafId = requestAnimationFrame(draw);
        } else if (!isVisible && rafId) {
          cancelAnimationFrame(rafId);
          rafId = null;
        }
      });
    },
    { threshold: 0.05 }
  );
  observer.observe(container);

  const resizeObserver = new ResizeObserver(() => {
    const newSize = updateSize();
    width = newSize.width;
    height = newSize.height;
  });
  resizeObserver.observe(container);
}

/* ── EDITORIAL PROOF RAIL GSAP ENTRANCE ── */
function initProofRailAnimation() {
  if (typeof gsap === 'undefined') return;
  const railColumns = document.querySelectorAll('[data-proof-rail] .proof-column');
  if (!railColumns.length) return;

  gsap.from(railColumns, {
    opacity: 0,
    y: 14,
    duration: 0.8,
    stagger: 0.15,
    ease: 'power2.out',
    delay: 0.2
  });
}

/* ── TRUE FOCUS INTERACTIVE WORD FOCUS ENGINE ── */
function initTrueFocusEngine() {
  const titleEl = document.querySelector('[data-true-focus-title]');
  if (titleEl) {
    const text = titleEl.textContent.trim();
    const words = text.split(/\s+/);
    titleEl.innerHTML = '';
    titleEl.className = 'focus-container';

    const isMobileViewport = () => window.innerWidth <= 768;

    const wordEls = words.map((word) => {
      const span = document.createElement('span');
      span.className = 'focus-word';
      const isMob = isMobileViewport();
      span.style.filter = isMob ? 'none' : 'blur(6px)';
      span.style.opacity = isMob ? '0.88' : '0.45';
      span.style.color = '#ffffff';
      span.style.webkitTextFillColor = '#ffffff';
      span.style.transition = 'filter 0.2s ease, opacity 0.2s ease, color 0.15s ease';
      span.textContent = word;
      titleEl.appendChild(span);
      return span;
    });

    const frame = document.createElement('div');
    frame.className = 'focus-frame';
    frame.style.borderColor = '#61b7ff';
    frame.style.glowColor = 'rgba(97, 183, 255, 0.6)';
    frame.style.transition = 'all 0.22s cubic-bezier(0.16, 1, 0.3, 1)';
    frame.innerHTML = `
      <span class="corner top-left"></span>
      <span class="corner top-right"></span>
      <span class="corner bottom-left"></span>
      <span class="corner bottom-right"></span>
    `;
    titleEl.appendChild(frame);

    let currentIndex = 0;
    const updateFocus = (index) => {
      const isMob = isMobileViewport();
      wordEls.forEach((el, idx) => {
        if (idx === index) {
          el.classList.add('active');
          el.style.filter = 'none';
          el.style.opacity = '1';
          el.style.color = isMob ? '#61b7ff' : '#ffffff';
          el.style.webkitTextFillColor = isMob ? '#61b7ff' : '#ffffff';
        } else {
          el.classList.remove('active');
          el.style.filter = isMob ? 'none' : 'blur(6px)';
          el.style.opacity = isMob ? '0.88' : '0.45';
          el.style.color = isMob ? '#ffffff' : 'rgba(255, 255, 255, 0.5)';
          el.style.webkitTextFillColor = isMob ? '#ffffff' : 'rgba(255, 255, 255, 0.5)';
        }
      });

      const parentRect = titleEl.getBoundingClientRect();
      const activeRect = wordEls[index].getBoundingClientRect();

      frame.style.transform = `translate(${activeRect.left - parentRect.left}px, ${activeRect.top - parentRect.top}px)`;
      frame.style.width = `${activeRect.width}px`;
      frame.style.height = `${activeRect.height}px`;
      frame.style.opacity = '1';
    };

    let focusTimer = null;
    const startFocusTimer = () => {
      if (focusTimer) return;
      focusTimer = setInterval(() => {
        currentIndex = (currentIndex + 1) % wordEls.length;
        updateFocus(currentIndex);
      }, 600);
    };
    const stopFocusTimer = () => {
      if (focusTimer) {
        clearInterval(focusTimer);
        focusTimer = null;
      }
    };

    if ('IntersectionObserver' in window) {
      const focusObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              updateFocus(currentIndex);
              startFocusTimer();
            } else {
              stopFocusTimer();
            }
          });
        },
        { threshold: 0.05 }
      );
      focusObserver.observe(titleEl);
    } else {
      updateFocus(0);
      startFocusTimer();
    }

    wordEls.forEach((el, idx) => {
      el.addEventListener('mouseenter', () => {
        currentIndex = idx;
        updateFocus(idx);
      });
    });
  }

  // Interactive focus on Driver Reset Checklist items
  const checklistItems = document.querySelectorAll('[data-focus-word-item]');
  if (checklistItems.length) {
    checklistItems.forEach((item) => {
      const textSpan = item.querySelector('span');
      if (!textSpan) return;

      item.style.cursor = 'pointer';
      item.style.transition = 'all 0.3s ease';

      item.addEventListener('mouseenter', () => {
        checklistItems.forEach((other) => {
          if (other !== item) {
            other.style.opacity = '0.45';
            other.style.filter = 'blur(1.5px)';
          }
        });
        item.style.opacity = '1';
        item.style.filter = 'blur(0px)';
        item.style.transform = 'translateX(4px)';
        textSpan.style.color = '#61b7ff';
      });

      item.addEventListener('mouseleave', () => {
        checklistItems.forEach((other) => {
          other.style.opacity = '1';
          other.style.filter = 'blur(0px)';
          other.style.transform = 'none';
          const span = other.querySelector('span');
          if (span) span.style.color = '';
        });
      });
    });
  }
}

function initPageInteractions() {
  initTiltCards();
  initCanvasElectricBorder();
  initProofRailAnimation();
  initTrueFocusEngine();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initPageInteractions);
} else {
  initPageInteractions();
}
