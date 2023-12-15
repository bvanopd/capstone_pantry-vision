package com.pantryvisioncore.repository;

import com.pantryvisioncore.model.User;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;


@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    User findByUserName(String userName);

    @Modifying
    @Transactional
    @Query("UPDATE User u SET u.pantryItems = :pantry WHERE u.userName = :userName")
    void updateUserPantryByUserName(@Param("userName") String userName, @Param("pantry") String pantry);

    @Modifying
    @Transactional
    @Query("UPDATE User u SET u.savedRecipes = :recipeIds WHERE u.userName = :userName")
    void updateUserRecipesByUserName(@Param("userName") String userName, @Param("recipeIds") String recipeIds);
}
