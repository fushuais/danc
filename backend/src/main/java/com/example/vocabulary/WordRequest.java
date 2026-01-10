package com.example.vocabulary;

public class WordRequest {
    private String word;
    private String meaning;

    public WordRequest() {
    }

    public WordRequest(String word) {
        this.word = word;
    }

    public WordRequest(String word, String meaning) {
        this.word = word;
        this.meaning = meaning;
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
}
