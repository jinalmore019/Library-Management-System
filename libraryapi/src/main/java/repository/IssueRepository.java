package com.example.libraryapi.repository;

import com.example.libraryapi.entity.Issue;
import org.springframework.data.jpa.repository.JpaRepository;

public interface IssueRepository extends JpaRepository<Issue, Integer> {
}