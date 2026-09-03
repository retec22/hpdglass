const form = document.querySelector("#account-form");
const message = document.querySelector("#account-message");
const fields = document.querySelector("#register-fields");
const title = document.querySelector("#account-title");
const submit = document.querySelector("#account-submit");
const apiBase = location.hostname === "127.0.0.1" || location.hostname === "localhost" ? "http://127.0.0.1:8080" : "";
let mode = new URLSearchParams(location.search).get("mode") === "register" ? "register" : "login";

const setMode = nextMode => {
  mode = nextMode;
  document.querySelectorAll("[data-mode]").forEach(tab => tab.classList.toggle("active", tab.dataset.mode === mode));
  fields.classList.toggle("hidden", mode === "login");
  title.textContent = mode === "login" ? "Ingresa a tu cuenta" : "Crea tu cuenta HPD";
  submit.textContent = mode === "login" ? "Ingresar" : "Registrarme";
};

document.querySelectorAll("[data-mode]").forEach(button => {
  button.type = "button";
  button.addEventListener("click", () => setMode(button.dataset.mode));
});

form.addEventListener("submit", async event => {
  event.preventDefault();
  message.textContent = "";
  const data = Object.fromEntries(new FormData(form));
  try {
    const response = await fetch(`${apiBase}/api/auth/${mode}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    const payload = await response.json();
    if (!response.ok) throw new Error(payload.error || "No se pudo completar la operación");
    localStorage.setItem("hpd.auth.token", payload.token);
    localStorage.setItem("hpd.auth.user", JSON.stringify(payload.user));
    location.href = payload.user.role === "admin" ? "../dashboard/" : "./portal.html";
  } catch (error) {
    message.textContent = error.message === "Failed to fetch" ? "No se pudo conectar con el servidor." : error.message;
  }
});

setMode(mode);
