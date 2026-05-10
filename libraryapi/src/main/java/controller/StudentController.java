package com.example.libraryapi.controller;

import com.example.libraryapi.entity.Student;
import com.example.libraryapi.service.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/students")
public class StudentController {

    @Autowired
    private StudentService studentService;

    @PostMapping
    public Student addStudent(@RequestBody Student student) {
        return studentService.saveStudent(student);
    }

    @GetMapping
    public List<Student> getAllStudents() {
        return studentService.getAllStudents();
    }

    @PutMapping("/{id}")
    public Student updateStudent(@PathVariable int id, @RequestBody Student student) {
        Student existing = studentService.getStudentById(id);

        if (existing == null) {
            throw new RuntimeException("Student not found with id: " + id);
        }

        existing.setName(student.getName());
        existing.setEmail(student.getEmail());
        existing.setMobile(student.getMobile());

        return studentService.saveStudent(existing);
    }

    @DeleteMapping("/{id}")
    public String deleteStudent(@PathVariable int id) {
        return studentService.deleteStudent(id);
    }
}