package com.REACT.backend.users;


import com.REACT.backend.users.model.SecurityQuestion;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Builder
public class AppUser {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long userId;

    @Enumerated(EnumType.STRING)
    private Role role = Role.USER;



    @Column(nullable = false)
    private String userFullName;

    @Column(nullable = false, unique = true)
    private String userEmail;

    @Column(nullable = false, unique = true)
    private String phoneNumber;

    @Column(nullable = false, unique = true)
    private String governmentId;

    @Column(nullable = false)
    private String userPassword;

    private boolean verified = false;

    @Enumerated(EnumType.STRING)
    @Column(name = "security_question", nullable = false)
    private SecurityQuestion securityQuestion;

    @Column(name = "security_answer", nullable = false)
    private String securityAnswer; // hashed



}
