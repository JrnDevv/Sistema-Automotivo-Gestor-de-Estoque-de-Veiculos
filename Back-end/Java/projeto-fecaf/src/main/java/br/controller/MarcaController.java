package br.controller;

import br.model.Marca;
import br.model.Veiculo;
import br.repository.MarcaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/marcas")
@CrossOrigin(origins = "*")

public class MarcaController {
    @Autowired
    private MarcaRepository repository;

    @GetMapping
    public List<Marca> listar() {
        return repository.findAll();
    }

    @PostMapping
    public Marca cadastrar(@RequestBody Marca marca) {
        return repository.save(marca);
    }

    @PutMapping("/{id}")
    public Marca atualizar(@PathVariable Long id, @RequestBody Marca marca) {
        marca.setId(id);
        return repository.save(marca);
    }

    @DeleteMapping("/{id}")
    public void deletar (@PathVariable Long id) {
        repository.deleteById(id);
    }

}
