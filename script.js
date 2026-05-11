const bookingForm = document.getElementById("bookingForm");
const formStatus = document.getElementById("formStatus");
const whatsAppFallback = document.getElementById("whatsAppFallback");
const packageHint = document.getElementById("packageHint");
const estimateHint = document.getElementById("estimateHint");
const mobileMenuToggle = document.getElementById("mobileMenuToggle");
const mainNav = document.getElementById("mainNav");
const menuBackdrop = document.getElementById("menuBackdrop");
const chatToggle = document.getElementById("chatToggle");
const chatWindow = document.getElementById("chatWindow");
const chatClose = document.getElementById("chatClose");
const chatMessages = document.getElementById("chatMessages");
const chatForm = document.getElementById("chatForm");
const chatInput = document.getElementById("chatInput");

/* ── Page loader ─────────────────────────── */
const pageLoader = document.getElementById("pageLoader");

window.addEventListener("load", () => {
  if (pageLoader) {
    pageLoader.classList.add("hidden");
  }
});

/* ── Scroll progress bar ─────────────────── */
const scrollBar = document.getElementById("scrollProgress");

function updateScrollProgress() {
  if (!scrollBar) return;
  const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
  const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
  scrollBar.style.width = progress + "%";
  scrollBar.setAttribute("aria-valuenow", Math.round(progress));
}

document.addEventListener("scroll", updateScrollProgress, { passive: true });

function setMobileMenuState(isOpen) {
  if (!mobileMenuToggle || !mainNav) return;
  mobileMenuToggle.classList.toggle("is-open", isOpen);
  mainNav.classList.toggle("is-open", isOpen);
  mobileMenuToggle.setAttribute("aria-expanded", String(isOpen));

  if (menuBackdrop) {
    menuBackdrop.classList.toggle("is-visible", isOpen);
    menuBackdrop.setAttribute("aria-hidden", String(!isOpen));
  }

  document.body.classList.toggle("menu-open", isOpen);
}

if (mobileMenuToggle && mainNav) {
  mobileMenuToggle.addEventListener("click", () => {
    const isOpen = mainNav.classList.contains("is-open");
    setMobileMenuState(!isOpen);
  });

  mainNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => setMobileMenuState(false));
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 980) {
      setMobileMenuState(false);
    }
  });
}

if (menuBackdrop) {
  menuBackdrop.addEventListener("click", () => setMobileMenuState(false));
}

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    setMobileMenuState(false);
    setChatState(false);
  }
});

function setChatState(isOpen) {
  if (!chatToggle || !chatWindow) return;
  chatToggle.setAttribute("aria-expanded", String(isOpen));
  chatWindow.classList.toggle("is-open", isOpen);
  chatWindow.setAttribute("aria-hidden", String(!isOpen));
}

