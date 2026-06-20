/* ─────────────────────────────────────────────
   Portfolio Component Loader
   ───────────────────────────────────────────── */

function loadComponent(id, file) {
  fetch(file)
    .then(function (response) {
      if (!response.ok) throw new Error("File not found: " + file);
      return response.text();
    })
    .then(function (html) {
      const container = document.getElementById(id);

      if (!container) {
        console.error("Container not found: " + id);
        return;
      }

      container.innerHTML = html;

      // Re-run scripts inside injected HTML
      container.querySelectorAll("script").forEach(function (oldScript) {
        const newScript = document.createElement("script");

        Array.from(oldScript.attributes).forEach(function (attr) {
          newScript.setAttribute(attr.name, attr.value);
        });

        newScript.textContent = oldScript.textContent;
        oldScript.parentNode.replaceChild(newScript, oldScript);
      });
    })
    .catch(function (error) {
      console.error("[Portfolio]", error);
    });
}

/* Load sections */
loadComponent("navbar", "navbar.html");
loadComponent("hero", "hero.html");
loadComponent("about", "about.html");
loadComponent("projects", "projects.html");
loadComponent("contact", "contact.html");

/* ─────────────────────────────────────────────
   CV Download
   ───────────────────────────────────────────── */

function downloadCV() {
  const link = document.createElement("a");
  link.href = "cv.pdf";
  link.download = "Noushin_Fatema_CV.pdf";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/* ─────────────────────────────────────────────
   Smooth scroll to contact
   ───────────────────────────────────────────── */

document.addEventListener("click", function (e) {
  const contactBtn = e.target.closest("#btn-contact");

  if (contactBtn) {
    e.preventDefault();

    const contactSection = document.getElementById("contact");

    if (contactSection) {
      contactSection.scrollIntoView({
        behavior: "smooth"
      });
    }
  }
});

/* ─────────────────────────────────────────────
   EmailJS CONFIG
   ───────────────────────────────────────────── */

//  REPLACE THESE VALUES
const EMAILJS_PUBLIC_KEY = "l7ti2pk6cZraQPI15";
const EMAILJS_SERVICE_ID = "service_wgmyi9o";
const EMAILJS_TEMPLATE_ID = "template_ef022wx";

/* Initialize EmailJS */
document.addEventListener("DOMContentLoaded", function () {
  if (typeof emailjs !== "undefined") {
    emailjs.init({
      publicKey: EMAILJS_PUBLIC_KEY,
    });
  } else {
    console.error("EmailJS is not loaded. Add CDN in index.html");
  }
});

/* ─────────────────────────────────────────────
   Contact Form Submit Handler
   ───────────────────────────────────────────── */

document.addEventListener("submit", function (e) {
  if (e.target.id !== "contact-form") return;

  e.preventDefault();

  const form = e.target;

  const firstName = document.getElementById("first_name").value.trim();
  const lastName = document.getElementById("last_name").value.trim();
  const email = document.getElementById("user_email").value.trim();
  const subject = document.getElementById("subject").value.trim();
  const message = document.getElementById("message").value.trim();
  const formMessage = document.getElementById("form-message");

  const fullName = `${firstName} ${lastName}`;

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  formMessage.classList.remove("hidden", "text-red-400", "text-green-400");

  /* Validation */
  if (!firstName || !lastName || !email || !subject || !message) {
    formMessage.textContent = "Please fill in all fields.";
    formMessage.classList.add("text-red-400");
    return;
  }

  if (!emailPattern.test(email)) {
    formMessage.textContent = "Please enter a valid email address.";
    formMessage.classList.add("text-red-400");
    return;
  }

  if (typeof emailjs === "undefined") {
    formMessage.textContent = "Email service not loaded.";
    formMessage.classList.add("text-red-400");
    return;
  }

  formMessage.textContent = "Sending message...";
  formMessage.classList.add("text-green-400");

  /* Ensure hidden from_name exists */
  let hiddenName = document.getElementById("from_name");
  if (!hiddenName) {
    hiddenName = document.createElement("input");
    hiddenName.type = "hidden";
    hiddenName.name = "from_name";
    hiddenName.id = "from_name";
    form.appendChild(hiddenName);
  }
  hiddenName.value = fullName;

  /* Send Email */
  emailjs.sendForm(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, form)
    .then(function () {
      formMessage.textContent = "Message sent successfully!";
      formMessage.classList.remove("text-red-400");
      formMessage.classList.add("text-green-400");
      form.reset();
    })
    .catch(function (error) {
      console.error("EmailJS Error:", error);
      formMessage.textContent = "Failed to send message. Try again.";
      formMessage.classList.remove("text-green-400");
      formMessage.classList.add("text-red-400");
    });
});