package com.example.libraryapi.service;

import com.example.libraryapi.entity.Book;
import com.example.libraryapi.repository.BookRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BookService {

    @Autowired
    private BookRepository bookRepository;

    public Book saveBook(Book book) {
        return bookRepository.save(book);
    }

    public List<Book> getAllBooks() {
        return bookRepository.findAll();
    }

    public Book getBookById(int id) {
        return bookRepository.findById(id).orElse(null);
    }

    public String deleteBook(int id) {
        bookRepository.deleteById(id);
        return "Book deleted successfully";
    }
}