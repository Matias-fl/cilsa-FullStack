BEGIN;

ALTER TABLE public.usuarios
    ADD COLUMN password_hash text,
    ADD COLUMN imagen_url text;

CREATE UNIQUE INDEX usuarios_email_normalizado_uidx
    ON public.usuarios (lower(email));

COMMIT;
