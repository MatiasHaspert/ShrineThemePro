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

> **REVERTIDA por D-031 (2026-08-25).** Valia mientras el acento era BRONCE. Sobre OXIDO los
> numeros se dan vuelta: blanco da 6.04:1 y TINTA 2.61:1. La etiqueta del boton es blanca.
> Lo que sigue queda como registro del razonamiento, no como regla vigente.

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

> **VIGENTE, con el color cambiado por D-031 (2026-08-25).** Donde dice BRONCE, leer OXIDO
> (`#B03A22` sobre claro, `#D9603F` sobre CAUCE). La regla no cambio; el acento si.

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

---

## D-018 · 2026-08-22 · Los schemas de las secciones cauce-* usan texto plano, no claves `t:`

**Decision.** Los `{% schema %}` de `cauce-datos`, `cauce-tabs`, `cauce-acordeon-detalle` y
`cauce-ugc` escriben sus labels en castellano directo, sin pasar por
`locales/es.default.schema.json`.

**Alternativa descartada.** Usar `t:sections.cauce_*.…` como hace Shrine.

**Por que.** Son etiquetas del theme editor, no copy de la tienda: no las lee un cliente,
no son auditables bajo la regla 3.1 y la tienda tiene un solo idioma. La indireccion solo
agrega un archivo mas donde equivocarse y una clase de error (`ValidSchemaTranslations`)
que ya nos costo 244 offenses en la fase 2.

**Alcance.** El copy que **si** ve el cliente sigue saliendo de `locales/es.default.json` o
de settings. Ni un solo string de storefront esta hardcodeado en estas secciones.

---

## D-019 · 2026-08-22 · La seccion de resenas queda en el template pero desactivada

**Decision.** El bloque 13 esta en `product.cauce-landing.json` como seccion
`testimonials` con `"disabled": true` y sin bloques.

**Alternativa descartada.** Dejarla afuera del template, o ponerle testimonios de relleno.

**Por que.** Todavia no hay resenas reales. Un testimonio inventado es publicidad enganosa
bajo Ley 24.240, y "lorem ipsum" en una seccion activa es exactamente lo que se publica por
accidente. Con `disabled` la seccion aparece en el editor, ya configurada con el esquema de
color y el layout correctos, y alcanza con destildarla el dia que haya resenas.

**Cuando se activa.** Cuando existan resenas reales. Ahi tambien se reevalua el
`AggregateRating` del JSON-LD (ver D-006), que hoy no se emite.

---

## D-020 · 2026-08-22 · El detalle de producto sale del hero y pasa a las pestanas

**Decision.** Los acordeones de composicion, modo de uso y analisis se sacan del hero. El
hero queda con dos acordeones de compra: envios y devoluciones. El detalle del producto
vive en el bloque 14 (`cauce-tabs`).

**Se aparta del brief**, que en el bloque 3 pedia "4-5 acordeones cortos debajo del boton
(composicion, uso, envios, garantia)".

**Por que.** El brief pide composicion y modo de uso en el hero (bloque 3) y otra vez en las
pestanas (bloque 14). Como las dos piezas leen el **mismo metafield**, el resultado no era
un resumen y un detalle: era el mismo texto dos veces en la misma pagina. Habia que elegir
uno.

Se eligio las pestanas por dos razones. La primera es de mobile: el hero es la pantalla
donde se decide la compra y cinco acordeones empujan el boton y las objeciones de compra
fuera de vista. La segunda es que junto al boton conviene lo que destraba la compra —
cuando llega, que pasa si no me gusta — y no la ficha tecnica.

**Como revertirlo.** Los tres bloques `custom_liquid` con `cauce-acordeon` estan en el
historial del template (commit de la fase 3). Es copiar y pegar tres entradas en
`blocks` y tres ids en `block_order`.

---

## D-021 · 2026-08-22 · La card de "biodisponibilidad" se reemplaza por "origen del ingrediente"

**Decision.** El bloque 6 (`cauce-beneficios-cards`) usa composicion, dosis, **origen del
ingrediente** y control de lote.

