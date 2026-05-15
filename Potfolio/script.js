/* ─────────────────────────────────────────────
   script.js  –  Portfolio component loader
   ───────────────────────────────────────────── */

/**
 * Fetch an HTML partial, inject it into the container,
 * then re-execute every <script> tag inside it so that
 * inline JS actually runs after injection.
 */
function loadComponent(id, file) {
  fetch(file)
    .then(function (response) {
      if (!response.ok) throw new Error("File not found: " + file);
      return response.text();
    })
    .then(function (html) {
      const container = document.getElementById(id);
      container.innerHTML = html;

      // Re-run every <script> tag inside the injected HTML
      container.querySelectorAll("script").forEach(function (oldScript) {
        const newScript = document.createElement("script");

        // Copy attributes (e.g. src, type)
        Array.from(oldScript.attributes).forEach(function (attr) {
          newScript.setAttribute(attr.name, attr.value);
        });

        // Copy inline script body
        newScript.textContent = oldScript.textContent;

        // Replace in DOM — this triggers execution
        oldScript.parentNode.replaceChild(newScript, oldScript);
      });
    })
    .catch(function (error) {
      console.error("[Portfolio]", error);
    });
}

/* Load all sections */
loadComponent("navbar",   "navbar.html");
loadComponent("hero",     "hero.html");
loadComponent("about",    "about.html");
loadComponent("projects", "projects.html");
loadComponent("contact",  "contact.html");

/* ── CV download (called from hero.html button) ── */
function downloadCV() {
  const link = document.createElement("a");
  link.href = "cv.pdf";
  link.download = "Noushin_Fatema_CV.pdf";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}