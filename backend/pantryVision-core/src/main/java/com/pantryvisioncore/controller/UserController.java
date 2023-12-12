package com.pantryvisioncore.controller;

import com.pantryvisioncore.model.User;
import com.pantryvisioncore.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
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
    public ResponseEntity<String> privateEndpoint(@AuthenticationPrincipal Jwt jwt) {
        return ResponseEntity.ok("{\"message\": \"" + String.format("Hello, %s!", jwt.getSubject()) + "\"}");
    }

    @GetMapping("/user/getPantry.do")
    public ResponseEntity<String> getPantry(@AuthenticationPrincipal Jwt jwt) {
        addUserIfNotFound(jwt.getSubject());
        User user = userRepository.findByUserName(jwt.getSubject());
        return ResponseEntity.ok("{\"pantry\": \"" + user.getPantryItems() + "\"}");
    }

    @PutMapping("/user/setPantry.do")
    public ResponseEntity<String> setPantry(@AuthenticationPrincipal Jwt jwt, @RequestBody String ingredients ) {
        addUserIfNotFound(jwt.getSubject());
        userRepository.updateUserPantryByUserName(jwt.getSubject(), ingredients);
        return ResponseEntity.ok("{\"message\": \"" + ingredients +"\"}");
    }

    @GetMapping("/user/getSavedRecipes.do")
    public ResponseEntity<String> getSavedRecipes(@AuthenticationPrincipal Jwt jwt) {
        addUserIfNotFound(jwt.getSubject());
        User user = userRepository.findByUserName(jwt.getSubject());
        return ResponseEntity.ok("{\"pantry\": \"" + user.getSavedRecipes() + "\"}");
    }

    @PutMapping("/user/saveRecipe.do")
    public ResponseEntity<String> saveRecipe(@AuthenticationPrincipal Jwt jwt, @RequestBody String recipeIds ) {
        addUserIfNotFound(jwt.getSubject());
        userRepository.updateUserRecipesByUserName(jwt.getSubject(), recipeIds);
        return ResponseEntity.ok("{\"message\": \"" + recipeIds +"\"}");
    }

    private void addUserIfNotFound(String userName) {
        if(userRepository.findByUserName(userName) == null) {
            userRepository.save(new User(userName));
        }
    }

}