**Se aparta del brief**, que listaba "composicion, dosis, biodisponibilidad, control de
calidad".

**Por que.** Biodisponibilidad no es un dato de composicion, es una afirmacion sobre lo que
el cuerpo hace con el compuesto. Cualquier redaccion util de esa card ("se absorbe mejor",
"mayor biodisponibilidad que la mezcla racemica") es un claim de eficacia comparativa, que
es justo lo que prohibe la regla 3.1 y lo que no podriamos sostener con el COA — el
certificado dice que hay 600 mg de isomero R, no que se absorba mejor.

"Origen del ingrediente" ocupa el mismo lugar argumental (por que esta formula y no otra) y
se respalda con un documento: el certificado de la materia prima.

**Queda anotado en `docs/CLAIMS-AUDIT.md`** como sustitucion deliberada, para que no se
lea como un olvido.

---

## D-022 · 2026-08-22 · Sin libreria de carrusel: scroll-snap y `<details>` nativos

**Decision.** `assets/cauce.js` son 5,6 KB sin comprimir (**1,9 KB gzip**) y contiene
exactamente dos custom elements: `<cauce-tabs>` y `<cauce-ugc>`.

**Por que tan poco.** Todo lo que el navegador ya hace bien quedo en HTML y CSS:

| Necesidad | Resuelto con | JS |
|---|---|---|
| Acordeones | `<details>` / `<summary>` | 0 |
| Carrusel de videos | `scroll-snap-type: x mandatory` | 0 |
| Estado expandido para lectores de pantalla | nativo de `<details>` | 0 |
| Pestanas con teclado | `<cauce-tabs>` | si |
| Play, silenciar, pausar fuera de pantalla | `<cauce-ugc>` | si |

**Degradacion sin JS.** Los paneles de pestanas quedan todos visibles y el carrusel sigue
scrolleando con el poster. Nada desaparece.

**Presupuesto.** El brief pedia menos de 30 KB comprimidos de JS propio. Estamos en 1,9 KB.

---

## D-023 · 2026-08-22 · `cauce-datos` acepta cualquier clave del namespace

**Decision.** Cada fila de `cauce-datos` tiene un campo *clave del metafield* de texto
libre, no un select con claves fijas.

**Por que.** Las filas de la ficha cambian por categoria: una capsula muestra "activo por
capsula", un shampoo muestra "rinde" y un polvo muestra "porcion". Un select cerrado
obligaria a tocar el `.liquid` cada vez que aparece una categoria nueva, que es justo lo que
la arquitectura tiene que evitar.

**Contrapartida.** Una clave mal escrita no da error, simplemente cae al valor fijo. Es la
degradacion correcta: se ve el valor de respaldo, no un hueco.

---

## D-024 · 2026-08-22 · Seccion de suscripcion propia, por el consentimiento

**Decision.** Se crea `sections/cauce-newsletter.liquid` en vez de usar `newsletter`,
`email-signup-banner` o el block `email_signup` del footer.

**Por que.** Los cinco formularios de newsletter que trae Shrine mandan `contact[email]`
y una etiqueta fija, y **ninguno pide consentimiento**. La Ley 25.326 exige consentimiento
libre, expreso e informado; una casilla ausente no lo es, y una premarcada tampoco.

**Como lo resuelve.** Casilla `required` sin premarcar, texto del consentimiento en el
locale (auditable en un solo lugar), link a la politica de privacidad, y la etiqueta que
recibe el contacto deja constancia (`consentimiento-ley-25326`) para que el dato quede
trazable del lado de Shopify.

**Limite conocido.** `required` es validacion de navegador. Para un alta de newsletter
alcanza; si mañana el formulario pide mas datos personales, hay que validarlo del lado del
servidor con una app.

---

## D-025 · 2026-08-22 · No se escribe un snippet de datos estructurados de producto

**Decision.** No se crea `cauce-product-schema.liquid`. Se usa el JSON-LD que ya emite
`main-product.liquid`.

**Por que.** Al auditarlo cumple lo que pedia el brief: `Product` con `offers`, precio
tomado de `cart.currency.iso_code` (ARS), disponibilidad por variante, y **sin
`AggregateRating`**. Escribir uno propio habria duplicado el marcado en la misma pagina,
que es peor que no tener ninguno.

