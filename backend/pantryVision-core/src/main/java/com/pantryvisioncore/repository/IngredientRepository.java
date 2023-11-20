package com.pantryvisioncore.repository;

import com.pantryvisioncore.model.Ingredient;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface IngredientRepository extends JpaRepository<Ingredient, Integer> {
    List<Ingredient> findByIngredientGroupIdIsNotNull();
    List<Ingredient> findByIngredientGroupIdIsNull();
    List<Ingredient> findByIngredientGroupId(int groupId);
}
