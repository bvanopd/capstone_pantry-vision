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
    @PutMapping("/groceryList/add.do")
    public ResponseEntity<String> addGroceryList(@AuthenticationPrincipal Jwt jwt, @RequestBody String groceryListTitle) {
        User user = userRepository.findByUserName(jwt.getSubject());
        GroceryList groceryList = new GroceryList(groceryListTitle);
        groceryList.setUserId(user.getId());
        groceryListRepository.save(groceryList);
        return ResponseEntity.ok("{\"message\": \"Grocery list added successfully\"}");
    }
    
    // Delete a grocery list BY id
    @DeleteMapping("/groceryList/delete.do")    
    public ResponseEntity<String> deleteByGroceryListId(@RequestParam Long groceryListId) {
        groceryListRepository.deleteById(groceryListId);
        return ResponseEntity.ok("{\"message\": \"Grocery list deleted successfully\"}");
    }

    // Add item to user grocery list
    @PutMapping("/groceryList/addItem.do")
    public ResponseEntity<String> addItemToGroceryList(@RequestBody GroceryListEditor requestData) {
        GroceryList groceryList = groceryListRepository.findByGroceryListId(requestData.listId);
        groceryList.pushToIngredientList(requestData.ingredientName);
        groceryListRepository.save(groceryList);
        return ResponseEntity.ok("{\"message\": \"Item successfully added to grocery list\"}");
    }

    // Add item to user grocery list
    @PutMapping("/groceryList/removeItem.do")
    public ResponseEntity<String> removeItemFromGroceryList(@RequestBody GroceryListEditor requestData) {
        GroceryList groceryList = groceryListRepository.findByGroceryListId(requestData.listId);
        groceryList.popFromIngredientList(requestData.ingredientName);
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

    /**
     * Basic utilty class for adding/removing from grocery ingredient lists
     */
    private static class GroceryListEditor {
        public String ingredientName;
        public long listId;
    }
    
}