package com.pantryvisioncore.controller;

import com.pantryvisioncore.model.Ingredient;
import com.pantryvisioncore.model.IngredientGroup;
import com.pantryvisioncore.repository.IngredientGroupRepository;
import com.pantryvisioncore.repository.IngredientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Comparator;
import java.util.List;

@RestController
@RequestMapping("/api")
public class IngredientController {

    @Autowired
    private IngredientGroupRepository ingredientGroupRepository;

    @Autowired
    private IngredientRepository ingredientRepository;


    // Get a list of all ingredient groups
    @GetMapping("/ingredients/listIngredientGroups.do")
    public List<IngredientGroup> getAllIngredientGroups() {
        return ingredientGroupRepository.findAll();
    }

    // Get the entire list of ingredients
    @GetMapping("/ingredients/listAll.do")
    public List<Ingredient> getAllIngredients() {
        return ingredientRepository.findAll();
    }

    // All ingredients that have a groupID
    @GetMapping("/ingredients/groupedIngredients.do")
    public List<Ingredient> getAllIngredientsSorted() {
        List<Ingredient> ingredients = ingredientRepository.findByIngredientGroupIdIsNotNull();
        ingredients.sort(Comparator.comparing(Ingredient::getIngredientGroupId));
        return ingredients;
    }

    // Get ingredients BY groupID
    @GetMapping("/ingredients/ingredientsByGroupId.do")
    public List<Ingredient> getIngredientsByGroupId(@RequestParam("groupId") int groupId) {
        List<Ingredient> ingredients = ingredientRepository.findByIngredientGroupId(groupId);
        ingredients.sort(Comparator.comparing(Ingredient::getIngredientGroupId));
        return ingredients;
    }

    // Get a single ingredient BY id
    @GetMapping("/ingredients/ingredientById.do")
    public Ingredient getIngredientsById(@RequestParam("ingredientId") int ingredientId) {
        return ingredientRepository.findByIngredientId(ingredientId);
    }

    // All ingredients that dont have a group
    @GetMapping("/ingredients/ungroupedIngredients.do")
    public List<Ingredient> getAllIngredientsUncategorized() {
        return ingredientRepository.findByIngredientGroupIdIsNull();
    }

}