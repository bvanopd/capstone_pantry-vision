package com.pantryvisioncore.controller;

import com.pantryvisioncore.model.User;
import com.pantryvisioncore.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    // Get all users
    @GetMapping("/users/listAll.do")
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @GetMapping("/private")
    public String privateEndpoint() { return "You are authenticated!"; }

}
