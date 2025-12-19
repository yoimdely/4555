const initReveal = () => {
  const elements = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window)) {
    elements.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  elements.forEach((el) => observer.observe(el));
};

const initMobileMenu = () => {
  const toggle = document.querySelector("[data-menu-toggle]");
  const menu = document.querySelector("[data-mobile-menu]");
  if (!toggle || !menu) return;

  toggle.addEventListener("click", () => {
    const isOpen = menu.style.display === "block";
    menu.style.display = isOpen ? "none" : "block";
  });
};

const initForms = () => {
  const forms = document.querySelectorAll(".lead-form");
  forms.forEach((form) => {
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const status = form.querySelector(".form-status");
      const honeypot = form.querySelector("input[name='company']");
      if (honeypot && honeypot.value) {
        form.reset();
        if (status) status.textContent = "Спасибо! Мы получили заявку.";
        return;
      }

      const formData = new FormData(form);
      const payload = Object.fromEntries(formData.entries());
      payload.source = form.dataset.source || "site";

      if (status) status.textContent = "Отправляем заявку...";

      try {
        const response = await fetch("/api/lead", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!response.ok) throw new Error("Request failed");

        form.reset();
        if (status) status.textContent = "Заявка отправлена. Мы свяжемся с вами.";
      } catch (error) {
        if (status) {
          status.textContent =
            "Не удалось отправить. Напишите в WhatsApp или позвоните.";
        }
      }
    });
  });
};

document.addEventListener("DOMContentLoaded", () => {
  initReveal();
  initMobileMenu();
  initForms();
});

