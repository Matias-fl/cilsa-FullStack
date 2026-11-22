BEGIN;

WITH familias (email, prefijo, familia, nombre, precio_base, fondo, texto) AS (
    VALUES
        ('lucia.alvarez@example.com', 'TEC', 1, 'Teclado', 3499900, 'dbeafe', '1e3a8a'),
        ('lucia.alvarez@example.com', 'TEC', 2, 'Mouse', 1599000, 'dbeafe', '1e3a8a'),
        ('lucia.alvarez@example.com', 'TEC', 3, 'Auriculares', 2190000, 'dbeafe', '1e3a8a'),
        ('lucia.alvarez@example.com', 'TEC', 4, 'Webcam', 2850000, 'dbeafe', '1e3a8a'),
        ('lucia.alvarez@example.com', 'TEC', 5, 'Micrófono', 3250000, 'dbeafe', '1e3a8a'),
        ('lucia.alvarez@example.com', 'TEC', 6, 'Cargador', 1250000, 'dbeafe', '1e3a8a'),
        ('lucia.alvarez@example.com', 'TEC', 7, 'Parlante', 1990000, 'dbeafe', '1e3a8a'),
        ('lucia.alvarez@example.com', 'TEC', 8, 'Adaptador USB', 980000, 'dbeafe', '1e3a8a'),
        ('lucia.alvarez@example.com', 'TEC', 9, 'Soporte para notebook', 2450000, 'dbeafe', '1e3a8a'),
        ('lucia.alvarez@example.com', 'TEC', 10, 'Hub USB', 1890000, 'dbeafe', '1e3a8a'),
        ('diego.ramos@example.com', 'HOG', 1, 'Lámpara', 3499900, 'dcfce7', '14532d'),
        ('diego.ramos@example.com', 'HOG', 2, 'Organizador', 1599000, 'dcfce7', '14532d'),
        ('diego.ramos@example.com', 'HOG', 3, 'Estante', 2190000, 'dcfce7', '14532d'),
        ('diego.ramos@example.com', 'HOG', 4, 'Reloj de pared', 2850000, 'dcfce7', '14532d'),
        ('diego.ramos@example.com', 'HOG', 5, 'Almohadón', 3250000, 'dcfce7', '14532d'),
        ('diego.ramos@example.com', 'HOG', 6, 'Maceta', 1250000, 'dcfce7', '14532d'),
        ('diego.ramos@example.com', 'HOG', 7, 'Bandeja', 1990000, 'dcfce7', '14532d'),
        ('diego.ramos@example.com', 'HOG', 8, 'Canasto', 980000, 'dcfce7', '14532d'),
        ('diego.ramos@example.com', 'HOG', 9, 'Perchero', 2450000, 'dcfce7', '14532d'),
        ('diego.ramos@example.com', 'HOG', 10, 'Portarretrato', 1890000, 'dcfce7', '14532d'),
        ('sofia.medina@example.com', 'ACC', 1, 'Mochila', 3499900, 'fae8ff', '701a75'),
        ('sofia.medina@example.com', 'ACC', 2, 'Botella térmica', 1599000, 'fae8ff', '701a75'),
        ('sofia.medina@example.com', 'ACC', 3, 'Bolso', 2190000, 'fae8ff', '701a75'),
        ('sofia.medina@example.com', 'ACC', 4, 'Riñonera', 2850000, 'fae8ff', '701a75'),
        ('sofia.medina@example.com', 'ACC', 5, 'Cartuchera', 3250000, 'fae8ff', '701a75'),
        ('sofia.medina@example.com', 'ACC', 6, 'Neceser', 1250000, 'fae8ff', '701a75'),
        ('sofia.medina@example.com', 'ACC', 7, 'Gorra', 1990000, 'fae8ff', '701a75'),
        ('sofia.medina@example.com', 'ACC', 8, 'Billetera', 980000, 'fae8ff', '701a75'),
        ('sofia.medina@example.com', 'ACC', 9, 'Lonchera', 2450000, 'fae8ff', '701a75'),
        ('sofia.medina@example.com', 'ACC', 10, 'Estuche', 1890000, 'fae8ff', '701a75')
), catalogo AS (
    SELECT email,
           prefijo || '-DEMO-' || lpad(numero::text, 3, '0') AS codigo,
           nombre || ' · Serie ' || lpad(serie::text, 2, '0') AS nombre,
           'Producto de muestra de la serie ' || serie || '.' AS descripcion,
           precio_base + (serie - 1) * 7500 AS precio_centavos,
           3 + (numero * 7 + familia) % 48 AS stock,
           fondo,
           texto
    FROM familias
    CROSS JOIN generate_series(1, 30) AS series(serie)
    CROSS JOIN LATERAL (VALUES ((familia - 1) * 30 + serie)) AS codigos(numero)
    WHERE numero <= 298
)
INSERT INTO public.productos
    (codigo, vendedor_id, nombre, descripcion, precio_centavos, stock, imagen_url)
SELECT catalogo.codigo, usuarios.id, catalogo.nombre, catalogo.descripcion,
       catalogo.precio_centavos, catalogo.stock,
       'https://placehold.co/640x480/' || fondo || '/' || texto || '.png?text=' || catalogo.codigo
FROM catalogo
JOIN public.usuarios ON usuarios.email = catalogo.email
ON CONFLICT (codigo) DO NOTHING;

UPDATE public.productos
SET imagen_url = 'https://placehold.co/640x480/e2e8f0/0f172a.png?text=' || codigo
WHERE imagen_url IS NULL
  AND codigo IN ('TEC-001', 'TEC-002', 'HOG-001', 'HOG-002', 'ACC-001', 'ACC-002');

COMMIT;
