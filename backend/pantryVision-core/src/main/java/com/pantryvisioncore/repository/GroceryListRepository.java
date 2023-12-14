package com.pantryvisioncore.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.pantryvisioncore.model.GroceryList;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

public interface GroceryListRepository extends JpaRepository<GroceryList, Long> {
    List<GroceryList> findByUserId(long userId);
    List<GroceryList> findByGroceryListId(int listId);
    @Modifying
    @Query("delete from GroceryList g where g.userId = ?1 and g.groceryListTitle = ?2")
    void deleteByUserIdAndGroceryListTitle(long userId, String groceryListTitle);
}
