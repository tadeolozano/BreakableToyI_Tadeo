package tadeo.breakabletoy1.BreakableToy1.repository;
import tadeo.breakabletoy1.BreakableToy1.model.Product;
import java.util.*;
import java.util.stream.Collectors;

public class ProductRepository {
    private final Map<UUID, Product> productMap = new HashMap<>();

    public List<Product> findAll() {
        return new ArrayList<>(productMap.values());
    }

    public Optional<Product> findById(UUID id) {
        return Optional.ofNullable(productMap.get(id));
    }

    public void save(Product product) {
        productMap.put(product.getId(), product);
    }

    public void update(UUID id, Product updatedProduct) {
        productMap.put(id, updatedProduct);
    }

    public void markOutOfStock(UUID id) {
        Product p = productMap.get(id);
        if (p != null) {
            p.setQuantityInStock(0);
        }
    }

    public void markInStock(UUID id) {
        Product p = productMap.get(id);
        if (p != null) {
            p.setQuantityInStock(10);
        }
    }

    public List<Product> filterAndSort(String name, String category, Boolean inStock, Comparator<Product> sort) {
        return productMap.values().stream()
                .filter(p -> name == null || p.getName().toLowerCase().contains(name.toLowerCase()))
                .filter(p -> category == null || p.getCategory().equalsIgnoreCase(category))
                .filter(p -> inStock == null || (inStock ? p.getQuantityInStock() > 0 : p.getQuantityInStock() == 0))
                .sorted(sort)
                .collect(Collectors.toList());
    }

    //delete product
    public void delete(UUID id) {
        productMap.remove(id);
    }
}
