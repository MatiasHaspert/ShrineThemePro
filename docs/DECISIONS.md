# DECISIONS.md — Decisiones de implementación

Registro de decisiones tomadas sin consultar, con la alternativa descartada y el motivo.
Formato: fecha · decisión · alternativa descartada · por qué.

---

## D-001 · 2026-08-21 · Usar solo la familia nativa de Shrine, descartar `sp-*` y `ss-*`

**Decisión.** El cuerpo de la landing se arma con secciones nativas del tema
(`multicolumn`, `icons-with-content`, `icon-bar`, `collapsible-content`, `content-tabs`,
`comparison-table`, `testimonials`, `horizontal-ticker`, `custom-columns`, `rich-text`).
Las 118 secciones `sp-*` / `ss-*` quedan fuera.

**Alternativa descartada.** Usar los packs de terceros, que traen layouts más armados
(`ss-comparison-table-6`, `sp-faq-plus`, `ss-tabs-block`, `sp-trust-badges`).

**Por qué.**
1. No implementan `color_scheme`. Cada una expone `background_color` / `text_color` /
   `override_fonts` propios. Brandear la página significaría repetir los hex de CAUCE en decenas
   de settings, que es exactamente lo que prohíbe la regla 3.3 del brief.
2. Peso. `sp-trust-badges` son 139 KB de SVG inline que van al HTML renderizado;
   `ss-feature-13` son 235 KB de fuente. Contra un presupuesto de LCP < 2.5 s en 4G, no entran.
3. Estética. Son el look "supplement store" saturado de badges que el brief descarta.

**Consecuencia.** Las secciones que quedan sin cubrir por la familia nativa (UGC, datos, tabs y
FAQ desde metafield, newsletter con consentimiento, legales) se escriben de cero como `cauce-*`.

---

## D-002 · 2026-08-21 · Los tokens de marca viven en settings globales, no en CSS

**Decisión.** Los 4 colores CAUCE se cargan en los settings globales del tema
(`colors_text` = TINTA, `colors_background_1` = SEDIMENTO, `colors_accent_1` = BRONCE,
`colors_accent_2` = VADO). `assets/cauce-brand.css` declara los `--cauce-*` como fuente de verdad
documental y agrega lo que el tema no tiene (mono, tracking del logo, aire mínimo).

**Alternativa descartada.** Definir todo en `cauce-brand.css` y sobrescribir las variables del
tema con `!important`.

**Por qué.** El tema resuelve `color_scheme` a partir de esos settings en `theme.liquid`. Si los
seteamos ahí, las 12 secciones reusadas quedan brandeadas sin una línea de CSS y el theme editor
sigue mostrando previews correctos. Sobrescribir por CSS habría dejado el editor mintiendo.

**Riesgo asumido.** El branding queda repartido entre `settings_data.json` y `cauce-brand.css`.
Se mitiga documentando el mapeo en la tabla de AUDIT §1 y versionando `settings_data.json`.

---

## D-003 · 2026-08-21 · El token `[duracion]` va en `text-with-price.liquid`, no en JS

**Decisión.** La duración del suministro se calcula en Liquid, agregando un token `[duracion]` a
`snippets/text-with-price.liquid` a partir de `product.metafields.cauce.dosis_diaria`.

**Alternativa descartada.** Un script propio que reescriba el texto de los quantity breaks en el
cliente.

**Por qué.** `assets/main.js` está ofuscado (string-array), así que no es editable. Pero
`text-with-price.liquid` es un snippet de 26 líneas en Liquid plano por donde ya pasan todos los
labels de los escalones. Es el punto de inyección más chico y no toca `main-product.liquid`.

**Costo.** Es un toque al core del tema. Queda marcado con `{% comment %} CAUCE: ... {% endcomment %}`
y anotado en AUDIT §4.

---

## D-004 · 2026-08-21 · Los legales argentinos van en `footer-group`, no en el footer

**Decisión.** Se crea `sections/cauce-legal-bar.liquid` y se agrega a `sections/footer-group.json`
como sección hermana de `footer`, en vez de configurar blocks dentro de `footer.liquid`.

**Alternativa descartada.** Resolver arrepentimiento, libro de quejas, Data Fiscal y disclaimer con
blocks `text` / `image` / `link_list` del footer nativo, que técnicamente alcanzan.

**Por qué.** Con blocks, los obligatorios legales dependen de que alguien no los borre desde el
theme editor al rediseñar el footer. Como sección propia con settings requeridos y fallbacks
visibles, el incumplimiento es evidente y auditable. `footer-group` garantiza que aparezca en todas
las páginas, incluido home y checkout-adyacentes.

---

## D-005 · 2026-08-21 · Íconos VADO en SVG inline, no Material Symbols

**Decisión.** Los íconos de las secciones CAUCE salen de `snippets/cauce-iconos.liquid` (SVG inline
con `currentColor`). Material Symbols queda solo donde ya lo usan los blocks reusados de Shrine.

**Alternativa descartada.** Usar el sistema de íconos por nombre del tema
(`{% render 'material-icon', icon: 'check_circle' %}`).

**Por qué.** Material Symbols Outlined es una variable font traída de `fonts.gstatic.com`. Para
media docena de íconos es un round-trip de red y un archivo grande contra el presupuesto de LCP.
Además `currentColor` deja que el ícono tome VADO desde el token sin un setting de color extra.

---

## D-006 · 2026-08-21 · Reseñas: `testimonials` nativo, sin `AggregateRating`

**Decisión.** El bloque 13 usa `testimonials.liquid`. No se emite `AggregateRating` en el JSON-LD y
el block `rating_stars` del hero arranca desactivado.

**Alternativa descartada.** Activar `rating_stars` con un texto tipo "(1.200 reseñas)" como hacen
los temas de dropshipping.

**Por qué.** No hay reseñas todavía. Inventarlas es publicidad engañosa bajo Ley 24.240 y marcado
estructurado falso ante Google. El brief lo pide explícito ("Schema.org solo si son reales").

**Pendiente de vos.** Si hay reseñas reales y una app (Judge.me, Loox, Ryviu), se reevalúa: el tema
ya lee `product.metafields.reviews.rating` y tiene hooks para Loox y Ryviu.
