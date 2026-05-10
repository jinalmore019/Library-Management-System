package com.example.libraryapi.service;

import com.example.libraryapi.entity.Issue;
import com.example.libraryapi.repository.IssueRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class IssueService {

    @Autowired
    private IssueRepository issueRepository;

    public Issue saveIssue(Issue issue) {
        return issueRepository.save(issue);
    }

    public List<Issue> getAllIssues() {
        return issueRepository.findAll();
    }

    public Issue getIssueById(int id) {
        return issueRepository.findById(id).orElse(null);
    }

    public String deleteIssue(int id) {
        issueRepository.deleteById(id);
        return "Issue deleted successfully";
    }
}