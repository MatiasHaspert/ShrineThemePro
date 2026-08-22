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

---

## D-007 · 2026-08-21 · Espanol como locale por defecto y borrado de los otros 48

**Decision.** `es.json` pasa a ser `es.default.json` (y `es.schema.json` a
`es.default.schema.json`). Se borran los otros 50 archivos de `locales/`, ingles incluido.

**Alternativa descartada.** Dejar `en.default.json` como default y `es.json` como traduccion.

**Por que.** La tienda es solo Argentina, sin selector de pais ni de idioma (regla 3.1). Con
ingles como default, cualquier string que Shrine no tradujo caia en ingles en una tienda
rioplatense. Ademas `theme check` valida contra el locale default: con espanol como default,
las etiquetas de las secciones CAUCE se validan en el idioma en el que se van a leer.

**Impacto medido.** De 1.645 a 20 errores de `theme check` en un paso. Los 1.625 eran los otros
locales sin las claves nuevas.

**Riesgo y mitigacion.** Antes de renombrar se compararon las claves: a `es` le faltaban 8, todas
bajo `shopify.checkout.*`. Se completaron a mano. Si manana se agrega un segundo idioma, se
recupera el archivo desde git (`git show main:locales/en.default.json`).

---

## D-008 · 2026-08-21 · Nombres de tag dinamicos reescritos como variable

**Decision.** El patron `<{% if x %}a{% else %}div{% endif %}>` se reescribe como
`{%- liquid assign tag = ... -%}` + `<{{ tag }}>` en los 6 archivos donde aparecia y que si usamos:
`header.liquid`, `logo-list.liquid`, `main-product.liquid`, `bundle-offer.liquid`,
`cart-drawer.liquid` (snippet) y `upsell-block.liquid`.

**Alternativa descartada.** Apagar la regla `LiquidHTMLSyntaxError` en `.theme-check.yml`.

**Por que.** Shopify acepta el patron original, pero el parser de theme-check no, y **se corta en el
primer error de cada archivo**: mientras estuviera ahi, cualquier error real que escribieramos mas
abajo en `main-product.liquid` o en `header.liquid` quedaba invisible. Apagar la regla habria
tenido el mismo efecto. El HTML renderizado es identico; se verifico que cada apertura tenga su
cierre correspondiente.

**Alcance.** Las mismas ocurrencias en secciones `sp-*` / `ss-*` no se tocaron: estan fuera del
alcance por D-001 y `.theme-check.yml` ya las ignora.

---

## D-009 · 2026-08-21 · Borrar tres secciones importadas de otro tema

**Decision.** Se eliminan `special-banner.liquid`, `spotlight-products.liquid` y
`spotlight-block.liquid`.

**Alternativa descartada.** Escribir a mano las 115 claves de traduccion que les faltan.

**Por que.** No son de Shrine. Referencian namespaces que no existen en ningun locale de este tema
(`sections.layout.*`, `sections.collection_lookbook.*`, `sections.main_lookbook_page.*`,
`sections.policies_block.*`) y ademas piden tres assets que no estan en `assets/`
(`component-special-banner.css`, `component-spotlight-products.css`, `lookbook-script.js`). Aunque
alguien las insertara, renderizarian sin estilos y con las etiquetas rotas. Ningun template las
referencia.

**Impacto.** 244 errores menos. Si aparecen los archivos que faltan, se recuperan desde git.

---

## D-010 · 2026-08-21 · Se elimina el snippet cjpod

**Decision.** Se borra `snippets/cjpod.liquid`.

**Por que.** Es una integracion de CJ Dropshipping que inyecta `frontend.cjdropshipping.com/egg/pod3.js`
en las paginas de producto y vuelca el objeto `product` completo a `window`. Ningun archivo del tema
lo renderiza, asi que hoy esta muerto, pero es un script de terceros esperando a que alguien lo
conecte. Nada del roadmap de CAUCE lo necesita.

---

## D-011 · 2026-08-21 · El label del boton solido es TINTA, no blanco

**Decision.** `colors_solid_button_labels` = `#10262A` (TINTA).

