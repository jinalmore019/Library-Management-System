package com.example.libraryapi.controller;

import com.example.libraryapi.entity.Issue;
import com.example.libraryapi.service.IssueService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/issues")
public class IssueController {

    @Autowired
    private IssueService issueService;

    @PostMapping
    public Issue addIssue(@RequestBody Issue issue) {
        return issueService.saveIssue(issue);
    }

    @GetMapping
    public List<Issue> getAllIssues() {
        return issueService.getAllIssues();
    }

    @PutMapping("/{id}")
    public Issue updateIssue(@PathVariable int id, @RequestBody Issue issue) {
        Issue existing = issueService.getIssueById(id);

        if (existing == null) {
            throw new RuntimeException("Issue not found with id: " + id);
        }

        existing.setBook(issue.getBook());
        existing.setStudent(issue.getStudent());
        existing.setIssueDate(issue.getIssueDate());

        return issueService.saveIssue(existing);
    }

    @DeleteMapping("/{id}")
    public String deleteIssue(@PathVariable int id) {
        return issueService.deleteIssue(id);
    }
}