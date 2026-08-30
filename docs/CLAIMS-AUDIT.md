# CLAIMS-AUDIT.md — auditoría de afirmaciones

Inventario de **todo texto orientado a beneficio** que publica el tema: dónde vive, con qué
redacción quedó y qué hace falta para poder sostenerlo.

Marco: CAA art. 1381 · Disp. ANMAT 4980/05 · Ley 24.240 · Res. SCI 424/2020 ·
Res. SC 270/2020 · Ley 25.326.

**Esto no es asesoramiento legal.** Es el registro de las decisiones de redacción que tomé
y de la evidencia que cada una necesita. Antes de sacar la tienda del modo contraseña
tiene que revisarlo alguien con criterio legal, con la lista de la sección 6 en la mano.

---

## 1. Regla operativa

**Ningún claim está escrito en un `.liquid`.** Todos viven en uno de tres lugares
auditables:

| Lugar | Qué contiene | Cómo se audita |
|---|---|---|
| `locales/es.json` → `cauce.*` | textos de sistema y legales | un archivo, un grep |
| `templates/*.json` y `sections/*-group.json` | copy de campaña por sección | `grep -rn` en `templates/` |
| Metafields del producto (`cauce.*`) | composición, uso, análisis | admin de Shopify, por SKU |

Consecuencia práctica: cambiar una redacción en toda la tienda es editar un archivo, y
listar todo lo que afirma la tienda es leer tres lugares. Si mañana ANMAT observa una
palabra, no hay que abrir secciones una por una.

---

## 2. Lo prohibido, y qué se puso en su lugar

| Prohibido (§3.1) | Dónde lo pedía la estructura de la referencia | Qué se hizo |
|---|---|---|
| Claim terapéutico, de prevención o de cura | hero, cards, timeline | Todo el eje argumental es **composición y trazabilidad**. La página nunca dice para qué sirve. |
| Cifras de eficacia o porcentajes de resultado | bloque de porcentajes | Reemplazado por `cauce-datos`: ficha técnica verificable contra el rótulo (bloque 7). |
| Mención o comparación con medicamentos | comparativa | La comparación es contra **mezcla racémica**, un formato, no un producto ni un fármaco. |
| Sugerir reemplazo o reducción de medicación | — | No aparece. La leyenda de suplemento y "consultá a tu médico" están en todas las páginas. |
| Testimonios con patologías, plazos o profesionales | UGC y reseñas | UGC vacío con la prohibición escrita en el editor. Reseñas `testimonials` **desactivadas**: no hay reales. **PENDIENTE:** la marquesina `ss_glow_testimonial_3jmxKc` (D-030) sí tiene 7 testimonios cargados desde el editor y los 7 caen en esta prohibición. Ver §6. |
| Sellos de aval oficial | hero | No hay ninguno. Tampoco los genéricos tipo *gluten free* o *lab tested* (regla 5 del brandboard). |
| Plazos de resultado | timeline | El bloque 12 habla de **hábito y reposición**. Título: "Una rutina, no un tratamiento". |

---

## 3. Inventario de claims

Tipo: **C** = composición · **P** = proceso o trazabilidad · **O** = origen ·
**L** = legal u operativo.

### 3.1 Se repiten en varios lugares

Estos cuatro son el eje de la marca y aparecen en home, hero y pilares. Se auditan una vez.

| # | Afirmación | Tipo | Dónde | Evidencia que necesita |
|---|---|---|---|---|
| A1 | Isómero R puro, sin mezcla racémica | C | home, hero, pilares, datos, comparativa | COA que declare identidad R |
| A2 | 600 mg por cápsula | C | home, hero, pilares, datos, cards | COA con contenido por unidad |
| A3 | Analizado por laboratorio externo, por lote | P | home, hero, pilares, cards, comparativa, FAQ | COA por lote, de un tercero, **publicado** |
| A4 | Producción nacional | O | home, hero, pilares, datos, marquee | RNE del elaborador |

