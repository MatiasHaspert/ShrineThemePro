# METAFIELDS.md — namespace `cauce`

Todo el contenido que **cambia por SKU** vive acá, no en el template. Es lo que hace
que lanzar un producto nuevo sea *duplicar el template + cargar metafields*, sin abrir
un `.liquid`.

Regla de diseño: **si un campo no tendría sentido para un shampoo, está mal
parametrizado.** Por eso no hay ningún metafield que diga "cápsula": hay
`unidades_envase` + `unidad` y el sustantivo lo pone el producto.

Todos los metafields son **opcionales**. Si falta uno, la pieza que lo consume no
renderiza — nunca renderiza vacía ni inventa un valor.

---

## 1. Definiciones

| Clave | Tipo | Obligatorio para | Ejemplo (R-ALA 600) |
|---|---|---|---|
| `cauce.unidades_envase` | `number_integer` | duración del suministro | `30` |
| `cauce.dosis_diaria` | `number_integer` | duración del suministro | `1` |
| `cauce.unidad` | `single_line_text_field` | textos de formato | `cápsula` |
| `cauce.formato` | `single_line_text_field` | ficha y datos duros | `30 cápsulas` |
| `cauce.composicion` | `rich_text_field` | acordeón Composición | tabla de ingredientes |
| `cauce.modo_uso` | `rich_text_field` | acordeón Modo de uso | `1 cápsula por día…` |
| `cauce.analisis` | `rich_text_field` | acordeón Análisis | lote, laboratorio, fecha |
| `cauce.beneficios` | `rich_text_field` | acordeón de detalle (fase 4) | — |
| `cauce.faq` | `list.metaobject_reference` | FAQ de la PDP (fase 5) | — |

### Quién consume qué

| Metafield | Consumido por |
|---|---|
| `unidades_envase`, `dosis_diaria` | `snippets/cauce-duracion.liquid` → token `[duracion]` en los escalones de cantidad |
| `composicion` | bloque `acordeon_composicion` de `templates/product.cauce-landing.json` |
| `modo_uso` | bloque `acordeon_modo_uso` |
| `analisis` | bloque `acordeon_analisis` |
| `unidad`, `formato` | `cauce-datos` (fase 4) |
| `beneficios` | `cauce-acordeon-detalle` (fase 4) |
| `faq` | `cauce-faq` (fase 5) |

---

## 2. Cómo se calcula la duración del suministro

```
días = (unidades_envase × cantidad_comprada) ÷ dosis_diaria
```

División entera, redondea para abajo. Para el R-ALA: 30 ÷ 1 = **30 días** por frasco,
60 por dos, 90 por tres. Para gomitas de 60 con dosis 2/día también da 30. Para un
shampoo de 45 usos con "dosis" 1 da 45.

**Si falta cualquiera de los dos números, el token `[duracion]` se reemplaza por vacío
y el renglón no se muestra.** Nunca se muestra un "0 días".

El texto sale de `locales/es.default.json → cauce.pdp.duracion_dias`. La unidad de
tiempo no está escrita en ningún `.liquid`.

---

## 3. Crearlos

### Opción A — Admin (sin herramientas)

`Configuración → Metacampos y metaobjetos → Productos → Agregar definición`

Para cada fila de la tabla: nombre a gusto, **espacio de nombres y clave** exactamente
como figura en la columna *Clave* (por ejemplo espacio `cauce`, clave `unidades_envase`),
y el tipo de la tabla. Dejalos todos sin marcar como obligatorios.

### Opción B — GraphQL Admin API

Una sola llamada por definición. Reemplazá `TIPO` y `CLAVE` según la tabla.

```graphql
mutation CrearDefinicion($def: MetafieldDefinitionInput!) {
  metafieldDefinitionCreate(definition: $def) {
    createdDefinition { id name key namespace }
    userErrors { field message code }
  }
}
```

Variables, una por definición:

```json
{ "def": { "name": "Unidades por envase", "namespace": "cauce", "key": "unidades_envase",
           "type": "number_integer", "ownerType": "PRODUCT",
           "description": "Cuantas unidades trae un envase. Se usa para calcular la duracion del suministro." } }
{ "def": { "name": "Dosis diaria", "namespace": "cauce", "key": "dosis_diaria",
           "type": "number_integer", "ownerType": "PRODUCT",
           "description": "Unidades que se consumen por dia." } }
{ "def": { "name": "Unidad", "namespace": "cauce", "key": "unidad",
           "type": "single_line_text_field", "ownerType": "PRODUCT",
           "description": "Sustantivo en singular: capsula, gomita, sobre, uso." } }
{ "def": { "name": "Formato", "namespace": "cauce", "key": "formato",
           "type": "single_line_text_field", "ownerType": "PRODUCT",
           "description": "Como se describe el envase. Ej: 30 capsulas." } }
{ "def": { "name": "Composicion", "namespace": "cauce", "key": "composicion",
           "type": "rich_text_field", "ownerType": "PRODUCT" } }
{ "def": { "name": "Modo de uso", "namespace": "cauce", "key": "modo_uso",
           "type": "rich_text_field", "ownerType": "PRODUCT" } }
{ "def": { "name": "Analisis de laboratorio", "namespace": "cauce", "key": "analisis",
           "type": "rich_text_field", "ownerType": "PRODUCT" } }
{ "def": { "name": "Beneficios", "namespace": "cauce", "key": "beneficios",
           "type": "rich_text_field", "ownerType": "PRODUCT" } }
```

`cauce.faq` se define recién en la fase 5, junto con el metaobjeto de pregunta y
respuesta que referencia.

---

## 4. Contenido a cargar en el primer SKU

Pendiente de datos reales. Lo que sigue es la forma esperada, no contenido aprobado:

| Metafield | Estado |
|---|---|
| `unidades_envase` | `30` — confirmado por el formato del producto |
| `dosis_diaria` | **PENDIENTE** — depende de la posología de etiqueta aprobada |
| `unidad` | `cápsula` |
| `formato` | `30 cápsulas` |
| `composicion` | **PENDIENTE** — copiar textual de la etiqueta / RNPA |
| `modo_uso` | **PENDIENTE** — copiar textual de la etiqueta |
| `analisis` | **PENDIENTE** — número de lote, laboratorio y fecha del COA |

Ninguno de estos textos se puede redactar desde el marketing: son los que tienen que
coincidir con el rótulo declarado. Ver `docs/CLAIMS-AUDIT.md`.
