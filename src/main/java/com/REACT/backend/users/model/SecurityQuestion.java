package com.REACT.backend.users.model;

public enum SecurityQuestion {
    PET_NAME("What is your pet’s name?"),
    BIRTH_CITY("In which city were you born?"),
    FAVORITE_TEACHER("Who was your favorite teacher?"),
    MOTHER_MAIDEN_NAME("What is your mother's maiden name?");

    private final String questionText;

    SecurityQuestion(String questionText) {
        this.questionText = questionText;
    }

    public String getQuestionText() {
        return questionText;
    }
}