> **A3 es el más exigente.** La página no dice "analizamos", dice que el certificado **se
> publica** y que el lote del certificado **coincide con el del envase**. Eso obliga a un
> proceso, no a un documento suelto. Si no se va a publicar por lote, hay que bajar la
> redacción a "cada lote se analiza" y sacar la promesa de publicación de cuatro lugares.

### 3.2 Específicos por sección

| # | Afirmación | Tipo | Dónde | Evidencia |
|---|---|---|---|---|
| B1 | Sin mezclas propietarias, en ningún SKU | C | home (manifiesto), detalle | Compromiso de marca. Aplica al roadmap completo. |
| B2 | Un solo activo, excipientes declarados | C | cards, detalle | Rótulo |
| B3 | La materia prima llega con su propio certificado | P | cards | Certificado del proveedor |
| B4 | Trazabilidad de lote | P | pilares, comparativa | Registro interno de lotes |
| B5 | El ácido alfa lipoico se describió en la década del cincuenta | — | explicación | Histórico verificable (aislado en 1951) |
| B6 | Sintetizado da mezcla R/S en partes iguales; el R es el natural | C | explicación, comparativa | Química básica, no controvertido |
| B7 | Separar los isómeros encarece la producción | — | explicación | Afirmación de mercado, razonable |
| B8 | 10 días de arrepentimiento, sin costo, sin motivo | L | hero, banda, garantía, FAQ, legal, página propia | Res. SCI 424/2020 |
| B9 | Pago procesado por Mercado Pago; no guardamos datos de tarjeta | L | banda | Cierto con MP. Revisar si se suma otro medio. |
| B10 | Un frasco cubre un mes de uso diario | C | rutina | Depende de `cauce.dosis_diaria` |

### 3.3 Lo que la página deliberadamente **no** dice

Vale registrarlo: la ausencia es una decisión, no un olvido.

- Para qué sirve el ácido alfa lipoico.
- Cualquier mención a glucemia, neuropatía, nervios, energía, antioxidación o metabolismo.
- Cuánto tarda en "hacer efecto".
- Comparaciones con marcas o con medicamentos.
- Cantidad de clientes, unidades vendidas o reseñas.

> **Esta lista dejó de ser cierta.** Se escribió cuando el copy de la landing salía entero
> de este repo. Desde entonces el template `product.cauce-landing` se editó desde el theme
> editor y hoy contradice cuatro de los cinco puntos: la descripción del producto habla de
> "sacar el azúcar de la sangre", "energía estable" y "protección antioxidante"; una FAQ
> promete resultados "en 3 a 5 semanas"; otra compara con la berberina; el bloque de reseñas
> declara "1574+ Reseñas" y 4.8 de calificación. La sección `dolor` (D-033) se suma a eso, no
> lo inaugura. **La lista queda como estaba a propósito**: es el estado al que hay que volver
> si la revisión legal decide sostener el criterio original. Lo que hay que auditar hoy es el
> template, no este documento.

---

## 4. Claims que se descartaron, y por qué

| Lo que pedía el brief o la referencia | Por qué no se puso | Qué ocupa su lugar |
|---|---|---|
| Bloque de porcentajes de resultado | Cifra de eficacia | `cauce-datos`, ficha técnica (bloque 7) |

> **La primera fila volvió.** Desde el theme editor se cargó un bloque de porcentajes de
> encuesta (88 / 91 / 90) que hoy vive en `cauce-landing` como la sección `resultados`. La
> decisión de descartarlo sigue siendo la correcta mientras no exista la encuesta detrás: el
> bloqueante está abierto en §6 y la sección se puede vaciar desde el editor. Ver D-037.
| Card de **biodisponibilidad** | "Se absorbe mejor" es eficacia comparativa, y el COA no lo dice | Card "Origen del ingrediente" (D-021) |
| Badge "el más elegido" en el escalón de 2 | Dato de comportamiento que no tenemos | Sin badge |
| `AggregateRating` en el JSON-LD | No hay reseñas reales | No se emite (D-006) |
| Reseñas de clientes | Ídem | Sección desactivada (D-019) |
| Sellos *gluten free* / *lab tested* | Regla 5 del brandboard y sellos sin certificación | Nada |

