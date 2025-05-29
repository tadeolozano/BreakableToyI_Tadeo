package tadeo.breakabletoy1.BreakableToy1.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.List;
import tadeo.breakabletoy1.BreakableToy1.model.Category;
import tadeo.breakabletoy1.BreakableToy1.service.CategoryService;

@RestController
@RequestMapping("/categories")
@CrossOrigin(origins = "http://localhost:8080") // permite peticiones desde el frontend
public class CategoryController {

    @Autowired
    private CategoryService categoryService;

    @GetMapping
    public List<Category> getAllCategories() {
        return categoryService.findAll();
    }

    @PostMapping
    public Category createCategory(@RequestBody Category category) {
        return categoryService.create(category);
    }
}
