package tadeo.breakabletoy1.BreakableToy1.service;
import org.springframework.stereotype.Service;

import tadeo.breakabletoy1.BreakableToy1.model.Category;

import java.util.*;

@Service
public class CategoryService {
    private final Map<Long, Category> categoryMap = new HashMap<>();
    private Long nextId = 1L;

    public List<Category> findAll() {
        return new ArrayList<>(categoryMap.values());
    }

    public Category create(Category category) {
        category.setId(nextId++);
        categoryMap.put(category.getId(), category);
        return category;
    }

    public Optional<Category> findById(Long id) {
        return Optional.ofNullable(categoryMap.get(id));
    }
}