---

## 5. Riesgos abiertos — **bloqueantes para publicar**

### R1 · Las imágenes del producto son de otra marca y llevan claims

Las cinco imágenes cargadas en Shopify son de **Noverly** y tienen impreso:

- *"Apoyo Para un Azúcar Saludable"* y *"Apoya el Metabolismo de la Glucosa"*
- *"Energía Estable Todo el Día"*, *"NERVE HEALTH"*, *"ANTIOXIDANT SUPPORT"*, *"CELLULAR PROTECTION"*
- Sellos *GMO FREE / GLUTEN FREE / LAB TESTED*
- Un badge *"COMPRA 1 LLEVA 1 GRATIS — Sale ends soon"*

Los dos primeros grupos son claim terapéutico bajo Disp. ANMAT 4980/05; la §3.1 aplica
**también a imágenes y alt**. El badge de oferta es una promoción que no existe en ningún
descuento configurado y contradice el selector de 1/2/3 frascos (Ley 24.240 art. 7 y 8).
Y la marca visible es de un tercero.

**Toda la copy de esta página evita esos claims y las imágenes los dicen igual, en cuerpo 40.**
No hay redacción que compense eso. Se reemplazan las cinco.

### R2 · El JSON-LD publica "Vitalab" como marca

El tema emite `Product` con `"brand": product.vendor`, y el proveedor del producto en
Shopify es **Vitalab**. Google recibe una marca que no es la nuestra. Se arregla en el
admin del producto, campo Proveedor → `CAUCE`. No es un cambio de tema.

### R3 · La descripción del producto entra al JSON-LD aunque no se vea

Hoy está **vacía**, así que no hay riesgo actual. Pero el tema la emite en
`"description"` del `Product` aunque ninguna sección de la landing la muestre: cualquier
texto que se escriba ahí se publica como dato estructurado sin pasar por la página. Regla:
lo que vaya en ese campo se audita igual que el resto.

### R4 · Metafields de categoría de Shopify

El producto tiene 12 metacampos de la taxonomía estándar, entre ellos **"Enfoque de salud
del suplemento"** y "Uso nutricional". Shopify los usa para feeds y filtros. Si se
completan con un enfoque de salud, se está publicando un claim por un canal que no pasa por
el tema. Dejarlos vacíos o revisarlos uno por uno.

### R5 · La tabla comparativa es la sección de mayor exposición

`comparison-table` marca cruces en la columna "Suplemento genérico". Está redactada para no
nombrar marcas ni medicamentos, y tiene una aclaración al pie de que compara contra la
mezcla racémica como categoría. Aun así es publicidad comparativa y le corresponde el
estándar de veracidad y verificabilidad de la Ley 24.240. **Es la sección que primero le
mostraría a un abogado.** Si hay dudas, las filas 1 y 2 (que son verdaderas por definición
química) se sostienen solas; las filas 3 a 6 son las discutibles.

### R6 · Los escalones de cantidad son solo display

Ya está en D-017 y se repite acá porque es legal, no de UX: el precio de los escalones lo
calcula el tema, pero el descuento real lo tiene que aplicar un **descuento automático de
Shopify** con las mismas cantidades. Si no coinciden, la PDP muestra un precio y el carrito
cobra otro.

### R7 · El producto no tiene asignado el template — **CERRADO 2026-08-29**

Figuraba con "Producto predeterminado" y la landing solo se veía agregando
`?view=cauce-landing` a la URL. La plantilla ya está asignada en el admin del producto
(panel Plantilla de tema → `cauce-landing`), así que los tres CTA de la home quedaron con el
link limpio `/products/<handle>` (ver D-038 y D-042).

---

## 6. Checklist antes de publicar

**Contenido**