**Lo que si hay que arreglar, y no es del tema.** Ese JSON-LD publica
`"brand": product.vendor`, y el proveedor cargado en Shopify es *Vitalab*. Se corrige en el
admin del producto. Ver `CLAIMS-AUDIT.md` R2.

---

## D-026 · 2026-08-22 · La comparativa compara formatos, no competidores

**Decision.** La columna de comparacion se llama "Suplemento generico" y el texto de la
seccion aclara que la comparacion es **contra el acido alfa lipoico en mezcla racemica**,
que es el formato habitual de la categoria, y no contra ninguna marca ni medicamento.

**Alternativa descartada.** Nombrar marcas, que es lo que hace la referencia.

**Por que.** El brief lo prohibe y ademas es publicidad comparativa con nombre propio, que
en Argentina exige un estandar de prueba que no tenemos.

**Riesgo que queda.** Sigue siendo publicidad comparativa. Las dos primeras filas son
verdaderas por definicion quimica y se sostienen solas; las otras cuatro son sobre
practicas de divulgacion y son las discutibles. Anotado como R5 en `CLAIMS-AUDIT.md`.

---

## D-027 · 2026-08-22 · El CTA de cierre usa `atc_button` sin producto asignado

**Decision.** El bloque 18 usa el block `atc_button` de `custom-columns` **dejando vacio**
el selector de producto.

**Por que.** Con el selector vacio, Shrine renderiza un boton con la clase
`main-product-atc`, que su JS conecta al formulario del producto de la pagina. Eso da tres
cosas a la vez: respeta el escalon de cantidad que el cliente eligio arriba, no obliga a
cargar el producto en el template, y por lo tanto duplicar el template para otro SKU no
requiere tocar este bloque.

**Alternativa descartada.** Un link ancla al selector de ofertas. El id que genera Shopify
incluye el id de la seccion, que no se puede escribir en un JSON de otra seccion.

---

## D-028 · 2026-08-22 · Footer sin selector de pais, idioma ni medios de pago nativos

**Decision.** En `sections/footer-group.json`: `enable_country_selector: false`,
`enable_language_selector: false`, `payment_enable: false`, `show_policy: true`.

**Por que.**
- Pais e idioma: un solo mercado y un solo idioma (regla 3.1). Un selector de pais ademas
  habilita conversion de moneda, que la regla prohibe explicitamente.
- Medios de pago: el block nativo usa `payment_type_svg_tag`, que no conoce Mercado Pago
  (D-012). Se muestran con `cauce-medios-pago` en la PDP y en el cierre.
- `show_policy` en true hace que Shopify liste solas las politicas apenas se escriban, sin
  depender de que alguien arme un menu.

**Nota.** `branding_text` quedo vacio: el "Powered by Shrine" del pie no aporta y compite
con la firma de la marca.

---

## D-029 · 2026-08-23 · Todo el tema pasa a SVG inline, se elimina Material Symbols

**Decision.** `snippets/material-icon.liquid` emite SVG inline con `currentColor` en vez del
nombre del icono como texto. Se borro el `@font-face` de Material Symbols de `layout/theme.liquid`
y con el la ultima descarga de fuente de iconos del tema. Extiende D-005 al tema completo.

**Alternativa descartada.** Un script que regenerara la URL del subset de gstatic escaneando
`.liquid` y `.json` y reescribiendo `theme.liquid`.

**Por que.** El subset de la fase 6 dejo el LCP en 2,7 s pero creo un modo de falla silencioso:
la lista de iconos vive en el `@font-face` y el editor deja elegir cualquiera de los ~3.000 de
Material Symbols. Al elegir uno afuera del subset la ligadura no resuelve y el nombre se imprime
como texto, recortado a 1em por `max-width` + `overflow: hidden`, o sea una unica letra. Paso al
cambiar un icono a `water_drop` y se vio una "W". El script tapaba el sintoma pero mantenia la
dependencia de red y el paso manual de regeneracion. Con SVG inline no hay fuente, no hay URL que
regenerar y un icono desconocido no renderiza nada en vez de romperse en pantalla.

