package com.example.vocabulary;

import jakarta.persistence.*;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 50)
    private String username;

    @Column(nullable = false)
    private String passwordHash;

    @Column(length = 255)
    private String avatarUrl;

    // 今日任务相关字段
    @Column(nullable = false)
    private Boolean checkInCompleted = false;

    @Column(nullable = false)
    private Integer learnWordsProgress = 0;

    @Column(nullable = false)
    private Integer reviewWordsProgress = 0;

    @Column(nullable = false)
    private Integer studyTimeProgress = 0;

    @Column(length = 20)
    private String lastTaskDate;

    public User() {
    }

    public User(String username, String passwordHash) {
        this.username = username;
        this.passwordHash = passwordHash;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPasswordHash() {
        return passwordHash;
    }

    public void setPasswordHash(String passwordHash) {
        this.passwordHash = passwordHash;
    }

    public String getAvatarUrl() {
        return avatarUrl;
    }

    public void setAvatarUrl(String avatarUrl) {
        this.avatarUrl = avatarUrl;
    }

    // 今日任务相关getter和setter
    public Boolean getCheckInCompleted() {
        return checkInCompleted;
    }

    public void setCheckInCompleted(Boolean checkInCompleted) {
        this.checkInCompleted = checkInCompleted;
    }

    public Integer getLearnWordsProgress() {
        return learnWordsProgress;
    }

    public void setLearnWordsProgress(Integer learnWordsProgress) {
        this.learnWordsProgress = learnWordsProgress;
    }

    public Integer getReviewWordsProgress() {
        return reviewWordsProgress;
    }

    public void setReviewWordsProgress(Integer reviewWordsProgress) {
        this.reviewWordsProgress = reviewWordsProgress;
    }

    public Integer getStudyTimeProgress() {
        return studyTimeProgress;
    }

    public void setStudyTimeProgress(Integer studyTimeProgress) {
        this.studyTimeProgress = studyTimeProgress;
    }

    public String getLastTaskDate() {
        return lastTaskDate;
    }

    public void setLastTaskDate(String lastTaskDate) {
        this.lastTaskDate = lastTaskDate;
    }
}

