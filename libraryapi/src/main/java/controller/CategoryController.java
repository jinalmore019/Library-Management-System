package com.example.libraryapi.controller;

import com.example.libraryapi.entity.Category;
import com.example.libraryapi.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/categories")
public class CategoryController {

    @Autowired
    private CategoryService categoryService;

    @PostMapping
    public Category addCategory(@RequestBody Category category) {
        return categoryService.saveCategory(category);
    }

    @GetMapping
    public List<Category> getAllCategories() {
        return categoryService.getAllCategories();
    }

    @PutMapping("/{id}")
    public Category updateCategory(@PathVariable int id, @RequestBody Category category) {
        Category existing = categoryService.getCategoryById(id);

        if (existing == null) {
            throw new RuntimeException("Category not found with id: " + id);
        }

        existing.setName(category.getName());

        return categoryService.saveCategory(existing);
    }

    @DeleteMapping("/{id}")
    public String deleteCategory(@PathVariable int id) {
        return categoryService.deleteCategory(id);
    }
}