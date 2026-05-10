package com.example.libraryapi.controller;

import com.example.libraryapi.entity.User;
import com.example.libraryapi.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody User user) {
        if (userRepository.findByUsername(user.getUsername()).isPresent()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Error: Username is already taken!"));
        }
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Error: Email is already in use!"));
        }

        // Hash the password before saving
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setRole("ADMIN"); // Defaulting to ADMIN for simplicity in this project
        
        userRepository.save(user);

        return ResponseEntity.ok(Map.of("message", "User registered successfully!"));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> payload) {
        String email = payload.get("email");
        Optional<User> userOpt = userRepository.findByEmail(email);
        
        if (userOpt.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Error: No user found with this email!"));
        }
        
        User user = userOpt.get();
        // Generate a simple temporary password for the demo
        String tempPassword = "temp" + (int)(Math.random() * 10000);
        user.setPassword(passwordEncoder.encode(tempPassword));
        userRepository.save(user);
        
        return ResponseEntity.ok(Map.of(
            "message", "Password reset successful!",
            "tempPassword", tempPassword // Returning it here so the frontend can display it in a modal
        ));
    }
}
