# INTERJAMA - Ajuste de colores y formulario funcional

Versión de cierre visual alineada al logo oficial azul/gris de INTERJAMA.

## Cambios aplicados

1. Paleta general ajustada a tonos fríos del logo oficial:
   - fondo principal: `#edf1f3`
   - superficies: `#fbfcfd`
   - títulos/acento: `#6f8096`
   - botones principales: `#7a8da3`
   - líneas: `#b9c3ce`

2. Se eliminó la dominante roja/beige que no correspondía al logo oficial elegido.

3. `asesores.html` dejó de mostrar la imagen estática `formulario_contacto.jpg` como si fuera formulario.

4. Se incorporó un formulario real y funcional en `asesores.html`.

5. El formulario arma un mensaje y abre WhatsApp dirigido al número operativo:
   `+54 9 388 5927238`.

6. Se creó el archivo:
   `contacto-interjama.js`.

7. Se actualizó el número de WhatsApp en `ia_punita.html` para que apunte también a:
   `5493885927238`.

8. Se redujo visualmente la altura de la imagen de infraestructura en `asesores.html`, para que la página no quede dominada por una foto gigante antes de llegar al contacto.

## Archivos principales modificados

- `style.css`
- `asesores.html`
- `asesores.css`
- `contacto-interjama.js`
- `agente-transporte.css`
- `servicios-internos.css`
- `ia_punita.html`
- `bandeja_consultas.html`

## Funcionamiento del formulario

El sitio puede seguir funcionando como sitio estático. No requiere Spring Boot para esta versión.

Al presionar **enviar por WhatsApp**, el navegador abre WhatsApp con un mensaje prearmado que incluye:

- nombre
- empresa u organismo
- tipo de consulta
- teléfono de contacto
- detalle breve
- zona operativa

