package com.pantryvisioncore.controller;

import com.pantryvisioncore.model.GroceryList;
import com.pantryvisioncore.repository.GroceryListRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api")
public class GroceryListController {

    @Autowired
    private GroceryListRepository groceryListRepository;

    // Get many grocery lists by userId
    @GetMapping("/groceries/groceryListsByUserId.do")
    public List<GroceryList> groceryListByUserId(@RequestParam("userId") int userId) {
        return groceryListRepository.findByUserId(userId);
    }

    // Get one grocery list by its unqiue id
    @GetMapping("/groceries/groceryListById.do")
    public List<GroceryList> groceryListById(@RequestParam("groceryListId") int groceryListId) {
        return groceryListRepository.findByGroceryListId(groceryListId);
    }

}