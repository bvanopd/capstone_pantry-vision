package com.pantryvisioncore.controller;

import com.pantryvisioncore.model.GroceryList;
import com.pantryvisioncore.model.User;
import com.pantryvisioncore.repository.GroceryListRepository;
import com.pantryvisioncore.repository.UserRepository;
import jakarta.transaction.Transactional;
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
    @PutMapping("/groceryList/add.do")
    public ResponseEntity<String> addGroceryList(@AuthenticationPrincipal Jwt jwt, @RequestBody String groceryListTitle) {
        User user = userRepository.findByUserName(jwt.getSubject());
        GroceryList groceryList = new GroceryList(groceryListTitle);
        groceryList.setUserId(user.getId());
        groceryListRepository.save(groceryList);
        return ResponseEntity.ok("{\"message\": \"Grocery list added successfully\"}");
    }

    @Transactional
    @PutMapping("/groceryList/remove.do")
    public ResponseEntity<String> removeGroceryList(@AuthenticationPrincipal Jwt jwt, @RequestBody String groceryListTitle) {
        User user = userRepository.findByUserName(jwt.getSubject());
        groceryListRepository.deleteByUserIdAndGroceryListTitle(user.getId(), groceryListTitle);
        return ResponseEntity.ok("{\"message\": \"Grocery list removed successfully\"}");
    }

    // Add item to user grocery list
    @Transactional
    @PutMapping("/groceryList/addItem.do")
    public ResponseEntity<String> addItemToGroceryList(@AuthenticationPrincipal Jwt jwt, @RequestBody AddItemRequest request) {
        String ingredientName = request.getIngredientName();
        int groceryListId = request.getGroceryListId();

        User user = userRepository.findByUserName(jwt.getSubject());
        GroceryList groceryList = groceryListRepository.findByGroceryListId(groceryListId).get(0);
        groceryList.pushToIngredientList(ingredientName);
        groceryListRepository.save(groceryList);
        return ResponseEntity.ok("{\"message\": \"Item successfully added to grocery list\"}");
    }
    @Transactional
    @PutMapping("/groceryList/removeItem.do")
    public ResponseEntity<String> removeItemFromGroceryList(@AuthenticationPrincipal Jwt jwt, @RequestBody AddItemRequest request) {
        String ingredientName = request.getIngredientName();
        int groceryListId = request.getGroceryListId();

        User user = userRepository.findByUserName(jwt.getSubject());
        GroceryList groceryList = groceryListRepository.findByGroceryListId(groceryListId).get(0);
        groceryList.removeIngredientFromList(ingredientName);
        groceryListRepository.save(groceryList);
        return ResponseEntity.ok("{\"message\": \"Item successfully removed from grocery list\"}");
    }
        
    // Get all grocery lists for a user
    @GetMapping("/groceryList/getAll.do")
    public ResponseEntity<List<GroceryList>> getAllGroceryLists(@AuthenticationPrincipal Jwt jwt) {
        User user = userRepository.findByUserName(jwt.getSubject());
        List<GroceryList> groceryLists = groceryListRepository.findByUserId(user.getId());
        return ResponseEntity.ok(groceryLists);
    }

    // Internal class to represent both parameters of an "add ingredient" request
    public static class AddItemRequest {
        private String ingredientName;
        private int groceryListId;
        public String getIngredientName() {
            return ingredientName;
        }

        public void setIngredientName(String ingredientName) {
            this.ingredientName = ingredientName;
        }

        public int getGroceryListId() {
            return groceryListId;
        }

        public void setGroceryListId(int groceryListId) {
            this.groceryListId = groceryListId;
        }
    }
}