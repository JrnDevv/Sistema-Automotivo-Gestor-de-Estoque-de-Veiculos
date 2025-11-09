package br.controller;

import br.model.Marca;
import br.model.Veiculo;
import br.repository.MarcaRepository;
import br.repository.VeiculoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/veiculos")
public class VeiculoController {

    @Autowired
    private VeiculoRepository repository;

    @Autowired
    private MarcaRepository marcaRepository; // precisa para corrigir marcas


    @GetMapping
    public List<Veiculo> listar() {
        return repository.findAll();
    }


    @GetMapping("/{id}")
    public ResponseEntity<Veiculo> buscarPorId(@PathVariable Long id) {
        return repository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }


    @PostMapping
    public ResponseEntity<Veiculo> cadastrar(@RequestBody Veiculo veiculo) {
        if (veiculo.getMarca() != null && veiculo.getMarca().getId() != null) {
            Marca marcaExistente = marcaRepository.findById(veiculo.getMarca().getId())
                    .orElseThrow(() -> new RuntimeException("Marca não encontrada"));
            veiculo.setMarca(marcaExistente);
        }
        Veiculo salvo = repository.save(veiculo);
        return ResponseEntity.ok(salvo);
    }


    @PutMapping("/{id}")
    public ResponseEntity<Veiculo> atualizar(@PathVariable Long id, @RequestBody Veiculo veiculo) {
        if (!repository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        veiculo.setId(id);

        if (veiculo.getMarca() != null && veiculo.getMarca().getId() != null) {
            Marca marcaExistente = marcaRepository.findById(veiculo.getMarca().getId())
                    .orElseThrow(() -> new RuntimeException("Marca não encontrada"));
            veiculo.setMarca(marcaExistente);
        }

        Veiculo atualizado = repository.save(veiculo);
        return ResponseEntity.ok(atualizado);
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        if (!repository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        repository.deleteById(id);
        return ResponseEntity.noContent().build();
    }


    @PutMapping("/corrigir-marcas")
    public ResponseEntity<Void> corrigirMarcas() {
        List<Veiculo> veiculos = repository.findAll();
        for (Veiculo v : veiculos) {
            if (v.getMarca() == null && v.getId() != null) {
                // exemplo de regra manual para corrigir
                if (v.getModelo().equalsIgnoreCase("corolla")) {
                    v.setMarca(marcaRepository.findById(1L).get());
                }
                if (v.getModelo().equalsIgnoreCase("Lancer")) {
                    v.setMarca(marcaRepository.findById(21L).get());
                }
                if (v.getModelo().equalsIgnoreCase("celta")) {
                    v.setMarca(marcaRepository.findById(6L).get());
                }
                repository.save(v);
            }
        }
        return ResponseEntity.ok().build();
    }
}
