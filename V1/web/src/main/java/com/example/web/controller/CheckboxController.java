package com.example.web.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/check")
@CrossOrigin
public class CheckboxController {

    @Autowired
    @PostMapping()
    public void getCheck( @RequestBody Map<String, Object> requestBody) {

        System.out.println(requestBody);

    }

}
