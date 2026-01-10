package com.example.vocabulary;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity
public class Item {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String word;
    private String meaning; // 中文意思
    private Integer rememberedCount = 0; // 记住次数

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // Constructors
    public Item() {
    }

    public Item(String word) {
        this.word = word;
    }

    public Item(String word, String meaning) {
        this.word = word;
        this.meaning = meaning;
    }

    public Item(String word, String meaning, User user) {
        this.word = word;
        this.meaning = meaning;
        this.user = user;
        this.rememberedCount = 0;
    }

    public Item(String word, String meaning, User user, Integer rememberedCount) {
        this.word = word;
        this.meaning = meaning;
        this.user = user;
        this.rememberedCount = rememberedCount != null ? rememberedCount : 0;
    }

    public Item(Long id, String word, String meaning, User user) {
        this.id = id;
        this.word = word;
        this.meaning = meaning;
        this.user = user;
        this.rememberedCount = 0;
    }

    public Item(Long id, String word, String meaning, User user, Integer rememberedCount) {
        this.id = id;
        this.word = word;
        this.meaning = meaning;
        this.user = user;
        this.rememberedCount = rememberedCount != null ? rememberedCount : 0;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getWord() {
        return word;
    }

    public void setWord(String word) {
        this.word = word;
    }

    public String getMeaning() {
        return meaning;
    }

    public void setMeaning(String meaning) {
        this.meaning = meaning;
    }

    public Integer getRememberedCount() {
        return rememberedCount;
    }

    public void setRememberedCount(Integer rememberedCount) {
        this.rememberedCount = rememberedCount;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }
}