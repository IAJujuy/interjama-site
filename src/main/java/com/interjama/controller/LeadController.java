package com.interjama.controller;

import com.interjama.dto.LeadRequest;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.Locale;
import java.util.Map;

@RestController
@RequestMapping("/api/leads")
public class LeadController {

    @GetMapping
    public Map<String, Object> info() {
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("mensaje", "Endpoint de leads activo");
        response.put("metodo_soportado", "POST");
        response.put("ruta", "/api/leads");

        Map<String, String> ejemplo = new LinkedHashMap<>();
        ejemplo.put("categoria", "bascula");
        ejemplo.put("nombre", "Juan Pablo");
        ejemplo.put("necesidad", "Necesito automatizar la captura de peso");
        ejemplo.put("telefono", "+5493883292812");

        response.put("ejemplo_body_json", ejemplo);
        return response;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Map<String, Object> crearLead(@Valid @RequestBody LeadRequest request) {
        Map<String, Object> response = new LinkedHashMap<>();

        String categoriaNormalizada = request.getCategoria().trim().toLowerCase(Locale.ROOT);
        String orientacion;
        String accionSugerida;

        switch (categoriaNormalizada) {
            case "logistica":
                orientacion = "Consulta orientada a servicios logísticos y operación en Paso de Jama.";
                accionSugerida = "Derivar a contacto comercial de Interjama.";
                break;
            case "bascula":
                orientacion = "Consulta orientada a báscula, pesaje y posible automatización de lectura.";
                accionSugerida = "Relevar indicador, conectividad y flujo operativo actual.";
                break;
            case "trazabilidad":
                orientacion = "Consulta orientada a trazabilidad, control operativo y evidencia.";
                accionSugerida = "Analizar necesidad compatible con enfoque EVIN/GEA.";
                break;
            case "web-app":
                orientacion = "Consulta orientada a desarrollo web, app o digitalización operativa.";
                accionSugerida = "Programar relevamiento funcional inicial.";
                break;
            case "comercial":
                orientacion = "Consulta orientada a contacto comercial general.";
                accionSugerida = "Responder y derivar a conversación directa.";
                break;
            default:
                orientacion = "Consulta general recibida.";
                accionSugerida = "Revisión manual y clasificación posterior.";
                break;
        }

        response.put("mensaje", "Lead recibido correctamente");
        response.put("categoria", request.getCategoria());
        response.put("nombre", request.getNombre());
        response.put("necesidad", request.getNecesidad());
        response.put("telefono", request.getTelefono());
        response.put("orientacion", orientacion);
        response.put("accionSugerida", accionSugerida);
        response.put("estado", "OK");

        return response;
    }
}