**Alcance.** Un solo chokepoint: los 54 `render 'material-icon'` del tema siguen igual. Se
reescribio el snippet y se reemplazaron los 4 `<span class="material-symbols-outlined">` sueltos
de `cart-checkpoints-bar.liquid` y `cart-progress-bar.liquid` por renders del snippet.

**Compatibilidad.** El SVG lleva `width`/`height` en `1em` y `fill="currentColor"`, y el span
conserva las clases `material-icon material-symbols-outlined`. Asi heredan el `font-size` y el
`color` que ya setean `.icon-with-text .material-icon { font-size: var(--icon-size) }` y
`.material-icon--custom-color { color: var(--color-icon) }`. Los sliders de tamano y el selector
de color del editor siguen funcionando y no se toco una linea de `base.css`.

**Nota.** Los paths son Material Symbols Outlined en `wght 300`, el mismo peso que declaraba el
`font-variation-settings` de la fuente variable, asi que el render es identico al anterior. Solo
se incluyen variantes rellenas donde el relleno cambia el dibujo y el tema las usa:
`check_circle`, `pause`, `person`, `play_arrow`, `verified`. `check` se descarto porque su
variante rellena es byte a byte igual a la delineada. Para el resto, `filled: true` cae en la
delineada en vez de fallar.

**Pendiente.** Conviven dos sets: `cauce-iconos` (trazo, `viewBox 0 0 24 24`) para las secciones
CAUCE y `material-icon` (relleno, `viewBox 0 -960 960 960`) para los blocks reusados de Shrine.
No se unificaron: son lenguajes graficos distintos y unificarlos es rediseno, no refactor.

---

## D-030 · 2026-08-25 · `ss-glow-testimonial` entra a la landing, pero reescrita

**Decisión.** Se agrega `SS - Glow Testimonial` a `templates/product.cauce-landing.json`
(handle `resenas`, entre `reviews` y `fichas`). La sección se reescribió entera contra el
sistema CAUCE: markup en `sections/ss-glow-testimonial.liquid`, estilo en
`assets/cauce-brand.css` bloque 9, `color_scheme` en vez de pickers de color, cero hex en el
template.

**Alternativa descartada.** Usar la sección del pack tal como venía y brandearla desde el
theme editor cargando los hex de CAUCE en sus nueve settings de color.

**Por qué.** Es la excepción pedida a D-001, y la única forma de que no lo sea de verdad es
que la sección deje de comportarse como una `ss-*`. Sin reescribir habría quedado: los cuatro
colores de marca repetidos en el template, un `<style>` inline por instancia, y —el problema
real— clases globales (`.reviews`, `.parer`, `.reviews_item`) que hacen que dos instancias en
la misma página se pisen entre sí.

**Qué se conservó del original.** El nombre, la marquesina de dos filas en sentidos opuestos y
el halo alrededor de la tarjeta. Es lo que hace reconocible a la sección.

**Qué cambió, y por qué.**

| Original | Ahora | Motivo |
|---|---|---|
| Degradado de 3 colores en una palabra del título | VADO plano | El bronce se usa una vez por pieza y el título nunca es bronce (bloque 1 de `cauce-brand.css`). El degradado no existe en el brandboard. |
| Halo `box-shadow` en un color de setting | Una sombra difusa en VADO | Mismo gesto, un solo color de marca. |
| `border-radius: 100px` fijo | Setting, default 4px | 4px es el radio del sistema. La pastilla sigue disponible. |
| JS que medía el carril con `getBoundingClientRect` en `DOMContentLoaded` + `resize` | Sin JS | El carril se duplica un número par de veces y se anima con `translate3d(-50%)`. No hay nada que medir. |
| `animation: CarouselSlider 45s` hardcodeado, con un setting `animation_time` que no se leía | `calc(var(--cauce-glow-vel) * var(--cauce-glow-items))` | El setting ahora hace algo, y las dos filas van a la misma velocidad lineal aunque tengan distinta cantidad de reseñas. |
| Estrella servida desde el CDN de otra tienda | `cauce-iconos`, icono `estrella` | Era una dependencia de red a un dominio ajeno para un SVG de 300 bytes. |
| Sin `prefers-reduced-motion` | Grilla estática, clones ocultos | Una marquesina detenida a mitad de camino deja tarjetas cortadas por el `overflow`. |
| Sin pausa | Pausa en `:hover` y `:focus-within` | Para leer una reseña hay que poder detenerla. |
| Las copias del carril repetidas en el árbol de accesibilidad | `aria-hidden` en todo lo que no sea la primera copia | Un lector de pantalla leía cada reseña N veces. |

