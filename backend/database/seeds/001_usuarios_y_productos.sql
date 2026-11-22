BEGIN;

INSERT INTO public.usuarios (nombre, email)
VALUES
    ('Lucía Álvarez', 'lucia.alvarez@example.com'),
    ('Diego Ramos', 'diego.ramos@example.com'),
    ('Sofía Medina', 'sofia.medina@example.com')
ON CONFLICT (email) DO NOTHING;

INSERT INTO public.productos (codigo, vendedor_id, nombre, descripcion, precio_centavos, stock)
SELECT datos.codigo, usuarios.id, datos.nombre, datos.descripcion, datos.precio, datos.stock
FROM (
    VALUES
        ('TEC-001', 'lucia.alvarez@example.com', 'Teclado compacto', 'Teclado USB con distribución en español.', 3499900, 12),
        ('TEC-002', 'lucia.alvarez@example.com', 'Mouse inalámbrico', 'Mouse óptico con receptor USB.', 1599000, 20),
        ('HOG-001', 'diego.ramos@example.com', 'Lámpara de escritorio', 'Lámpara LED con brazo regulable.', 2490000, 8),
        ('HOG-002', 'diego.ramos@example.com', 'Organizador de escritorio', 'Organizador con cuatro compartimentos.', 1150000, 14),
        ('ACC-001', 'sofia.medina@example.com', 'Mochila urbana', 'Mochila de 20 litros con bolsillo para notebook.', 5290000, 6),
        ('ACC-002', 'sofia.medina@example.com', 'Botella térmica', 'Botella de acero inoxidable de 500 ml.', 1895000, 16)
) AS datos (codigo, email, nombre, descripcion, precio, stock)
JOIN public.usuarios ON usuarios.email = datos.email
ON CONFLICT (codigo) DO NOTHING;

COMMIT;
