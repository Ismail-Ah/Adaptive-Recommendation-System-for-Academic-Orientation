package org.example.userservicef.Repository;



import org.example.userservicef.Model.CareerAspiration;
import org.example.userservicef.Model.Duree;
import org.example.userservicef.Model.Filiere;
import org.example.userservicef.Model.MontionBac;
import org.example.userservicef.Model.Subject;
import org.example.userservicef.Model.User;
import org.example.userservicef.Model.Year;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.neo4j.core.Neo4jTemplate;
import org.springframework.data.neo4j.repository.Neo4jRepository;

public interface UserRepository extends Neo4jRepository<User, String> {
    User findByEmail(String email);
}