**Contenido.** La sección ya estaba cargada desde el theme editor con 7 testimonios y sus
fotos, con el esquema del pack (bloques `Image`, settings `review_*`). Al cambiar el esquema
esos bloques habrían dejado de renderizar, así que se migraron a `resena` conservando texto,
foto y puntaje palabra por palabra, y se mantuvo la posición elegida en el editor (después de
`main`). El setting `texto` es `inline_richtext` y no `textarea` porque el contenido ya usaba
`<strong>` para el arranque de cada testimonio.

**Lo que la migración NO resuelve, y hay que resolver antes de publicar.** Los 7 textos son
exactamente lo que `docs/CLAIMS-AUDIT.md` §2 prohíbe, y son el único lugar de la tienda que
hoy afirma un beneficio: cifras de glucemia, plazos de resultado, aval de un médico, una
patología y una comparación con otro producto con efecto adverso incluido. Un testimonio no
deja de ser claim terapéutico porque lo firme un cliente (Disp. ANMAT 4980/05), y si no hay
cliente real detrás es además publicidad engañosa (Res. SC 270/2020). Se migró tal cual
porque reescribir el copy de otro no es una decisión de implementación, pero queda anotado
como bloqueante en el checklist de `CLAIMS-AUDIT.md` §6. La sección sigue soportando el caso
vacío: sin texto en ningún bloque no se renderiza y en el editor muestra un aviso.

---

## D-031 · 2026-08-25 · Rebrandeo a la brandboard v2

**Decisión.** Se aplica la paleta v2 completa. El acento pasa de BRONCE `#B98A44` a ÓXIDO
`#B03A22` en dos valores, y **el fondo dominante pasa de SEDIMENTO a BLANCO**. SEDIMENTO baja
a `colors_background_2` y queda como superficie de bloques sobre blanco, que es como lo
describe la brandboard. La tipografía no cambió entre v1 y v2, así que no se tocó.

| | v1 | v2 | Setting |
|---|---|---|---|
| Marca | TINTA `#10262A` | CAUCE `#10262A` | `colors_text` |
| Fondo dominante | SEDIMENTO `#E9E6DC` | BLANCO `#FFFFFF` | `colors_background_1` |
| Superficie | sedimento-2 `#DFDBCE` | SEDIMENTO `#E9E6DC` | `colors_background_2` |
| Acento sobre claro | BRONCE `#B98A44` | ÓXIDO `#B03A22` | `colors_accent_1` |
| Acento sobre oscuro | — | ÓXIDO CLARO `#D9603F` | sin setting |
| Secundario | VADO `#6F9BA1` | VADO `#5F99A2` | `colors_accent_2` |

---

### 1. El acento de dos valores se resuelve con tokens contextuales, no con reglas pareadas

La brandboard define el acento en dos valores según el fondo (`#B03A22` sobre claro,
`#D9603F` sobre CAUCE) y prohíbe VADO sobre SEDIMENTO. En v1 eso estaba resuelto repitiendo
cada regla dos veces: una clara y una `.color-inverse`. Con un acento de dos valores más la
prohibición de VADO, esa forma escalaba a cuatro variantes por regla.

