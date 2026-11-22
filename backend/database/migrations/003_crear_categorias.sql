BEGIN;

CREATE TABLE public.categorias (
    id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre text NOT NULL UNIQUE
);

ALTER TABLE public.productos
    ADD COLUMN categoria_id integer REFERENCES public.categorias (id);

CREATE INDEX productos_categoria_idx ON public.productos (categoria_id);

COMMIT;
