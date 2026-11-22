BEGIN;

ALTER TABLE public.compras
    ADD COLUMN carrito_id uuid REFERENCES public.carritos (id),
    ALTER COLUMN total_centavos TYPE numeric(30, 0);

CREATE INDEX compras_carrito_fecha_idx ON public.compras (carrito_id, fecha DESC, id DESC);

COMMIT;