**Alternativa descartada.** Blanco o SEDIMENTO sobre el boton BRONCE, que es lo que se ve en la
mayoria de las tiendas.

**Por que.** Contraste medido sobre BRONCE `#B98A44`:

| Label | Ratio | AA texto |
|---|---|---|
| Blanco `#FFFFFF` | 3.10:1 | falla |
| SEDIMENTO `#E9E6DC` | 2.48:1 | falla |
| **TINTA `#10262A`** | **5.09:1** | **pasa** |

El boton de compra es el elemento mas importante de la pagina; no puede ser el que no pasa AA.
Ademas tinta sobre bronce lee mas editorial que blanco sobre dorado.

**Relacionado.** Por la misma razon existen `--cauce-bronce-texto` y `--cauce-vado-icono` en
`cauce-brand.css`: los tokens puros como texto sobre SEDIMENTO dan 2.48:1 y 2.44:1. Se ajusto el
tono del texto, no el token de marca.

---

## D-003bis · 2026-08-22 · Correccion: el token `[duracion]` no va en `text-with-price.liquid`

**Que cambia.** D-003 decia que la sustitucion de `[duracion]` iba adentro de
`snippets/text-with-price.liquid`. Al implementarlo aparecieron dos impedimentos y la
sustitucion termino en `snippets/quantity-breaks.liquid`.

**Impedimento 1 — el JS pisa el texto.** Cada label de escalon se renderiza dos veces:
una en el servidor via `text-with-price`, y otra en el cliente, porque el tema guarda la
plantilla cruda en un atributo `data-text` y la vuelve a resolver al cambiar de variante
(clases `dynamic-price variant-price-update`). Ese atributo se escribe directo desde
`block.settings`, sin pasar por el snippet. Resolviendo el token solo en el snippet, el
primer cambio de variante mostraba `[duracion]` en crudo.

**Impedimento 2 — Liquid no admite filtros en argumentos de `render`.** El intento de
pasar `text: block.settings.option_1_label | replace: ...` dio 24 errores
`UnsupportedFilterArguments` en `theme check`.

**Solucion.** Al tope de `quantity-breaks.liquid` se calculan cuatro duraciones (una por
escalon) y se derivan 24 variables `cauce_oN_campo` con el token ya resuelto. Esas
variables reemplazan a `block.settings.option_N_campo` en **las 80 referencias del
archivo**, incluidos los guardas `!= blank`. Eso ultimo importa: un SKU sin metafields de
dosis deja el caption vacio, y con el guarda apuntando a la variable el renglon
directamente no se renderiza.

**Costo.** El toque al core es mas grande de lo previsto (un archivo, 80 referencias) pero
es mecanico y esta generado por script, no a mano. Si Shrine actualiza el archivo, se
reaplica corriendo el mismo reemplazo.

---

## D-012 · 2026-08-22 · Medios de pago propios, no el block `payment_badges`

**Decision.** `snippets/cauce-medios-pago.liquid` reemplaza al block `payment_badges` del
tema en la PDP.

**Alternativa descartada.** Usar `payment_badges` con la lista de tipos configurada.

**Por que.** Ese block renderiza con el filtro `payment_type_svg_tag`, que solo conoce el
set fijo de Shopify: visa, master, american_express, paypal, apple_pay, shop_pay,
discover, diners_club. **Mercado Pago no esta**, que en Argentina es el medio principal, y
la mitad de los que si estan son los que el brief pide sacar.

**Como resuelve.** Las marcas que Shopify si dibuja salen como SVG nativo. Las locales
(Mercado Pago, Cabal, Naranja X, Pago Facil, Rapipago) salen como **chip tipografico** en
DM Mono. No se redibujaron los logos: un logo de marca dibujado de memoria es un logo mal
dibujado, y ademas la regla de marca prohibe la sopa de sellos. Si el comercio quiere los
logos oficiales, sube una tira en `settings.cauce_img_medios_pago` y esa imagen reemplaza
a los chips.

**Nota.** La lista de medios es un setting, no una constante. Mostrar un medio que la
tienda no acepta seria publicidad enganosa bajo Ley 24.240.

---

## D-013 · 2026-08-22 · Borrar los cuatro archivos `*.context.*.json`

