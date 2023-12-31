package com.pantryvisioncore.model;

import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Entity
@Table(name = "grocery_list")
public class GroceryList {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "grocery_list_id")
    private long groceryListId;

    @Column(name = "grocery_list_title", nullable = false)
    private String groceryListTitle;

    @Column(name = "grocery_list_ingredients", length = 65555)
    private String groceryListIngredients;

    @Column(name = "grocery_list_user_id", nullable = false)
    private long userId;

    public GroceryList() {
    }
    public GroceryList(String title) {
        super();
        this.groceryListTitle = title;
    }
    public GroceryList(String title, String firstIngredientId) {
        super();
        this.groceryListTitle = title;
        this.groceryListIngredients = firstIngredientId;
    }


    public long getId() {
        return this.groceryListId;
    }

    public void setId(long id) {
        this.groceryListId = id;
    }

    public String getGroceryListTitle() {
        return this.groceryListTitle;
    }

    public void setGroceryListTitle(String groceryListTitle) {
        this.groceryListTitle = groceryListTitle;
    }

    public String getGroceryListItems() { return this.groceryListIngredients; }

    public void setUserId(long userId) {
        this.userId = userId;
    }

    public void pushToIngredientList(String ingredientName) {
        if (this.groceryListIngredients == null || this.groceryListIngredients.isEmpty()) {
            this.groceryListIngredients = ingredientName;
        } else {
            this.groceryListIngredients += "," + ingredientName;
        }
    }
public void removeIngredientFromList(String ingredientName) {
    if (this.groceryListIngredients != null && this.groceryListIngredients.contains(ingredientName)) {
        String[] ingredients = this.groceryListIngredients.split(",");
        List<String> ingredientList = new ArrayList<>(Arrays.asList(ingredients));
        ingredientList.remove(ingredientName);
        this.groceryListIngredients = String.join(",", ingredientList);
    }
}

}
