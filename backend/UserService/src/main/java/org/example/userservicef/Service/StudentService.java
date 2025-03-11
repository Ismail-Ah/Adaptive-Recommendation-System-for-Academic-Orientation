package org.example.userservicef.Service;

import org.example.userservicef.Model.Student;
import org.example.userservicef.Repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class StudentService {
    @Autowired
    private StudentRepository studentRepository;

    public Student createStudent(Student student) {
        return studentRepository.save(student);
    }

    public Student updateStudent(String email, Student updatedStudent) {
        updatedStudent.setEmail(email);
        return studentRepository.save(updatedStudent);
    }

    public Student getStudent(String email) {
        return studentRepository.findById(email).orElse(null);
    }
}
