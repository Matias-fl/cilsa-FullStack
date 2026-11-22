BEGIN;

INSERT INTO public.categorias (nombre)
VALUES ('Tecnología'), ('Hogar'), ('Accesorios')
ON CONFLICT (nombre) DO NOTHING;

UPDATE public.productos AS producto
SET categoria_id = categoria.id
FROM public.categorias AS categoria
JOIN (VALUES
    ('TEC', 'Tecnología'),
    ('HOG', 'Hogar'),
    ('ACC', 'Accesorios')
) AS categorias_demo (prefijo, nombre)
    ON categoria.nombre = categorias_demo.nombre
WHERE producto.categoria_id IS NULL
  AND producto.codigo ~ ('^' || categorias_demo.prefijo || '-(00[12]|DEMO-[0-9]{3})$');

COMMIT;
