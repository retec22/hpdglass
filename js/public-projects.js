document.addEventListener("DOMContentLoaded", async () => {
  const grid = document.querySelector(".grid.grid-3");
  if (!grid) return;

  try {
    const response = await fetch("/api/projects", { cache: "no-store" });
    if (!response.ok) return;
    const payload = await response.json();
    const projects = Array.isArray(payload.projects) ? payload.projects : [];
    projects.forEach((project) => {
      const card = document.createElement("a");
      card.className = "card product-card reveal dynamic-project-card";
      card.dataset.projectCategory = "all";
      card.href = "/contacto/";
      const image = project.image_url || "/assets/images/proyectos/project-placeholder.svg";
      const stage = { preventa: "Preventa", diseno: "Diseño", fabricacion: "Fabricación", instalacion: "Instalación", cerrado: "Cerrado" }[project.stage] || "Proyecto HPD";
      card.innerHTML = `<div class="visual"><img src="${image.replace(/"/g, "&quot;")}" alt="${String(project.name || "Proyecto HPD").replace(/"/g, "&quot;")}" loading="lazy"></div><div class="body"><span class="tag">${stage}</span><h3>${project.name || "Proyecto HPD"}</h3><p>${project.scope || "Proyecto HPD de vidrio, aluminio y fachadas."}</p><span class="card-link">Solicitar información <span>↗</span></span></div>`;
      grid.prepend(card);
    });
  } catch {
    // The static portfolio remains available when the API is offline.
  }
});