Se reemplaza por cuatro tokens que cambian de valor según el esquema, declarados una sola vez
en el bloque 0 de `cauce-brand.css`: `--cauce-acento`, `--cauce-acento-label`, `--cauce-icono`
y `--cauce-secundario`. Diez pares de reglas colapsaron a diez reglas simples, y la prohibición
de VADO sobre SEDIMENTO dejó de ser una nota en un comentario para pasar a aplicarse sola
(`.color-background-2 { --cauce-icono: var(--cauce-vado-texto) }`).

**Efecto colateral bueno.** `--cauce-bronce-texto` y `--cauce-vado-icono` desaparecen. El
primero existía porque BRONCE daba 2.48:1 sobre SEDIMENTO; ÓXIDO da 4.84:1 y 6.04:1 sobre
blanco, así que el acento ya se usa puro, como lo dibuja la brandboard.

### 2. Revierte D-011: la etiqueta del botón vuelve a ser blanca

D-011 puso `colors_solid_button_labels` en TINTA porque blanco sobre BRONCE daba 3.10:1. Sobre
ÓXIDO, blanco da **6.04:1** y TINTA da 2.61:1: los dos números se dieron vuelta. La brandboard
además lo pide explícito ("botón, precio, texto blanco encima"). `colors_solid_button_labels`
= `#FFFFFF`.

### 3. ÓXIDO CLARO se conserva tal cual, con su límite anotado

ÓXIDO CLARO sobre CAUCE da **4.27:1**: AA para texto grande (≥2.4rem, o ≥1.87rem en negrita) y
para componentes, corto de AA para texto chico. Manteniendo matiz y croma **no existe** un
valor que llegue a 4.5:1 sobre CAUCE — se verificó barriendo la luminosidad a matiz y croma
fijos.

**Decisión tomada: se prioriza la fidelidad a la brandboard.** El hex queda intacto. Lo que se
acota es dónde puede aterrizar: sobre banda oscura el acento va en títulos, precios, datos
grandes y trazo del isotipo, todos usos donde 4.27:1 pasa. Queda anotado como LÍMITE en el
comentario de `.cauce-acento`, al lado del token, no solo acá.

**Un uso violaba ese límite y se corrigió.** El hover de los links de la barra legal es texto
de 1.3rem sobre CAUCE. Pasa a blanco (15.76:1), que además es lo correcto de marca: el óxido se
usa una vez por pieza y ese uso es el botón de compra, no un link del pie.

### 4. Shrine acopla el primer plano de los dos esquemas de acento

`base.css` trae `.color-accent-1, .color-accent-2 { --color-foreground: var(--color-base-solid-button-labels) }`.
O sea que un solo setting decide el texto sobre ÓXIDO **y** sobre VADO. Con acento de dos
valores no alcanza: blanco es el único que funciona sobre ÓXIDO (6.04:1) pero sobre VADO da
3.20:1 y no pasa.

Se separa en `cauce-brand.css` y solo para `accent-2`: `--color-foreground: var(--color-base-text)`,
o sea CAUCE sobre VADO, 4.93:1. Misma especificidad que la regla de `base.css`, gana por orden
de carga. Arrastra `--accent-color` y `--color-button`, que se derivan de él.

**Cómo se encontró.** No lo reportó `theme check` — es contraste, no sintaxis. Salió de auditar
las combinaciones *resueltas* (esquema × rol), no la paleta suelta. Sin ese paso el rebrandeo
habría dejado texto blanco a 3.20:1 en el badge de oferta y en las citas de la landing.

### 5. Las tildes de la comparativa pasan a VADO

`checkmark_bg_color` pasa de BRONCE a **VADO `#5F99A2`**, no a ÓXIDO. Con ÓXIDO habría dos
elementos en óxido en la misma página — el botón de compra y una tabla entera de tildes — y la
regla de la brandboard es un solo elemento en óxido por pieza. Con BRONCE el problema no se
notaba porque el bronce era mucho menos saturado; el óxido compite de verdad con el CTA. VADO
es el token de gráficos e íconos, y CAUCE encima da 4.93:1.

---

**Verificación.** Auditoría de contraste sobre las 5 combinaciones esquema × 4 roles + botón:
todas pasan AA salvo el acento sobre CAUCE (4.27:1, punto 3). `theme check`: 61 offenses antes
y 61 después, ninguna nueva. Render en Chrome headless de las cinco bandas con el CSS real.

