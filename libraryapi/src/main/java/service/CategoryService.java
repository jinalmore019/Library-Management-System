package com.example.libraryapi.service;

import com.example.libraryapi.entity.Category;
import com.example.libraryapi.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;

    public Category saveCategory(Category category) {
        return categoryRepository.save(category);
    }

    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    public Category getCategoryById(int id) {
        return categoryRepository.findById(id).orElse(null);
    }

    public String deleteCategory(int id) {
        categoryRepository.deleteById(id);
        return "Category deleted successfully";
    }
}