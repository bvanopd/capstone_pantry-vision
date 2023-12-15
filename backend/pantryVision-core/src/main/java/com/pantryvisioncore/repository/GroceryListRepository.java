package com.pantryvisioncore.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.pantryvisioncore.model.GroceryList;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

public interface GroceryListRepository extends JpaRepository<GroceryList, Long> {
    List<GroceryList> findByUserId(long userId);
    GroceryList findByGroceryListId(long listId);

    @Modifying
    @Query("delete from GroceryList g where g.userId = ?1 and g.groceryListId = ?2")
    void deleteByIdAndUserId(long userId, long groceryListId);
}