**Pendiente de vos.** El setting `logo` apunta a `shopify://shop_images/05-wordmark-descriptor-tinta.png`.
El header no lo usa (renderiza `snippets/cauce-logo.liquid`, que es texto y ya toma los tokens),
pero sigue cargado en el theme editor y lo usan los metadatos sociales. Si ese PNG tiene fondo
SEDIMENTO en vez de transparente, ahora se ve como un recuadro sobre blanco: hay que resubir el
export de v2. Lo mismo con el favicon si alguna vez se sube uno; el fallback inline de
`theme.liquid` ya está en ÓXIDO.

---

## D-032 · 2026-08-25 · La firma de la reseña baja al pie y suma sello de verificación

**Decisión.** En `ss-glow-testimonial` la atribución deja de ser una etiqueta suelta al final
del párrafo. Foto, nombre y sello "Cliente verificado" pasan juntos a un `<figcaption>` al pie
de la tarjeta, y la tarjeta pasa de fila (`foto | texto`) a columna (`texto` sobre `firma`).
El sello es un setting de sección (`etiqueta_verificado`, default `Cliente verificado`) más un
checkbox por bloque (`verificado`, default sí).

**Alternativa descartada.** Dejar la foto centrada a la izquierda y colgar el sello debajo del
nombre, donde ya estaba el nombre.

**Por qué.** Cara, nombre y sello son una sola unidad de atribución: son lo que hace que la
reseña se lea como escrita por una persona y no como copy de la marca. Con la foto a la
izquierda y el nombre al final del párrafo esa unidad quedaba partida por el ancho de la
tarjeta, y el sello agregado lo empeoraba. Es además la estructura de la referencia que se usó
para pedir el cambio. `justify-content: space-between` pega la firma al borde inferior, así que
dentro de una fila todas las firmas quedan a la misma altura aunque las reseñas tengan distinto
largo — la tarjeta ya se estiraba a la más alta, antes ese espacio sobrante quedaba abajo.

**El sello no puede ir entero en VADO**, que es lo que pedía la referencia (su línea de
"Cliente Verificado" va en el color secundario). El número que importa no es el del fondo de la
sección sino el de la **superficie de la tarjeta**, que es un escalón más:

| Esquema | Superficie de la tarjeta | Color del sello | Contraste |
|---|---|---|---|
| `background-1` | SEDIMENTO `#E9E6DC` | VADO-TEXTO | 4.50:1 ✓ |
| `background-2` | SEDIMENTO-2 `#DFDBCE` | VADO-TEXTO | **4.06:1** ✗ |
| `inverse` | `#1b3033` | VADO | **4.33:1** ✗ |

Dos de los tres esquemas quedan cortos de AA para texto de 1.2rem, y `background-2` es
justamente el que usa la landing. Se separa color de peso: la **tilde** lleva el VADO
contextual y como ícono le alcanza con 3:1 (1.4.11), umbral que pasa en los tres esquemas; el
**texto** se queda en `currentColor` a `opacity: 0.85`, que es el mismo remedio del bloque 8 de
`cauce-brand.css` y da 7.75:1. La tilde es `cauce-iconos` → `chequeo`, no un glifo `✓`, así
hereda el color por contexto y no hay una fuente de emoji decidiendo cómo se ve.

**El nombre sale del mono de datos.** Pasa de `.cauce-dato` 1.1rem mayúsculas a Archivo 1.4rem
peso 600. Como etiqueta al final del párrafo el mono funcionaba; ahora encabeza la firma, y una
persona no es un dato. Archivo ya está cargada como variable `400..600`, así que el 600 es un
peso real y no un bold sintético.

