# COPY-DRAFT.md — propuesta de textos, **sin aprobar**

Todo lo que sigue es un **borrador** cargado como valor por defecto en settings y locales
para poder ver la página armada. **Nada de esto está aprobado.** Revisalo antes de que la
tienda salga de modo contraseña.

Cobertura: fases 2 y 3 (home mínima, barra de anuncio, hero de la PDP). El cuerpo de la
landing (bloques 4–20) se agrega en las fases 4 y 5.

Convenciones:

- **Riesgo** — qué habría que verificar antes de publicarlo.
  - `dato` = afirma un hecho verificable; hay que poder respaldarlo con un documento.
  - `forma` = solo redacción, sin exposición legal.
  - `pendiente` = tiene un placeholder sin resolver.
- La auditoría legal por claim vive en `docs/CLAIMS-AUDIT.md`. Acá está el texto crudo.

---

## 1. Barra de anuncio · `sections/header-group.json`

| # | Texto | Riesgo |
|---|---|---|
| 1 | Envío gratis en compras desde $ `[[PENDIENTE: umbral_envio_gratis]]` | `pendiente` — el umbral tiene que existir como envío gratis real configurado |
| 2 | Producción nacional. Análisis por laboratorio externo. | `dato` — exige que la producción sea nacional y que exista COA de un tercero |

---

## 2. Home · `templates/index.json`

### Hero

| Campo | Texto | Riesgo |
|---|---|---|
| Volanta | Fórmulas de uso diario | `forma` |
| Título | Lo que tomás todos los días debería explicarse en una sola línea. | `forma` |
| Texto | Cada fórmula lleva la lista completa de lo que contiene y en qué cantidad. Sin mezclas propietarias, sin letra chica y sin promesas que no podamos sostener. | `dato` — compromete a no usar *proprietary blends* en ningún SKU futuro |
| Botón | Ver la fórmula | `forma` |

### Pilares

| Título | Texto | Riesgo |
|---|---|---|
| Forma R pura | El isómero R, no la mezcla racémica que se usa por defecto porque sale más barata. | `dato` — afirma que el producto es R puro; el COA lo tiene que decir |
| 600 mg por cápsula | La cantidad está en la etiqueta y coincide con el análisis. Una cápsula, una dosis. | `dato` — el análisis tiene que dar 600 mg |
| Análisis por laboratorio externo | Cada lote se analiza en un laboratorio que no es el nuestro. Publicamos el COA. | `dato` — compromete a publicar el COA **de cada lote**, no de uno |
| Producción nacional | Se produce en Argentina. Trazabilidad de lote y tiempos de entrega reales. | `dato` |

### Manifiesto

| Campo | Texto | Riesgo |
|---|---|---|
| Título | Hecho para todos los días | `forma` |
| Texto | CAUCE es una marca argentina de fórmulas de uso diario. Elegimos contar la composición completa, publicar los análisis y no prometer resultados. Si algo no lo podemos sostener con un documento, no lo escribimos. | `forma` |

> Nota: "no prometer resultados" es una promesa de marca que conviene sostener. Si más
> adelante alguna sección afirma un resultado, este párrafo la contradice en la misma web.

---

## 3. Hero de la PDP · `templates/product.cauce-landing.json`

### Encabezado

| Campo | Texto | Riesgo |
|---|---|---|
| Título | *(sale del título del producto en Shopify)* | — |
| Subtítulo | Isómero R puro, sin mezcla racémica. 30 cápsulas de producción nacional. | `dato` |

Deliberadamente dice **qué es**, no para qué sirve. No hay ninguna referencia a
neuropatía, glucemia, dolor, energía ni antioxidación: todas caen en claim terapéutico
bajo Disp. ANMAT 4980/05.

### Bullets

| Ícono | Texto | Riesgo |
|---|---|---|
| `science` | Forma R pura, no racémica | `dato` |
| `medication` | 600 mg por cápsula | `dato` |
| `biotech` | Analizado por laboratorio externo | `dato` |
| `factory` | Producción nacional | `dato` |

Los cuatro son los mismos pilares de la home, a propósito: es el eje argumental de la
marca y conviene que se repita.

### Selector de oferta