**Decision.** Se eliminan `header-group.context.04d13b88-….json`,
`header-group.context.international.json` y sus dos equivalentes de footer.

**Por que.** Son overrides de mercado heredados de la tienda donde se exporto el tema.
Los cuatro estan **vacios** (`"sections": {}`) y apuntan a mercados que no existen en
`causear.myshopify.com`, asi que el push los rechazaba con "el nombre de archivo principal
header-group.json no existe". Ademas CAUCE es un solo mercado sin selector de pais
(regla 3.1), asi que no hay override que preservar.

**Como se encontro.** El push a la tienda, no `theme check`: son archivos de datos que
solo valida el servidor de Shopify.

---

## D-014 · 2026-08-22 · Los placeholders en JSON usan `[[PENDIENTE: x]]`, no `{{ }}`

**Decision.** En archivos `.json` (templates y section groups) el marcador de dato
faltante es `[[PENDIENTE: clave]]`. En archivos `.liquid` se mantiene
`{% raw %}{{ PENDIENTE: clave }}{% endraw %}` como pedia el brief.

**Por que.** Shopify interpreta `{{ … }}` dentro de un setting de JSON como **dynamic
source** (binding a metafield o setting). El push fallo con "La fuente dinamica
'PENDIENTE: email_contacto' es invalida". No es una preferencia de estilo: la sintaxis
del brief es imposible ahi.

**Consecuencia.** Para listar todos los pendientes hay que buscar las dos formas:
`grep -rn "PENDIENTE" templates/ sections/ snippets/`.

---

## D-015 · 2026-08-22 · El token `[duracion]` no se aplica a los escalones por variante

**Decision.** `snippets/product-variant-options.liquid` (los quantity breaks que se arman
desde el `variant_picker`) queda **sin** soporte de `[duracion]`.

**Por que.** En ese modo cada escalon es una **variante distinta**, no una cantidad. Los
metafields de dosis viven a nivel producto, asi que las tres filas mostrarian la misma
duracion — y el caso real donde alguien usaria ese modo es justamente un producto con
varios tamanos, donde cada variante rinde distinto. Poner un numero igual en las tres
seria inventar un dato.

**Cuando se resuelve.** Cuando exista un SKU con tamanos distintos. Ahi los metafields de
dosis pasan a nivel variante y el calculo se hace por variante. No antes.

---

## D-016 · 2026-08-22 · Un solo elemento BRONCE en el hero: el boton de compra

**Decision.** En `templates/product.cauce-landing.json`, el unico elemento que resuelve a
BRONCE es el boton de agregar al carrito. El precio va en `text` (TINTA), los escalones de
cantidad en `text`, y los iconos de los bullets en `accent-2` (VADO).

**Alternativa descartada.** Los defaults de Shrine, que ponen `accent-1` en el precio, en
el borde del escalon seleccionado y en el badge — tres bronces compitiendo.

**Por que.** Es la regla 1 del brandboard, y ademas coincide con lo que conviene por CRO:
si el unico acento calido de la pantalla es el boton, el ojo va ahi. Con el precio tambien
en bronce, el acento se reparte y no senala nada.

---

## D-017 · 2026-08-22 · Los escalones de cantidad arrancan con descuento 0

**Decision.** Los tres escalones tienen `option_N_percentage_off_text: "0"` y el pill de
beneficio dice `[[PENDIENTE: descuento_x2]]` / `_x3`.

**Por que.** El porcentaje de descuento por cantidad es una decision comercial, no una de
implementacion, y el brief prohibe inventar numeros. Con 0, los tres escalones muestran el
precio real multiplicado, que es cierto aunque no sea persuasivo.

**Advertencia que sigue vigente desde la fase 1.** Los precios de los escalones son
**solo display**. El descuento real lo tiene que aplicar un **descuento automatico de
Shopify** con las mismas cantidades y porcentajes. Si no coinciden, la PDP muestra un
precio y el carrito cobra otro: eso es infraccion al art. 7 y 8 de la Ley 24.240, no un
detalle de UX. Cargar los porcentajes en el theme editor **y** en Descuentos, o ninguno de
los dos.
