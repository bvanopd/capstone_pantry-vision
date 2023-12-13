package com.pantryvisioncore.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.pantryvisioncore.model.GroceryList;

public interface GroceryListRepository extends JpaRepository<GroceryList, Long> {
    List<GroceryList> findByUserId(long userId);
    List<GroceryList> findByGroceryListId(int listId);
}
