package com.pantryvisioncore.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "ingredient")
public class Ingredient {

    @Id
    private int ingredientId;

    @Column(name = "ingredient_name")
    private String ingredientName;

    @Column(name = "ingredient_spoonacular_id")
    private int ingredientSpoonacularId;

    @Column(name = "ingredient_group_id")
    private int ingredientGroupId;

    @Column(name = "ingredient_essential_flg")
    private String ingredientEssentialFlg;

    public Ingredient() {
    }

    public int getIngredientId() {
        return ingredientId;
    }

    public void setIngredientId(int ingredientId) {
        this.ingredientId = ingredientId;
    }

    public String getIngredientName() {
        return ingredientName;
    }

    public void setIngredientName(String ingredientName) {
        this.ingredientName = ingredientName;
    }

    public int getIngredientSpoonacularId() {
        return ingredientSpoonacularId;
    }

    public void setIngredientSpoonacularId(int ingredientSpoonacularId) {
        this.ingredientSpoonacularId = ingredientSpoonacularId;
    }

    public int getIngredientGroupId() {
        return ingredientGroupId;
    }

    public void setIngredientGroupId(int ingredientGroupId) {
        this.ingredientGroupId = ingredientGroupId;
    }

    public String getIngredientEssentialFlg() {
        return ingredientEssentialFlg;
    }

    public void setIngredientEssentialFlg(String ingredientEssentialFlg) {
        this.ingredientEssentialFlg = ingredientEssentialFlg;
    }
}