- [ ] R1 · Reemplazar las cinco imágenes del producto por fotos propias sin claims ni sellos
- [ ] R2 · Proveedor del producto = CAUCE
- [x] R7 · Plantilla del producto = `cauce-landing` — cerrado 2026-08-29
- [ ] R4 · Revisar los 12 metacampos de categoría, en especial "Enfoque de salud"
- [ ] Cargar los metafields `cauce.*` con transcripción textual del rótulo

**Evidencia documental**

- [ ] A1, A2 · COA con identidad R y contenido por cápsula
- [ ] A3 · Definir el proceso de publicación del COA **por lote**, o bajar la redacción
- [ ] A4 · RNE del elaborador
- [ ] B3 · Certificado de la materia prima
- [ ] RNPA/RNE del producto en `settings.cauce_rnpa`

**Legales de la tienda**

- [ ] Razón social, CUIT, domicilio, email y teléfono en Configuración → CAUCE
- [ ] URL del formulario de arrepentimiento (la página `page.arrepentimiento` ya existe)
- [ ] Imagen y URL de Data Fiscal AFIP
- [ ] Redactar las cuatro políticas en Configuración → Políticas (el footer las muestra solo si existen)
- [ ] R6 · Descuentos automáticos que coincidan con los escalones, o poner los escalones en 0

**Revisión**

