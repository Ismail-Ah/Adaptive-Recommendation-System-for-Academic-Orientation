package org.example.userservicef;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@SpringBootApplication
@EnableDiscoveryClient
public class UserServiceFApplication {

    public static void main(String[] args) {
        SpringApplication.run(UserServiceFApplication.class, args);
    }

}
