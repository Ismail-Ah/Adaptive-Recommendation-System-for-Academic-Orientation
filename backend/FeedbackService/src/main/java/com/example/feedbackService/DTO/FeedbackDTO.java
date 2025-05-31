package com.example.feedbackService.DTO;
import java.util.List;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Max;
import com.fasterxml.jackson.annotation.JsonProperty;

@Data
public class FeedbackDTO {
    @Email
    @JsonProperty("email")
    private String email;
    
    @NotBlank
    @JsonProperty("diplomeName")
    private String diplomeName;
    
    @JsonProperty("notes")
    private List<String> notes;
    
    @Min(0) @Max(5)
    @JsonProperty("rating")
    private float rating;
    
    @JsonProperty("like")
    private boolean like;

    // Default constructor
    public FeedbackDTO() {
    }

    // Constructor with all fields
    public FeedbackDTO(String email, String diplomeName, List<String> notes, float rating, boolean like) {
        this.email = email;
        this.diplomeName = diplomeName;
        this.notes = notes;
        this.rating = rating;
        this.like = like;
    }

    public boolean getLike() {
        return this.like;
    }
}
