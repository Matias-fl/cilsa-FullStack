BEGIN;

CREATE TABLE public.carritos (
    id uuid PRIMARY KEY,
    expira_en timestamptz NOT NULL
);

CREATE TABLE public.items_carrito (
    carrito_id uuid NOT NULL REFERENCES public.carritos (id) ON DELETE CASCADE,
    producto_id integer NOT NULL REFERENCES public.productos (id) ON DELETE CASCADE,
    cantidad integer NOT NULL CHECK (cantidad > 0),
    PRIMARY KEY (carrito_id, producto_id)
);

CREATE INDEX items_carrito_producto_idx ON public.items_carrito (producto_id);

COMMIT;
