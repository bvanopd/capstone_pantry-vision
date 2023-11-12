package com.pantryvisioncore.controller;

import com.pantryvisioncore.model.User;
import com.pantryvisioncore.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    // Get all users
    @GetMapping("/listAll.do")
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // Add new user
    @PostMapping("/add")
    public User addUser(@RequestBody User user) {
        return userRepository.save(user);
    }
}
