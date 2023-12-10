package com.pantryvisioncore.controller;

import com.pantryvisioncore.model.GroceryList;
import com.pantryvisioncore.model.User;
import com.pantryvisioncore.repository.GroceryListRepository;
import com.pantryvisioncore.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class GroceryListController {

    @Autowired
    private GroceryListRepository groceryListRepository;

    @Autowired
    private UserRepository userRepository;

    // Add a grocery list for a user
    @PostMapping("/groceryList/add.do")
    public ResponseEntity<String> addGroceryList(@AuthenticationPrincipal Jwt jwt, @RequestBody GroceryList groceryList) {
        User user = userRepository.findByUserName(jwt.getSubject());
        groceryList.setUserId(user.getId());
        groceryListRepository.save(groceryList);
        return ResponseEntity.ok("{\"message\": \"Grocery list added successfully\"}");
    }

    // Get all grocery lists for a user
    @GetMapping("/groceryList/getAll.do")
    public ResponseEntity<List<GroceryList>> getAllGroceryLists(@AuthenticationPrincipal Jwt jwt) {
        User user = userRepository.findByUserName(jwt.getSubject());
        List<GroceryList> groceryLists = groceryListRepository.findByUserId(user.getId());
        return ResponseEntity.ok(groceryLists);
    }

}