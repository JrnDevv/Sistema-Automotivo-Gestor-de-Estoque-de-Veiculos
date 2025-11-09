package br.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class ViewController {

    @GetMapping("/")
    public String home() {
        return "redirect:/index.html"; // redireciona para o index.html dentro de static
    }

    @GetMapping("/cadastro")
    public String cadastro() {
        return "redirect:/cadastro.html"; // redireciona para cadastro.html
    }

    @GetMapping("/editar")
    public String editar() {
        return "redirect:/editar.html"; // redireciona para editar.html
    }
}
