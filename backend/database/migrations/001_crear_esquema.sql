BEGIN;

CREATE TABLE public.usuarios (
    id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre text NOT NULL,
    email text NOT NULL UNIQUE
);

CREATE TABLE public.productos (
    id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    codigo text NOT NULL UNIQUE,
    vendedor_id integer NOT NULL REFERENCES public.usuarios (id),
    nombre text NOT NULL,
    descripcion text NOT NULL,
    precio_centavos integer NOT NULL CHECK (precio_centavos >= 0),
    stock integer NOT NULL CHECK (stock >= 0)
);

CREATE INDEX productos_vendedor_idx ON public.productos (vendedor_id);

CREATE TABLE public.compras (
    id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    fecha timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
    total_centavos integer NOT NULL CHECK (total_centavos >= 0)
);

CREATE TABLE public.detalles_compra (
    compra_id integer NOT NULL REFERENCES public.compras (id),
    producto_id integer NOT NULL REFERENCES public.productos (id),
    cantidad integer NOT NULL CHECK (cantidad > 0),
    precio_unitario_centavos integer NOT NULL CHECK (precio_unitario_centavos >= 0),
    PRIMARY KEY (compra_id, producto_id)
);

COMMIT;
