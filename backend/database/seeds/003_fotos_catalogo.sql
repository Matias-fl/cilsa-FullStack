BEGIN;

-- Las series ficticias de una familia comparten una foto de referencia.
-- Cada ficha de Wikimedia Commons incluye los créditos y la licencia.
WITH fotos (prefijo, familia, url) AS (
    VALUES
        -- Teclado · https://commons.wikimedia.org/wiki/File%3AKeyboard_photo.jpg
        ('TEC', 1, 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fd/Keyboard_photo.jpg/500px-Keyboard_photo.jpg'),
        -- Mouse · User:Mattym129 · https://commons.wikimedia.org/wiki/File%3ALogitech-mouse.JPG
        ('TEC', 2, 'https://thumb.wikimedia.org/wikipedia/commons/thumb/2/2e/Logitech-mouse.JPG/330px-Logitech-mouse.JPG'),
        -- Auriculares · Atorero (Alexander Kozlov) · https://commons.wikimedia.org/wiki/File%3AHeadphones.jpg
        ('TEC', 3, 'https://thumb.wikimedia.org/wikipedia/commons/thumb/8/8b/Headphones.jpg/500px-Headphones.jpg'),
        -- Webcam · Pmwiki1 · https://commons.wikimedia.org/wiki/File%3AWebcam_01.jpg
        ('TEC', 4, 'https://thumb.wikimedia.org/wikipedia/commons/thumb/5/55/Webcam_01.jpg/330px-Webcam_01.jpg'),
        -- Micrófono · Evan-Amos · https://commons.wikimedia.org/wiki/File%3AUSB-Microphone.jpg
        ('TEC', 5, 'https://thumb.wikimedia.org/wikipedia/commons/thumb/e/ee/USB-Microphone.jpg/330px-USB-Microphone.jpg'),
        -- Cargador · Alcide55 · https://commons.wikimedia.org/wiki/File%3AUSB_wall_charger.JPG
        ('TEC', 6, 'https://thumb.wikimedia.org/wikipedia/commons/thumb/6/6a/USB_wall_charger.JPG/500px-USB_wall_charger.JPG'),
        -- Parlante · Joseph_usef · https://commons.wikimedia.org/wiki/File%3ABluetooth_Speaker.jpg
        ('TEC', 7, 'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/72/Bluetooth_Speaker.jpg/330px-Bluetooth_Speaker.jpg'),
        -- Adaptador USB · Lagoset · https://commons.wikimedia.org/wiki/File%3AUBS-OTG_adapter.jpg
        ('TEC', 8, 'https://thumb.wikimedia.org/wikipedia/commons/thumb/0/0f/UBS-OTG_adapter.jpg/500px-UBS-OTG_adapter.jpg'),
        -- Soporte para notebook · Solijon Solayev · https://commons.wikimedia.org/wiki/File%3ALaptop_stand.jpg
        ('TEC', 9, 'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/43/Laptop_stand.jpg/500px-Laptop_stand.jpg'),
        -- Hub USB · rautiocination · https://commons.wikimedia.org/wiki/File%3AUSB_hubs.jpg
        ('TEC', 10, 'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/78/USB_hubs.jpg/330px-USB_hubs.jpg'),
        -- Lámpara · AirbusA330772673 · https://commons.wikimedia.org/wiki/File%3AA_desk_lamp.jpg
        ('HOG', 1, 'https://thumb.wikimedia.org/wikipedia/commons/thumb/f/fa/A_desk_lamp.jpg/500px-A_desk_lamp.jpg'),
        -- Organizador · Jubair1985 · https://commons.wikimedia.org/wiki/File%3APen_Holder.jpg
        ('HOG', 2, 'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/9f/Pen_Holder.jpg/500px-Pen_Holder.jpg'),
        -- Estante · Tarehh · https://commons.wikimedia.org/wiki/File%3AItems_On_A_Shelf.jpg
        ('HOG', 3, 'https://thumb.wikimedia.org/wikipedia/commons/thumb/5/56/Items_On_A_Shelf.jpg/330px-Items_On_A_Shelf.jpg'),
        -- Reloj de pared · User:Ramya Dwivedula · https://commons.wikimedia.org/wiki/File%3AWall_Clock.jpg
        ('HOG', 4, 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c0/Wall_Clock.jpg/500px-Wall_Clock.jpg'),
        -- Almohadón · Ikhadeejatu · https://commons.wikimedia.org/wiki/File%3AThrow_pillows.jpg
        ('HOG', 5, 'https://upload.wikimedia.org/wikipedia/commons/a/a0/Throw_pillows.jpg'),
        -- Maceta · Iswaryadhamodharan2001 · https://commons.wikimedia.org/wiki/File%3APlant_at_pot.jpg
        ('HOG', 6, 'https://thumb.wikimedia.org/wikipedia/commons/thumb/5/50/Plant_at_pot.jpg/500px-Plant_at_pot.jpg'),
        -- Bandeja · Artist-freed · https://commons.wikimedia.org/wiki/File%3AA_Tray.jpg
        ('HOG', 7, 'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/9a/A_Tray.jpg/500px-A_Tray.jpg'),
        -- Canasto · Noport · https://commons.wikimedia.org/wiki/File%3AWicker_basket.jpg
        ('HOG', 8, 'https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f0/Wicker_basket.jpg/500px-Wicker_basket.jpg'),
        -- Perchero · Christoph2109 · https://commons.wikimedia.org/wiki/File%3ABespoke_Coat_Rack.jpg
        ('HOG', 9, 'https://thumb.wikimedia.org/wikipedia/commons/thumb/3/33/Bespoke_Coat_Rack.jpg/330px-Bespoke_Coat_Rack.jpg'),
        -- Portarretrato · 787IYO · https://commons.wikimedia.org/wiki/File%3AFrame_picture.jpg
        ('HOG', 10, 'https://thumb.wikimedia.org/wikipedia/commons/thumb/f/ff/Frame_picture.jpg/330px-Frame_picture.jpg'),
        -- Mochila · Kaartic · https://commons.wikimedia.org/wiki/File%3AWikimedia_swag_backpack.jpg
        ('ACC', 1, 'https://thumb.wikimedia.org/wikipedia/commons/thumb/1/10/Wikimedia_swag_backpack.jpg/500px-Wikimedia_swag_backpack.jpg'),
        -- Botella térmica · University of Dundee Museum Services · https://commons.wikimedia.org/wiki/File%3AVacuum_Flask.jpg
        ('ACC', 2, 'https://upload.wikimedia.org/wikipedia/commons/9/9d/Vacuum_Flask.jpg'),
        -- Bolso · Carl Lender · https://commons.wikimedia.org/wiki/File%3AVintage_Duffel_Bag_%2815550907613%29.jpg
        ('ACC', 3, 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Vintage_Duffel_Bag_%2815550907613%29.jpg'),
        -- Riñonera · No machine-readable author provided. RJFJR assumed (based on copyright claims). · https://commons.wikimedia.org/wiki/File%3AFannypack2a.jpg
        ('ACC', 4, 'https://upload.wikimedia.org/wikipedia/commons/f/f3/Fannypack2a.jpg'),
        -- Cartuchera · Cupper52 · https://commons.wikimedia.org/wiki/File%3APencil_case_with_pencils.jpg
        ('ACC', 5, 'https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c2/Pencil_case_with_pencils.jpg/330px-Pencil_case_with_pencils.jpg'),
        -- Neceser · GAlexandrova · https://commons.wikimedia.org/wiki/File%3A011Aa._Fabric_cosmetic_bags.jpg
        ('ACC', 6, 'https://thumb.wikimedia.org/wikipedia/commons/thumb/6/6f/011Aa._Fabric_cosmetic_bags.jpg/330px-011Aa._Fabric_cosmetic_bags.jpg'),
        -- Gorra · NNU-11-Zaclee · https://commons.wikimedia.org/wiki/File%3ACAPS.jpg
        ('ACC', 7, 'https://thumb.wikimedia.org/wikipedia/commons/thumb/c/cc/CAPS.jpg/330px-CAPS.jpg'),
        -- Billetera · Kanbongma · https://commons.wikimedia.org/wiki/File%3ALeather_wallets.jpg
        ('ACC', 8, 'https://thumb.wikimedia.org/wikipedia/commons/thumb/6/6a/Leather_wallets.jpg/330px-Leather_wallets.jpg'),
        -- Lonchera · Pete unseth · https://commons.wikimedia.org/wiki/File%3ABento_box.png
        ('ACC', 9, 'https://thumb.wikimedia.org/wikipedia/commons/thumb/1/17/Bento_box.png/330px-Bento_box.png'),
        -- Estuche · https://commons.wikimedia.org/wiki/File%3AGlasses_and_case_%28AM_70349-2%29.jpg
        ('ACC', 10, 'https://thumb.wikimedia.org/wikipedia/commons/thumb/8/85/Glasses_and_case_%28AM_70349-2%29.jpg/330px-Glasses_and_case_%28AM_70349-2%29.jpg')
), series AS (
    SELECT prefijo || '-DEMO-' || lpad(numero::text, 3, '0') AS codigo, url
    FROM fotos
    CROSS JOIN LATERAL generate_series((familia - 1) * 30 + 1, LEAST(familia * 30, 298)) AS numeros(numero)
), originales (codigo, prefijo, familia) AS (
    VALUES
        ('TEC-001', 'TEC', 1),
        ('TEC-002', 'TEC', 2),
        ('HOG-001', 'HOG', 1),
        ('HOG-002', 'HOG', 2),
        ('ACC-001', 'ACC', 1),
        ('ACC-002', 'ACC', 2)
), imagenes AS (
    SELECT codigo, url FROM series
    UNION ALL
    SELECT originales.codigo, fotos.url
    FROM originales
    JOIN fotos USING (prefijo, familia)
)
UPDATE public.productos AS producto
SET imagen_url = imagenes.url
FROM imagenes
WHERE producto.codigo = imagenes.codigo
  AND (
      NULLIF(btrim(producto.imagen_url), '') IS NULL
      OR producto.imagen_url LIKE 'https://placehold.co/%'
  );

COMMIT;
