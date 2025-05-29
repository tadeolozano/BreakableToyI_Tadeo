package tadeo.breakabletoy1.BreakableToy1.service;

import tadeo.breakabletoy1.BreakableToy1.model.Product;
import tadeo.breakabletoy1.BreakableToy1.repository.ProductRepository;

import java.util.*;

public class ProductService {
    private final ProductRepository repo = new ProductRepository();

    public List<Product> getProducts(String name, String category, Boolean inStock, String sortBy, int page, int size) {
        Comparator<Product> comparator = getComparator(sortBy);
        List<Product> filtered = repo.filterAndSort(name, category, inStock, comparator);

        int fromIndex = Math.min(page * size, filtered.size());
        int toIndex = Math.min(fromIndex + size, filtered.size());

        return filtered.subList(fromIndex, toIndex);
    }

    public Product createProduct(Product product) {
        repo.save(product);
        return product;
    }

    public Optional<Product> updateProduct(UUID id, Product newProduct) {
        Optional<Product> existing = repo.findById(id);
        if (existing.isPresent()) {
            newProduct.setId(id);
            newProduct.setCreationDate(existing.get().getCreationDate());
            newProduct.setUpdateDate(java.time.LocalDateTime.now());
            repo.update(id, newProduct);
        }
        return existing;
    }

    public void markOutOfStock(UUID id) {
        repo.markOutOfStock(id);
    }

    public void markInStock(UUID id) {
        repo.markInStock(id);
    }

    private Comparator<Product> getComparator(String sortBy) {
        return switch (sortBy) {
            case "name" -> Comparator.comparing(Product::getName);
            case "category" -> Comparator.comparing(Product::getCategory);
            case "price" -> Comparator.comparingDouble(Product::getUnitPrice);
            case "stock" -> Comparator.comparingInt(Product::getQuantityInStock);
            case "expiration" -> Comparator.comparing(Product::getExpirationDate, Comparator.nullsLast(Comparator.naturalOrder()));
            default -> Comparator.comparing(Product::getName);
        };
    }

    //delete product
    public void deleteProduct(UUID id) {
        repo.delete(id);
    }
}
