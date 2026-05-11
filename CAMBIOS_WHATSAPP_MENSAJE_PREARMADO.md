# Corrección WhatsApp - mensaje prearmado

Se reemplazó el enlace corto `wa.me` por `api.whatsapp.com/send` para mejorar la apertura del mensaje prearmado en WhatsApp Desktop/Windows.

Archivos corregidos:

- `ia_punita.html`
- `bandeja_consultas.html`

Cambio aplicado:

```text
https://api.whatsapp.com/send?phone=NUMERO&text=MENSAJE&type=phone_number&app_absent=0
```

Además, el formulario abre WhatsApp en una nueva pestaña mediante `window.open`. Si el navegador bloquea la apertura, usa `window.location.href` como respaldo.

El número debe mantenerse en formato internacional, sin `+`, espacios, guiones ni paréntesis.

Ejemplo Argentina/Jujuy:

```text
5493881234567
```