| Campo | Texto | Riesgo |
|---|---|---|
| Encabezado | Elegí tu cantidad | `forma` |
| Escalón 1 | 1 frasco · *(duración calculada)* | `forma` |
| Escalón 2 | 2 frascos · *(duración)* · pill `[[PENDIENTE: descuento_x2]]` | `pendiente` |
| Escalón 3 | 3 frascos · *(duración)* · pill `[[PENDIENTE: descuento_x3]]` | `pendiente` |

"frasco" es un valor de setting del template, no está en el Liquid: para un SKU en polvo
se cambia a "envase" desde el editor sin tocar código.

**Sin badge de "el más elegido".** Es lo que haría un tema de dropshipping y es
exactamente el tipo de dato que todavía no tenemos. Cuando haya ventas reales, se pone.

### Acordeones

| Acordeón | Origen del texto | Riesgo |
|---|---|---|
| Composición | metafield `cauce.composicion` | `pendiente` — tiene que ser textual de la etiqueta |
| Modo de uso | metafield `cauce.modo_uso` | `pendiente` — textual de la etiqueta |
| Análisis de laboratorio | metafield `cauce.analisis` | `pendiente` |
| Envíos y entrega | setting del template | `pendiente` ×3 |
| Cambios y devoluciones | setting del template | `dato` — refleja el derecho de arrepentimiento |

Texto actual de **Envíos y entrega**:

> Despachamos desde `[[PENDIENTE: ciudad_deposito]]`. El plazo estimado es de
> `[[PENDIENTE: plazo_envio]]` días hábiles y el costo se calcula en el checkout según tu
> código postal. Envío sin cargo en compras desde $ `[[PENDIENTE: umbral_envio_gratis]]`.

Texto actual de **Cambios y devoluciones**:

> Tenés 10 días corridos desde que recibís el pedido para arrepentirte de la compra y
> pedir la devolución del importe pagado, sin costo (Res. SCI 424/2020). El producto tiene
> que estar sin abrir.
>
> Para iniciarlo, entrá al botón de arrepentimiento del pie de página o escribinos a
> `[[PENDIENTE: email_contacto]]`.

> **Revisar con criterio legal.** "El producto tiene que estar sin abrir" es una condición
> que la marca elige, y el derecho de arrepentimiento de la Res. SCI 424/2020 no la exige
> con esa amplitud. Si se sostiene, tiene que estar igual en la política de devoluciones,
> no solo acá.

---

## 4. Textos de sistema · `locales/es.default.json → cauce.*`

Estos no son copy de campaña, son textos que se repiten en toda la tienda. Están acá
porque también hay que leerlos antes de publicar.

| Clave | Texto |
|---|---|
| `marca.descriptor` | Fórmulas de uso diario |
| `legal.suplemento` | Este producto es un suplemento dietario. No reemplaza una alimentación variada. |
| `legal.consulta_medico` | Consultá a tu médico. |
| `legal.arrepentimiento_texto` | Podés arrepentirte de tu compra dentro de los 10 días corridos de recibido el producto y pedir la devolución del importe pagado, sin costo. Res. SCI 424/2020. |
| `legal.precio_iva` | Precios en pesos argentinos con IVA incluido. |
| `pdp.duracion_dias` | {{ dias }} días de uso |
| `pdp.cuotas` | Hasta {{ cuotas }} cuotas con tarjeta |
| `newsletter.consentimiento` | Acepto recibir emails de CAUCE y que mis datos se traten según la Política de Privacidad (Ley 25.326). Puedo darme de baja cuando quiera. |
| `newsletter.exito` | Listo. Te vamos a escribir poco y sólo cuando valga la pena. |

---

## 5. Lo que hay que decidir para poder publicar

| # | Dato | Dónde se carga |
|---|---|---|
| 1 | Umbral de envío gratis | `settings.cauce_umbral_envio_gratis` + descuento real de envío |
| 2 | % de descuento por 2 y por 3 frascos | template **y** descuento automático de Shopify |
| 3 | Ciudad de depósito y plazo de envío | acordeón Envíos |
| 4 | Email de contacto | `settings.cauce_email` |
| 5 | Dosis diaria de etiqueta | metafield `cauce.dosis_diaria` |
| 6 | Composición, modo de uso y análisis | metafields, textual de la etiqueta |
| 7 | RNPA/RNE | `settings.cauce_rnpa` |
| 8 | Razón social, CUIT, domicilio, teléfono | grupo CAUCE de theme settings |
| 9 | Cuotas sin interés, si el plan existe | `settings.cauce_cuotas` (0 = oculto) |
