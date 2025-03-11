package org.example.userservicef.Controller;

import org.example.userservicef.Model.Student;
import org.example.userservicef.Service.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/students")
@CrossOrigin(origins = "http://localhost:3000") // For React frontend

public class StudentController {
    @Autowired
    private StudentService studentService;

    @PostMapping
    public Student createStudent(@RequestBody Student student) {
        return studentService.createStudent(student);
    }

    @PutMapping("/{email}")
    public Student updateStudent(@PathVariable String email, @RequestBody Student student) {
        return studentService.updateStudent(email, student);
    }

    @GetMapping("/{email}")
    public Student getStudent(@PathVariable String email) {
        return studentService.getStudent(email);
    }
}
