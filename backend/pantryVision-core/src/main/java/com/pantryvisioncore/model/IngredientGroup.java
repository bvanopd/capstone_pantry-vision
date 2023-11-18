package com.pantryvisioncore.model;

import jakarta.persistence.*;

@Entity
@Table(name = "ingredient_group")
public class IngredientGroup {

    @Id
    private int ingredientGroupId;

    @Column(name = "ingredient_group_description")
    private String ingredientGroupDescription;

    public IngredientGroup() {}

    public int getIngredientGroupId() {
        return ingredientGroupId;
    }

    public void setIngredientGroupId(int ingredientGroupId) {
        this.ingredientGroupId = ingredientGroupId;
    }

    public String getIngredientGroupDescription() {
        return ingredientGroupDescription;
    }

    public void setIngredientGroupDescription(String ingredientGroupDescription) {
        this.ingredientGroupDescription = ingredientGroupDescription;
    }
}