function addChatMessage(role, text, actions = []) {
  if (!chatMessages) return;

  const item = document.createElement("div");
  item.className = `chat-msg ${role}`;
  item.textContent = text;

  if (actions.length > 0) {
    const actionWrap = document.createElement("div");
    actionWrap.className = "chat-actions";

    actions.forEach((action) => {
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = action.label;
      button.dataset.action = action.key;
      actionWrap.appendChild(button);
    });

    item.appendChild(actionWrap);
  }

  chatMessages.appendChild(item);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function matchFaq(question) {
  const q = question.toLowerCase();

  if (q.includes("price") || q.includes("cost") || q.includes("budget")) {
    return {
      answer: "Packages start from R85, R135, and R195 per guest depending on your event style and guest count.",
      actions: [
        { label: "View Pricing", key: "pricing" },
        { label: "Get Quote", key: "book" }
      ]
    };
  }

  if (q.includes("menu") || q.includes("food") || q.includes("dessert")) {
    return {
      answer: "We offer finger foods, mains, dessert tables, drinks, and custom event menus tailored to your occasion.",
      actions: [
        { label: "See Menu Section", key: "menu" },
        { label: "Book Consultation", key: "book" }
      ]
    };
  }

  if (q.includes("book") || q.includes("booking") || q.includes("reserve")) {
    return {
      answer: "The fastest way to secure your date is by using the booking form. You can also continue on WhatsApp after submitting.",
      actions: [
        { label: "Open Booking Form", key: "book" },
        { label: "WhatsApp Now", key: "whatsapp" }
      ]
    };
  }

  if (q.includes("corporate") || q.includes("office") || q.includes("conference")) {
    return {
      answer: "Yes, corporate catering is available for office meetings, launches, and conferences with polished setup and punctual service.",
      actions: [
        { label: "Corporate Package", key: "pricing" },
        { label: "Book Consultation", key: "book" }
      ]
    };
  }

  if (q.includes("where") || q.includes("location") || q.includes("area")) {
    return {
      answer: "Nesi88 Cooking is based in Birch Acres and serves surrounding areas for private and corporate events.",
      actions: [
        { label: "Book Your Area", key: "book" }
      ]
    };
  }

  return {
    answer: "I can help with pricing, menu options, event types, and booking. Ask one of those, or click below to book now.",
    actions: [
      { label: "Start Booking", key: "book" },
      { label: "Chat on WhatsApp", key: "whatsapp" }
    ]
  };
}

function runChatAction(actionKey) {
  if (actionKey === "book") {
    document.getElementById("book")?.scrollIntoView({ behavior: "smooth" });
    setChatState(false);
    return;
  }

  if (actionKey === "pricing") {
    document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" });
    setChatState(false);
    return;
  }

  if (actionKey === "menu") {
    document.querySelector(".top-menu")?.scrollIntoView({ behavior: "smooth" });
    setChatState(false);
    return;
  }

  if (actionKey === "whatsapp") {
    window.open("https://wa.me/27796797381", "_blank", "noopener");
  }
}

if (chatToggle && chatWindow && chatMessages) {
  chatToggle.addEventListener("click", () => {
    const isOpen = chatWindow.classList.contains("is-open");
    setChatState(!isOpen);

    if (!isOpen && chatMessages.children.length === 0) {
      addChatMessage("bot", "Hi, I am your Nesi88 AI assistant. Ask me about pricing, menu options, corporate events, or booking.", [
        { label: "Get Quote", key: "book" },
        { label: "See Pricing", key: "pricing" }
      ]);
    }
  });

  chatClose?.addEventListener("click", () => setChatState(false));

  chatWindow.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    if (target.matches("button[data-action]")) {
      runChatAction(target.dataset.action || "");
    }
  });

  document.querySelectorAll(".chat-quick-actions button").forEach((button) => {
    button.addEventListener("click", () => {
      const question = button.getAttribute("data-question") || "";
      addChatMessage("user", question);
      const result = matchFaq(question);
      addChatMessage("bot", result.answer, result.actions);
    });
  });

  chatForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    const question = (chatInput?.value || "").trim();
    if (question.length === 0) return;

    addChatMessage("user", question);
    const result = matchFaq(question);
    addChatMessage("bot", result.answer, result.actions);

    if (chatInput) {
      chatInput.value = "";
    }
  });
}

const businessNumber = "27796797381";
const packageRates = {
  starter: 85,
  celebration: 135,
  premium: 195
};

const packageRules = {
  Wedding: "premium",
  Birthday: "celebration",
  "Corporate Event": "celebration",
  "Funeral/Cultural Gathering": "starter",
  "Private Function": "celebration",
  Other: "starter"
};

function cleanValue(value) {
  return String(value || "").trim();
}

function buildMessage(formData) {
  const details = {
    name: cleanValue(formData.get("name")),
    phone: cleanValue(formData.get("phone")),
    email: cleanValue(formData.get("email")),
    eventDate: cleanValue(formData.get("eventDate")),
    eventType: cleanValue(formData.get("eventType")),
    guests: cleanValue(formData.get("guests")),
    location: cleanValue(formData.get("location")),
    budget: cleanValue(formData.get("budget")),
    message: cleanValue(formData.get("message"))
  };

  return [
    "Hello Nesi88 Cooking, I would like to book catering.",
    "",
    `Name: ${details.name}`,
    `Phone: ${details.phone}`,
    `Email: ${details.email || "Not provided"}`,
    `Event Date: ${details.eventDate}`,
    `Event Type: ${details.eventType}`,
    `Guests: ${details.guests}`,
    `Location: ${details.location}`,
    `Budget: ${details.budget || "Not specified"}`,
    `Menu Notes: ${details.message || "No extra notes"}`
  ].join("\n");
}

