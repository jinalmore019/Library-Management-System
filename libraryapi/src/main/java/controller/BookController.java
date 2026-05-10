package com.example.libraryapi.controller;

import com.example.libraryapi.entity.Book;
import com.example.libraryapi.service.BookService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/books")
public class BookController {

    @Autowired
    private BookService bookService;

    @PostMapping
    public Book addBook(@RequestBody Book book) {
        return bookService.saveBook(book);
    }

    @GetMapping
    public List<Book> getAllBooks() {
        return bookService.getAllBooks();
    }

    @PutMapping("/{id}")
    public Book updateBook(@PathVariable int id, @RequestBody Book book) {
        Book existing = bookService.getBookById(id);

        if (existing == null) {
            throw new RuntimeException("Book not found with id: " + id);
        }

        existing.setTitle(book.getTitle());
        existing.setAuthor(book.getAuthor());
        existing.setPrice(book.getPrice());

        return bookService.saveBook(existing);
    }

    @DeleteMapping("/{id}")
    public String deleteBook(@PathVariable int id) {
        return bookService.deleteBook(id);
    }
}