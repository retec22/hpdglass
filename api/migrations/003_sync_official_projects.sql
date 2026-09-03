INSERT INTO projects (name, client, location, stage, progress, value_cents, scope, image_url)
SELECT seed.name, seed.client, seed.location, seed.stage, seed.progress, seed.value_cents, seed.scope, seed.image_url
FROM (VALUES
  ('Pardo 200', 'Proyecto corporativo', 'Miraflores - Lima', 'instalacion', 82, 180000000, 'Fachada integral y muro cortina', 'https://www.hpdglass.com/wp-content/uploads/2025/04/Banner-principal-1_11zon.webp'),
  ('Time', 'Proyecto corporativo', 'Lima', 'diseno', 48, 210000000, 'Ingenieria y entrega de planos', 'https://www.hpdglass.com/wp-content/uploads/2025/05/intercontinental1.jpg'),
  ('Centro Empresarial More', 'Proyecto empresarial', 'Lima', 'fabricacion', 64, 270000000, 'Vidrio, aluminio y fachada integral', 'https://www.hpdglass.com/wp-content/uploads/2025/05/pac-1-scaled.jpg'),
  ('Clinica Internacional', 'Proyecto de salud', 'Lima', 'instalacion', 71, 180000000, 'Fachada y cerramientos de alto desempeno', 'https://www.hpdglass.com/wp-content/uploads/2025/04/Banner-principal-1_11zon.webp'),
  ('Centro de Convenciones PUCP', 'Proyecto institucional', 'Lima', 'cerrado', 100, 160000000, 'Fachadas y vidrio arquitectonico', 'https://www.hpdglass.com/wp-content/uploads/2025/05/IMG_0290-min_11zon-scaled.webp')
) AS seed(name, client, location, stage, progress, value_cents, scope, image_url)
WHERE NOT EXISTS (SELECT 1 FROM projects existing WHERE LOWER(existing.name) = LOWER(seed.name));

UPDATE projects SET image_url = 'https://www.hpdglass.com/wp-content/uploads/2025/04/Banner-principal-1_11zon.webp' WHERE LOWER(name) = 'pardo 200' AND (image_url IS NULL OR image_url = '');
UPDATE projects SET image_url = 'https://www.hpdglass.com/wp-content/uploads/2025/05/intercontinental1.jpg' WHERE LOWER(name) = 'time' AND (image_url IS NULL OR image_url = '');
UPDATE projects SET image_url = 'https://www.hpdglass.com/wp-content/uploads/2025/05/pac-1-scaled.jpg' WHERE LOWER(name) = 'centro empresarial more' AND (image_url IS NULL OR image_url = '');
UPDATE projects SET image_url = 'https://www.hpdglass.com/wp-content/uploads/2025/04/Banner-principal-1_11zon.webp' WHERE LOWER(name) = 'clinica internacional' AND (image_url IS NULL OR image_url = '');
UPDATE projects SET image_url = 'https://www.hpdglass.com/wp-content/uploads/2025/05/IMG_0290-min_11zon-scaled.webp' WHERE LOWER(name) = 'centro de convenciones pucp' AND (image_url IS NULL OR image_url = '');
