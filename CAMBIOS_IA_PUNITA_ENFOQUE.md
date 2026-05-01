# Cambios aplicados - IA punita

Archivo principal corregido: `ia_punita.html`.

## Enfoque incorporado

IA punita queda presentada como Agente Digital comercial y operativa de Interjama, no como chatbot ni como formulario genérico.

## Correcciones principales

1. Se actualizó el título, la descripción y el encabezado para posicionarla como agente digital.
2. Se modificó el primer paso para explicar recepción, criterio y derivación.
3. Se agregó una línea de flujo: Consulta -> Criterio -> Registro -> Derivación -> Análisis futuro.
4. Se cambió el paso 2 a "Criterio inicial del caso" para reforzar la clasificación comercial.
5. Se agregó el campo obligatorio "Prioridad inicial".
6. Se agregó el tipo de cliente "Despachante / Operador".
7. Se cambió el resumen final a "Caso comercial ordenado".
8. Se incorporó "Acción sugerida" según prioridad, servicio y tipo de cliente.
9. Se cambió el ID de consulta a prefijo `INT` para alinearlo con Interjama.
10. Se mejoró el mensaje de WhatsApp para que llegue como caso comercial trazable.
11. Se agregó un payload interno preparado para futura persistencia en base de datos o panel EVIN.

## Nota técnica

La persistencia real en base de datos todavía no está activada en este ZIP. El código deja el objeto de evento comercial preparado en JavaScript para conectarlo luego con un backend, Google Sheets, Supabase, Firebase o panel EVIN.

## Corrección directa a WhatsApp

- El botón `enviar formulario` ahora abre directamente WhatsApp con el mensaje armado.
- Se eliminaron del flujo visible las pantallas intermedias de resumen y derivación final.
- El flujo visible quedó en 3 pasos: recepción, criterio inicial y datos mínimos.
- Se conserva la generación de ID de consulta, fecha/hora, origen, prioridad, tipo de cliente y payload preparado para futura persistencia.
