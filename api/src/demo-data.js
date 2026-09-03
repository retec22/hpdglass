export const demoProjects = [
  {
    id: "demo-1",
    name: "Centro Empresarial More",
    client: "More Inmobiliaria",
    location: "San Isidro, Lima",
    stage: "instalacion",
    progress: 76,
    value_cents: 1850000000,
    scope: "Fachada ventilada, vidrio estructural, puertas y control solar.",
    image_url: "https://res.cloudinary.com/demo/image/upload/v1721746400/hpd/centro-more.jpg",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "demo-2",
    name: "Clínica Internacional",
    client: "Grupo Clínicas",
    location: "Surco, Lima",
    stage: "fabricacion",
    progress: 62,
    value_cents: 1350000000,
    scope: "Muro cortina, fachadas de vidrio, accesos y acabados técnicos.",
    image_url: "https://res.cloudinary.com/demo/image/upload/v1721746400/hpd/clinica-internacional.jpg",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "demo-3",
    name: "Pardo 200",
    client: "Pardo 200",
    location: "Miraflores, Lima",
    stage: "diseno",
    progress: 48,
    value_cents: 960000000,
    scope: "Diseño de fachada, metales y vidrio laminado para torre corporativa.",
    image_url: "https://res.cloudinary.com/demo/image/upload/v1721746400/hpd/pardo-200.jpg",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "demo-4",
    name: "Time Plaza",
    client: "Time Realty",
    location: "San Miguel, Lima",
    stage: "preventa",
    progress: 29,
    value_cents: 720000000,
    scope: "Propuesta arquitectónica, vidrio low-e y envolvente de fachada.",
    image_url: "https://res.cloudinary.com/demo/image/upload/v1721746400/hpd/time-plaza.jpg",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

export function buildDashboardSummary(projects = demoProjects) {
  const resolvedProjects = Array.isArray(projects) ? projects : [];
  const active = resolvedProjects.filter((project) => project.stage !== "cerrado").length;
  const execution = resolvedProjects.filter((project) => ["fabricacion", "instalacion"].includes(project.stage)).length;
  const totalValue = resolvedProjects.reduce((sum, project) => sum + Number(project.value_cents || 0), 0);
  const progress = resolvedProjects.length ? Math.round(resolvedProjects.reduce((sum, project) => sum + Number(project.progress || 0), 0) / resolvedProjects.length) : 0;

  return {
    projects: resolvedProjects,
    metrics: {
      active,
      execution,
      value: totalValue,
      progress
    },
    totals: {
      active,
      execution,
      value_formatted: new Intl.NumberFormat("es-PE", { style: "currency", currency: "PEN", maximumFractionDigits: 0 }).format(totalValue / 100),
      progress
    }
  };
}
