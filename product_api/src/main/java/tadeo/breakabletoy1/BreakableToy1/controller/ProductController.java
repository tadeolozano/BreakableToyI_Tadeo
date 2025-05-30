package tadeo.breakabletoy1.BreakableToy1.controller;

import tadeo.breakabletoy1.BreakableToy1.model.Product;
import tadeo.breakabletoy1.BreakableToy1.service.ProductService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/products")
@CrossOrigin(origins = "http://localhost:8080") // permite peticiones desde el front
public class ProductController {
    private final ProductService service = new ProductService();

    @GetMapping
    public List<Product> getProducts(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) Boolean inStock,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "100") int size,
            @RequestParam(defaultValue = "name") String sortBy
    ) {
        return service.getProducts(name, category, inStock, sortBy, page, size);
    }

    @PostMapping
    public Product createProduct(@RequestBody Product product) {
        return service.createProduct(product);
    }

    @PutMapping("/{id}")
    public Optional<Product> updateProduct(@PathVariable UUID id, @RequestBody Product product) {
        return service.updateProduct(id, product);
    }

    @PostMapping("/{id}/outofstock")
    public void markOutOfStock(@PathVariable UUID id) {
        service.markOutOfStock(id);
    }

    @PutMapping("/{id}/instock")
    public void markInStock(@PathVariable UUID id) {
        service.markInStock(id);
    }

    @DeleteMapping("/{id}")
    public void deleteProduct(@PathVariable UUID id) {
        service.deleteProduct(id);
    }
}