function validateForm(formData) {
  const requiredFields = ["name", "phone", "eventDate", "eventType", "guests", "location"];
  return requiredFields.every((field) => cleanValue(formData.get(field)).length > 0);
}

function packageName(key) {
  if (key === "premium") return "Premium Event Table";
  if (key === "celebration") return "Celebration Feast";
  return "Starter Spread";
}

function updateSmartQuote() {
  if (!bookingForm || !packageHint || !estimateHint) {
    return;
  }

  const eventType = cleanValue(bookingForm.elements.eventType?.value);
  const guestCount = Number(cleanValue(bookingForm.elements.guests?.value));
  const selectedPackage = packageRules[eventType] || "";

  if (!selectedPackage) {
    packageHint.textContent = "Select an event type to see a recommended package.";
    estimateHint.textContent = "Estimated total will appear after selecting package and guest count.";
    return;
  }

  const rate = packageRates[selectedPackage];
  packageHint.textContent = `Recommended package: ${packageName(selectedPackage)} (from R${rate} per guest).`;

  if (!Number.isFinite(guestCount) || guestCount < 10) {
    estimateHint.textContent = "Enter at least 10 guests to calculate an estimate.";
    return;
  }

  const estimatedTotal = rate * guestCount;
  estimateHint.textContent = `Estimated total: R${estimatedTotal.toLocaleString("en-ZA")} for ${guestCount} guests.`;
}

if (bookingForm) {
  bookingForm.elements.eventType?.addEventListener("change", updateSmartQuote);
  bookingForm.elements.guests?.addEventListener("input", updateSmartQuote);
  updateSmartQuote();

  bookingForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(bookingForm);
    if (!validateForm(formData)) {
      formStatus.textContent = "Please complete all required fields before sending.";
      formStatus.style.color = "#b42318";
      return;
    }

    if (cleanValue(formData.get("website")).length > 0) {
      formStatus.textContent = "Unable to send request. Please try again.";
      formStatus.style.color = "#b42318";
      return;
    }

    const message = buildMessage(formData);
    const encoded = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${businessNumber}?text=${encoded}`;

    whatsAppFallback.setAttribute("href", whatsappUrl);
    formStatus.textContent = "Sending your booking request...";
    formStatus.style.color = "#334155";

    try {
      const response = await fetch(bookingForm.action, {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json"
        }
      });

      if (!response.ok) {
        throw new Error("Request failed");
      }

      const result = await response.json();
      if (!result.success) {
        throw new Error("Server rejected request");
      }

      formStatus.textContent = "Booking request sent successfully. You can also continue on WhatsApp for faster confirmation.";
      formStatus.style.color = "#166534";

      if (confirm("Your request was sent. Open WhatsApp now for faster confirmation?")) {
        window.open(whatsappUrl, "_blank", "noopener");
      }

      bookingForm.reset();
    } catch (error) {
      const mailBody = encodeURIComponent(message);
      const mailToUrl = `mailto:nesi88cooking@gmail.com?subject=Catering Booking Request&body=${mailBody}`;
      formStatus.textContent = "We could not send through the server right now. Please use WhatsApp or your email app.";
      formStatus.style.color = "#b42318";

      setTimeout(() => {
        if (confirm("Would you like to open your email app with this booking request?")) {
          window.location.href = mailToUrl;
        }
      }, 500);
    }
  });
}

const revealSections = document.querySelectorAll(".section-reveal");

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
    {
      threshold: 0.2
    }
  );

  revealSections.forEach((section) => observer.observe(section));
} else {
  revealSections.forEach((section) => section.classList.add("visible"));
}