- [ ] **BLOQUEANTE · Los 7 testimonios de `ss_glow_testimonial_3jmxKc`.** Es el único
      lugar de la tienda que hoy afirma un beneficio. Entre los siete dicen: cifras de
      glucemia ("amanezco con 90 y 92", "atascado en los 110"), plazos de resultado
      ("seis semanas", "ocho semanas"), aval de un profesional ("mi doctor se
      sorprendió"), patología ("la diabetes de mi papá"), y comparación con otro
      producto más efecto adverso ("la berberina me destrozó el estómago"). Cada uno
      es claim terapéutico bajo Disp. ANMAT 4980/05 aunque lo firme un cliente, y si
      no hay clientes reales detrás es además Res. SC 270/2020. Reescribir o quitar.
- [ ] Verificar que existan la persona y el consentimiento detrás de cada testimonio
      que quede, y que la foto sea de quien lo firma
- [ ] **BLOQUEANTE · La sección `dolor` de `cauce-landing` (D-033).** Es una lista de
      síntomas puesta arriba de un suplemento: "un número matutino que no baja",
      "bajones de energía y antojos de azúcar en la tarde", "peso terco alrededor del
      abdomen", "esa sensación de «¿sigo yo?» en cada análisis", y una bajada que dice
      que la comida moderna quita "el compuesto que tu cuerpo usa para limpiar el
      azúcar de la sangre". Ninguna línea afirma que el producto lo resuelva, pero la
      yuxtaposición lo sugiere, que es lo que Disp. ANMAT 4980/05 mira. Contradice
      además el §3.3 de este documento (glucemia, energía y metabolismo estaban en la
      lista de lo que la página deliberadamente no decía). Aprobar con criterio legal,
      reescribir sin síntoma, o quitar la sección. La sección se puede vaciar entera
      desde el editor sin tocar código: sin título, bajada ni items no renderiza nada.
- [ ] **BLOQUEANTE · La sección `solucion` de `cauce-landing` (D-034).** Las cuatro
      etiquetas de la grilla —"Azúcar Saludable", "Energía Estable", "Metabolismo de
      Glucosa", "Apoyo Antioxidante"— son la traducción literal de los claims impresos
      en las imágenes de Noverly que R1 manda reemplazar. Pasarlos de la foto al HTML no
      los cambia: son funciones atribuidas al producto (Disp. ANMAT 4980/05). Se suman la
      bajada, que describe el mecanismo ("ayuda a sacar el azúcar de la sangre y llevarlo
      a los músculos"), y la volanta "La molécula alemana", que es un claim de origen y
      necesita el certificado de materia prima de A4/B3. Es la sección que dice más cosas
      por metro cuadrado de toda la landing. Aprobar con criterio legal, reescribir con
      funciones respaldables, o quitarla. Se vacía entera desde el editor sin tocar
      código: sin título, bajada, ítems ni imagen no renderiza nada.
- [ ] **BLOQUEANTE · La sección `etapas` de `cauce-landing` (D-035).** Es el caso más
      directo de los tres bloques nuevos. Dibuja una progresión en el tiempo con
      valores de laboratorio ("108. Luego 112"), síntomas por etapa y un final que es
      una consulta médica y una mención a medicamentos ("la cita que tanto temías — la
      de los medicamentos"). Puesta en la página de un suplemento, la secuencia dice sin
      decirlo que el suplemento la frena: es el tipo de sugerencia que mira la Disp.
      ANMAT 4980/05, y la mención a medicamentos suma el problema de comparar con un
      tratamiento. Contradice el §3.3 igual que `dolor`. Aprobar con criterio legal,
      reescribir sin valores ni medicamentos, o quitarla. Se vacía entera desde el
      editor sin tocar código: sin título de sección ni etapas no renderiza nada.
- [ ] **BLOQUEANTE · La sección `progreso` de `cauce-landing` (D-036).** Es el más
      grave de los cuatro bloques nuevos, porque no describe una situación: promete un
      resultado y le pone fecha. "Semana 5–8: El Número se Mueve", "Semana 3–4: energía
      más estable en la tarde, menos antojos", "Semana 9–12+: protección antioxidante
      para las células". Un suplemento dietario no puede afirmar un efecto, y menos con
      cronograma (Disp. ANMAT 4980/05); el §3.3 listaba "cuánto tarda en hacer efecto"
      como algo que la página deliberadamente no decía. Aparte, los tres asteriscos del
      texto no remiten a ninguna nota al pie: una remisión a nada es un problema por sí
      sola (Ley 24.240 art. 4), y se arregla llenando el campo "Texto al pie" o sacando
      los asteriscos. Aprobar con criterio legal, reescribir la sección como **rutina**
      (cómo se toma, con qué comida, cuánto dura el frasco) en vez de como resultado, o
      quitarla. Se vacía entera desde el editor sin tocar código.
- [ ] **BLOQUEANTE · La sección `resultados` de `cauce-landing` (D-037).** Es el
      bloqueante más grave del tema, por encima de `progreso`. Publica tres cifras de
      eficacia —88 % mejores números matutinos, 91 % energía más pareja, 90 % más en
      control— atribuidas a una encuesta propia. Un porcentaje de resultado es
      publicidad verificable: hay que poder mostrar el cuestionario, el universo, las
      fechas y la pregunta textual (Res. SC 270/2020 y Ley 24.240 art. 8), y encima
      recae sobre una función fisiológica, que es Disp. ANMAT 4980/05. Contradice
      además el §4 de este documento, donde un "bloque de porcentajes de resultado" ya
      figuraba como descartado por ser cifra de eficacia. **Si la encuesta no existe,
      no hay redacción que arregle esto: las cifras se sacan.** Los tres
      `[[PENDIENTE: ...]]` del campo "Metodología de la encuesta" y de la volanta
      marcan exactamente qué falta. La alternativa que ocupa el mismo lugar sin
      depender de nadie son las cifras del rótulo y del COA: 600 mg por cápsula, 30
      días de frasco, días de garantía.
- [ ] **BLOQUEANTE · Los cuatro `collapsible_tab` de `main-product` en `cauce-landing`.**
      No estaban en este checklist y son la fuente más explícita del tema, porque son
      copy de referencia que nunca se reescribió. `collapsible_tab_VtLRkn` se titula
      "Beneficios clínicamente comprobados" y lista cinco funciones atribuidas al
      producto ("Favorece la función nerviosa saludable", "Ayuda a mantener niveles
      saludables de azúcar en sangre dentro del rango normal", "apoyo antioxidante para
      la salud celular"). `collapsible_tab_FCtjKz` describe síntomas ("te arden los
      pies, no puedes dormir"), compara con medicamentos ("cansado de medicamentos que
      te hacen sentir como un zombi mientras tus nervios se van muriendo") y afirma que
      el compuesto "se utiliza en Alemania como tratamiento con receta para la
      neuropatía diabética desde 1966" — patología con nombre y equiparación con un
      medicamento de venta bajo receta. `collapsible_tab_6yhWGL` pone plazos de
      resultado ("entre 3 y 5 semanas", "2 o 3 meses"). `collapsible_tab_aqXdqx` mezcla
      la posología real con tres funciones y una promesa de resultado ("dormir mejor,
      moverse con confianza y pensar con claridad"). Los seis problemas que este
      documento persigue —función atribuida, patología, plazo, comparación con
      medicamento, aval clínico y síntoma— están los seis acá. Reescribir con la
      transcripción del rótulo o vaciar los cuatro bloques. Los otros dos acordeones del
      mismo bloque, `acordeon_envios` y `acordeon_garantia`, ya están reescritos y se
      quedan como están.
- [ ] **BLOQUEANTE · La FAQ de entrada `cauce_faq_nNHY4y` de `cauce-landing`.** Tampoco
      estaba listada. Cinco preguntas de copy de referencia sin auditar: "¿Cuándo veré
      resultados?" responde con un plazo ("un cambio en 3 a 5 semanas, con beneficio
      completo en 2 a 3 meses"), la comparación con la berberina describe mecanismos de
      acción ("ayuda a llevar el azúcar al músculo"), y la última repite el bloque
      entero de claims de la referencia ("apoyando un azúcar saludable dentro del rango
      normal, energía estable todo el día y protección antioxidante") **junto con el
      nombre de la marca de referencia, "Noverly", que quedó en el texto publicado**.
      Agrava el caso que la sección tiene `emitir_schema: true`: las cinco preguntas se
      publican además como datos estructurados `FAQPage`, o sea que los claims van al
      índice de Google en formato declarado por la marca. La FAQ de cierre de la misma
      página (`faq`) ya está reescrita y sirve de modelo. Reescribir con preguntas de
      compra, o vaciar la sección desde el editor.
- [ ] **El sello "Cliente verificado"** de `ss_glow_testimonial_3jmxKc` (D-032). Decir
      verificado sin poder probar la compra es Res. SC 270/2020 por sí solo, aparte de lo
      que diga el texto. Destildar `verificado` en cada reseña que no tenga pedido detrás,
      o vaciar `etiqueta_verificado` para sacarlo de toda la sección.
- [ ] Los cuatro `[[PENDIENTE: nombre_resena_*]]` del mismo bloque, y confirmar que
      Margaret E., Frank D. y Carol V. corresponden a personas reales o reemplazarlos
- [ ] R5 · Tabla comparativa revisada con criterio legal
- [ ] Leer `docs/COPY-DRAFT.md` completo y aprobar o corregir cada texto
- [ ] Confirmar que ninguna imagen nueva, alt o metafield introduce un claim

---

## 7. Cómo auditar de nuevo

```bash
# Todo el copy de campaña
grep -rn "PENDIENTE" templates/ sections/*-group.json snippets/

# Los textos de sistema y legales
python -c "import json;print(json.dumps(json.load(open('locales/es.json',encoding='utf-8'))['cauce'],ensure_ascii=False,indent=2))"

# Buscar palabras prohibidas en todo el tema
grep -rniE "cura|trata|previene|alivia|reduce el|mejora la|neuropat|glucem|diabet|gabapentin|pregabalin|dolor|ansiedad" \
  templates/ sections/cauce-*.liquid sections/*-group.json locales/es.json
```

Resultado esperado hoy: **tres coincidencias, las tres inocuas**.

| Coincidencia | Por qué está bien |
|---|---|
| `product.cauce-landing.json` → "Una rutina, no un **tratamiento**" | Es una negación. Dice explícitamente que el producto no es un tratamiento, que es justo lo que hay que decir. |
| `cauce-newsletter.liquid` ×2 → "**trata**r datos personales" | Comentario de código sobre Ley 25.326, no es texto de storefront. |

Cualquier cuarta coincidencia hay que mirarla. Si aparece en `templates/` o en
`locales/es.json` fuera de esas tres, es un claim que se coló.