**Los nombres cargados son deuda, no dato.** Tres de los siete bloques quedaron con el nombre
que la referencia muestra junto a ese mismo testimonio y esa misma cara (`margaret.png`,
`frank.png`): Margaret E., Frank D., Carol V. Los otros cuatro quedan como
`[[PENDIENTE: nombre_resena_*]]` según D-014 — son datos que no tengo, no datos que invento.
Nada de esto sale del bloqueante que ya abrió D-030: los siete textos siguen siendo los de otra
tienda. Un sello de "cliente verificado" sobre una reseña sin compra detrás es publicidad
engañosa por sí solo (Res. SC 270/2020), así que el checkbox por bloque existe para poder
apagarlo reseña por reseña, y el setting de sección vacío lo saca de toda la sección de una vez.
Anotado en el checklist de `CLAIMS-AUDIT.md` §6.

---

## D-033 · 2026-08-26 · Bloque de dolor: sección propia, no `multicolumn` con íconos

**Decisión.** Entra `sections/cauce-dolor.liquid` — foto, título con el cierre en acento,
bajada y lista de items marcados con cruz — y se instancia en `product.cauce-landing` como
`dolor`, entre la FAQ de entrada (`cauce_faq_nNHY4y`) y los pilares. El texto vive entero en
el template; el `.liquid` no tiene una sola palabra de copy.

**Alternativa descartada.** Armarlo con `multicolumn` + `icon-bar`, que es como están resueltos
`beneficios`, `explicacion` y `timeline`. Tres cosas no salen de ahí: los items serían cuatro
tarjetas en grilla y no una lista de una línea con la marca al costado; el título a dos colores
necesitaría el `title_highlight_color` de Shrine, que es un color picker donde alguien puede
cargar cualquier hex y que el bloque 3 de `cauce-brand.css` justamente neutraliza; y la imagen
quedaría como una columna más, sin control de `loading` ni de relación de aspecto.

**El acento del título es un setting aparte, no un richtext con color.** `titulo` +
`titulo_acento` se concatenan y el segundo va en `.cauce-acento`. Así el par claro/oscuro lo
resuelve el token contextual del bloque 0 y no hay un hex guardado en el JSON del template que
quede mal el día que cambie la paleta. Es la misma razón de D-031.

**El recuadro de cada item va como borde y el texto no.** Sobre CAUCE `--cauce-acento` vale
ÓXIDO CLARO, que da 4.27:1: alcanza para un componente (1.4.11) pero no para texto de 1.7rem.
El marco y la cruz llevan el acento; la frase se queda en `currentColor`. Es el mismo reparto
"color en el ícono, peso en el texto" que resolvió D-032 para el sello de verificado.

**`loading` es un setting.** La sección puede quedar arriba o abajo del pliegue según dónde la
pongan, y una imagen de 21:9 a ancho de columna es candidata a LCP. `carga_prioritaria` marca
`eager` + `fetchpriority="high"`; apagado — el default, y cómo quedó en la landing, donde la
sección es la cuarta — se queda en `lazy` para no competir con la imagen del hero.

**El `sizes` se arma en Liquid y no con `var()`.** El atributo `sizes` lo parsea el HTML, no el
CSS: una custom property ahí no resuelve y el browser descarta el media query entero, con lo
que baja siempre la variante más grande del `srcset`. Los cortes salen del padding real de
`.page-width` (1.5rem hasta 750px, 5rem después).

**En mobile la relación de aspecto tiene piso.** Un recorte 21:9 a 345px de ancho es una franja
de 148px. `min-height: 22rem` deja que `object-fit: cover` recorte a lo ancho en vez de aplastar
la escena; arriba de ese piso manda la relación elegida.

**Dos íconos nuevos en `cauce-iconos`:** `cruz` y `alerta`. Van sin recuadro — el marco lo
dibuja quien los usa — así el mismo glifo sirve suelto en una comparativa y enmarcado en esta
lista.

**El copy es un bloqueante abierto.** La sección es, por construcción, la más expuesta del
tema: una lista de síntomas arriba de un suplemento sugiere que el suplemento los resuelve
aunque ninguna línea lo diga. El texto cargado es el de la referencia y cae en eso. Está
anotado en el checklist de `CLAIMS-AUDIT.md` §6, junto con la nota de §3.3: la landing ya
venía diciendo esas cosas desde el theme editor, esta sección no lo inaugura. Vaciar título,
bajada e items apaga la sección entera sin tocar código.

