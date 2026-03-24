package com.example.sms.repository;

import com.example.sms.entity.User;
import com.example.sms.entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
    boolean existsByUsername(String username);
    
    @Query("SELECT COUNT(u) FROM User u JOIN u.roles r WHERE r = ?1")
    long countByRoles(Role role);
}