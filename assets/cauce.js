/*
  CAUCE — comportamiento de las secciones cauce-*.
  Vanilla, sin dependencias, tres custom elements. Se carga con defer.

  Todo lo que se puede resolver en CSS o con HTML nativo esta resuelto ahi:
  los acordeones son <details>, los carruseles son scroll-snap. Este archivo
  solo cubre lo que el navegador no da gratis.
*/
(function () {
  'use strict';

  /* ----------------------------------------------------------------------
     <cauce-tabs> — patron tabs del APG: aria-selected, roving tabindex y
     navegacion por flechas. Sin JS los paneles quedan todos visibles, que es
     la degradacion correcta: se ve todo el contenido, solo sin pestanas.
     -------------------------------------------------------------------- */
  class CauceTabs extends HTMLElement {
    connectedCallback() {
      this.tabs = Array.from(this.querySelectorAll('[role="tab"]'));
      if (this.tabs.length < 2) return;

      this.panels = this.tabs.map(function (tab) {
        return document.getElementById(tab.getAttribute('aria-controls'));
      });

      this.addEventListener('click', this.onClick.bind(this));
      this.addEventListener('keydown', this.onKeydown.bind(this));
    }

    onClick(e) {
      const tab = e.target.closest('[role="tab"]');
      if (!tab) return;
      this.select(this.tabs.indexOf(tab));
    }

    onKeydown(e) {
      if (this.tabs.indexOf(document.activeElement) === -1) return;

      const last = this.tabs.length - 1;
      const i = this.tabs.indexOf(document.activeElement);
      let next = -1;

      if (e.key === 'ArrowRight') next = i === last ? 0 : i + 1;
      else if (e.key === 'ArrowLeft') next = i === 0 ? last : i - 1;
      else if (e.key === 'Home') next = 0;
      else if (e.key === 'End') next = last;
      else return;

      e.preventDefault();
      this.select(next);
      this.tabs[next].focus();
    }

    select(index) {
      if (index < 0 || index >= this.tabs.length) return;
      for (let i = 0; i < this.tabs.length; i++) {
        const on = i === index;
        this.tabs[i].setAttribute('aria-selected', String(on));
        this.tabs[i].tabIndex = on ? 0 : -1;
        if (this.panels[i]) this.panels[i].hidden = !on;
      }
    }
  }

  /* ----------------------------------------------------------------------
     <cauce-ugc> — carrusel de videos verticales.

     El scroll y el snap los hace CSS. Aca solo:
     - play / pause por tarjeta, con un solo video sonando a la vez
     - toggle de sonido, que arranca siempre silenciado
     - pausa automatica de lo que sale de pantalla, para no dejar un video
       corriendo en background comiendose la bateria
     -------------------------------------------------------------------- */
  class CauceUgc extends HTMLElement {
    connectedCallback() {
      this.videos = Array.from(this.querySelectorAll('video'));
      if (!this.videos.length) return;

      this.addEventListener('click', this.onClick.bind(this));

      this.videos.forEach(
        function (video) {
          video.addEventListener('play', this.sync.bind(this, video));
          video.addEventListener('pause', this.sync.bind(this, video));
        }.bind(this)
      );

      if ('IntersectionObserver' in window) {
        this.observer = new IntersectionObserver(
          function (entries) {
            entries.forEach(function (entry) {
              if (!entry.isIntersecting && !entry.target.paused) entry.target.pause();
            });
          },
          { threshold: 0.35 }
        );
        this.videos.forEach(
          function (v) {
            this.observer.observe(v);
          }.bind(this)
        );
      }
    }

    disconnectedCallback() {
      if (this.observer) this.observer.disconnect();
    }

    onClick(e) {
      const play = e.target.closest('.cauce-ugc__play');
      if (play) {
        const video = play.parentElement.querySelector('video');
        if (!video) return;
        if (video.paused) {
          this.pausarResto(video);
          // play() devuelve una promesa que rechaza si el navegador lo bloquea
          // (por ejemplo Low Power Mode en iOS). Sin catch queda un unhandled
          // rejection en consola por cada bloqueo.
          const p = video.play();
          if (p && typeof p.catch === 'function') p.catch(function () {});
        } else {
          video.pause();
        }
        return;
      }

      const sonido = e.target.closest('.cauce-ugc__sonido');
      if (sonido) {
        const video = sonido.parentElement.querySelector('video');
        if (!video) return;
        video.muted = !video.muted;
        sonido.setAttribute('aria-pressed', String(!video.muted));
        sonido.setAttribute(
          'aria-label',
          video.muted ? sonido.dataset.on || '' : sonido.dataset.off || ''
        );
        sonido.classList.toggle('cauce-ugc__sonido--activo', !video.muted);
      }
    }

    pausarResto(actual) {
      this.videos.forEach(function (v) {
        if (v !== actual && !v.paused) v.pause();
      });
    }

    sync(video) {
      const card = video.closest('.cauce-ugc__card');
      if (!card) return;
      const boton = card.querySelector('.cauce-ugc__play');
      card.classList.toggle('cauce-ugc__card--reproduciendo', !video.paused);
      if (boton) {
        boton.setAttribute(
          'aria-label',
          video.paused ? boton.dataset.play || '' : boton.dataset.pause || ''
        );
      }
    }
  }

  /* ----------------------------------------------------------------------
     <cauce-hero> — loop de video del hero.

     El <img> ya esta pintado y es el LCP; el video es atmosfera que se suma
     despues. Por eso nada arranca solo: el video sale con preload="none" y sin
     autoplay, y es este elemento el que decide si vale la pena bajarlo.

     No lo baja si el visitante pidio menos movimiento, si esta en ahorro de
     datos o si la conexion es 2g. Sin JS tampoco: queda el poster, que es la
     degradacion correcta porque el video no aporta informacion.

     El boton de pausa existe por WCAG 2.2.2 y aparece recien cuando el video
     efectivamente reproduce. Una pausa a mano gana siempre: el observer no
     vuelve a arrancar lo que el visitante freno.
     -------------------------------------------------------------------- */
  class CauceHero extends HTMLElement {
    connectedCallback() {
      this.video = this.querySelector('.cauce-hero__video');
      if (!this.video) return;

      this.pausadoPorUsuario = false;
      this.boton = this.querySelector('.cauce-hero__pausa');
      if (this.boton) this.boton.addEventListener('click', this.toggle.bind(this));

      this.video.addEventListener('playing', this.sync.bind(this));
      this.video.addEventListener('pause', this.sync.bind(this));

      if (this.datosCaros()) return;

      // matchMedia con listener y no un chequeo unico: si alguien activa
      // "reducir movimiento" con la pagina abierta, el loop tiene que frenar.
      this.mq = window.matchMedia('(prefers-reduced-motion: reduce)');
      this.onMq = function () {
        if (this.mq.matches) this.video.pause();
      }.bind(this);
      if (this.mq.addEventListener) this.mq.addEventListener('change', this.onMq);
      if (this.mq.matches) return;

      if (!('IntersectionObserver' in window)) {
        this.arrancar();
        return;
      }

      this.observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(
            function (entry) {
              if (entry.isIntersecting) this.arrancar();
              else if (!this.video.paused) this.video.pause();
            }.bind(this)
          );
        }.bind(this),
        { threshold: 0.2 }
      );
      this.observer.observe(this.video);
    }

    disconnectedCallback() {
      if (this.observer) this.observer.disconnect();
      if (this.mq && this.mq.removeEventListener) this.mq.removeEventListener('change', this.onMq);
    }

    // navigator.connection no existe en Safari. Sin el dato se asume que se
    // puede: el loop ya es chico y va detras del poster en la cola de descarga.
    datosCaros() {
      const con = navigator.connection;
      if (!con) return false;
      return con.saveData === true || /(^|-)2g$/.test(con.effectiveType || '');
    }

    arrancar() {
      if (this.pausadoPorUsuario) return;
      if (this.video.preload === 'none') this.video.preload = 'auto';
      // play() devuelve una promesa que rechaza si el navegador lo bloquea (por
      // ejemplo Low Power Mode en iOS). Sin catch queda un unhandled rejection.
      const p = this.video.play();
      if (p && typeof p.catch === 'function') p.catch(function () {});
    }

    toggle() {
      if (this.video.paused) {
        this.pausadoPorUsuario = false;
        this.arrancar();
      } else {
        this.pausadoPorUsuario = true;
        this.video.pause();
      }
    }

    sync() {
      const on = !this.video.paused;
      this.classList.toggle('cauce-hero__marco--reproduciendo', on);
      if (!this.boton) return;
      this.boton.hidden = false;
      this.boton.setAttribute(
        'aria-label',
        on ? this.boton.dataset.pause || '' : this.boton.dataset.play || ''
      );
    }
  }

  /* ----------------------------------------------------------------------
     Empujon de envio gratis del carrito: agrega una unidad por AJAX sin salir
     del drawer (snippets/cauce-carrito-nudge.liquid).

     No se porto el numen-cart-add.js de Numen (128 lineas de DOMParser y
     replaceWith): este tema ya expone el re-render correcto en sus propios
     custom elements, y usarlo es mas corto y no se desincroniza si Shrine
     cambia sus regiones.

       drawer -> <cart-drawer-items>.updateCart() pide las secciones cart-drawer
                 y cart-icon-bubble y llama a renderContents(data, true), que es
                 el mismo camino del update de cantidad. El "true" es "no
                 abras el drawer": ya esta abierto.
       /cart  -> <cart-items>.updateCart() re-renderiza
                 #main-cart-items .js-contents y #main-cart-footer .js-contents.

     El boton vive dentro de la region re-renderizada, asi que despues del add
     la card desaparece sola (el umbral ya esta cruzado) y no hay que resetear
     nada. Si el add falla, el mensaje va al contenedor de errores que el tema
     ya usa.
     -------------------------------------------------------------------- */
  function cauceCarritoRefrescar() {
    const objetivo =
      document.querySelector('cart-drawer-items') || document.querySelector('cart-items');
    if (objetivo && typeof objetivo.updateCart === 'function') {
      objetivo.updateCart();
      return true;
    }
    return false;
  }

  function cauceCarritoError(mensaje) {
    const caja =
      document.getElementById('CartDrawer-CartErrors') || document.getElementById('cart-errors');
    if (caja) caja.textContent = mensaje || '';
  }

  function cauceCarritoSumar(boton) {
    const id = boton.dataset.cauceSumar;
    const rutas = window.routes || {};
    if (!id || !rutas.cart_add_url) return;

    const etiqueta = boton.querySelector('.cauce-carrito__nudge-label');
    const original = etiqueta ? etiqueta.textContent : '';
    if (etiqueta && boton.dataset.cauceSumando) etiqueta.textContent = boton.dataset.cauceSumando;
    boton.setAttribute('aria-busy', 'true');
    boton.disabled = true;
    cauceCarritoError('');

    const cuerpo = new FormData();
    cuerpo.append('id', id);
    cuerpo.append('quantity', 1);

    function fallar(mensaje) {
      if (etiqueta) etiqueta.textContent = original;
      boton.removeAttribute('aria-busy');
      boton.disabled = false;
      cauceCarritoError(mensaje);
    }

    fetch(rutas.cart_add_url, {
      method: 'POST',
      headers: { 'X-Requested-With': 'XMLHttpRequest', Accept: 'application/javascript' },
      body: cuerpo,
    })
      .then(function (r) {
        return r.json();
      })
      .then(function (data) {
        // El endpoint de Shopify devuelve `status` solo cuando el add fallo
        // (sin stock, limite por pedido).
        if (data && data.status) {
          fallar(data.description || data.message || '');
          return;
        }
        if (!cauceCarritoRefrescar()) window.location.reload();
      })
      .catch(function () {
        fallar((window.cartStrings && window.cartStrings.error) || '');
      });
  }

  document.addEventListener('click', function (e) {
    const boton = e.target.closest('[data-cauce-sumar]');
    if (!boton) return;
    e.preventDefault();
    if (boton.disabled) return;
    cauceCarritoSumar(boton);
  });

  if (!customElements.get('cauce-tabs')) customElements.define('cauce-tabs', CauceTabs);
  if (!customElements.get('cauce-ugc')) customElements.define('cauce-ugc', CauceUgc);
  if (!customElements.get('cauce-hero')) customElements.define('cauce-hero', CauceHero);
})();
