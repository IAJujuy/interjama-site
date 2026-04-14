package com.interjama.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class LeadRequest {

    @NotBlank(message = "La categoría es obligatoria")
    @Size(max = 100, message = "La categoría no puede superar los 100 caracteres")
    private String categoria;

    @NotBlank(message = "El nombre es obligatorio")
    @Size(max = 100, message = "El nombre no puede superar los 100 caracteres")
    private String nombre;

    @NotBlank(message = "La necesidad es obligatoria")
    @Size(max = 300, message = "La necesidad no puede superar los 300 caracteres")
    private String necesidad;

    @Size(max = 50, message = "El teléfono no puede superar los 50 caracteres")
    private String telefono;

    public LeadRequest() {
    }

    public LeadRequest(String categoria, String nombre, String necesidad, String telefono) {
        this.categoria = categoria;
        this.nombre = nombre;
        this.necesidad = necesidad;
        this.telefono = telefono;
    }

    public String getCategoria() {
        return categoria;
    }

    public void setCategoria(String categoria) {
        this.categoria = categoria;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getNecesidad() {
        return necesidad;
    }

    public void setNecesidad(String necesidad) {
        this.necesidad = necesidad;
    }

    public String getTelefono() {
        return telefono;
    }

    public void setTelefono(String telefono) {
        this.telefono = telefono;
    }
}