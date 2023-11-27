package com.pantryvisioncore.model;

import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "user")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(name = "user_name", unique = true)
    private String userName;

    @Column(name = "pantry_items", length = 65555)
    private String pantryItems;

    public User() {
    }

    public User(String userName) {
        super();
        this.userName = userName;
        this.pantryItems = "";
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getPantryItems() { return pantryItems; }
}
