package com.example.web.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.bind.annotation.RequestMapping;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;


@RestController
@RequestMapping("/")

public class FileUploadController {
    @CrossOrigin(origins = "*") // 允许来自所有来源的跨域请求
    @PostMapping("/upload")
    public String handleFileUpload(@RequestParam("file-upload") MultipartFile file) {
        System.out.println("file");
        if (file.isEmpty()) {
            return "文件为空";
        }
        try {
            // 指定文件保存路径
            String uploadDir = Paths.get(System.getProperty("user.dir"), "uploads").toString();
            // 确保目录存在
            Path path = Paths.get(uploadDir);
            if (!Files.exists(path)) {
                try {
                    Files.createDirectories(path);
                    System.out.println("目录创建成功：" + path.toString());
                } catch (IOException e) {
                    System.err.println("创建目录失败：" + e.getMessage());
                    throw e; // 重新抛出异常
                }
            }
            String filePath = Paths.get(uploadDir, file.getOriginalFilename()).toString();
            File dest = new File(filePath);
            file.transferTo(dest);
            System.out.println("Current working directory: " + new java.io.File(".").getAbsolutePath());
            return "文件上传成功：" + file.getOriginalFilename();
        } catch (IOException e) {
            e.printStackTrace();
            return "文件上传失败：" + e.getMessage();
        }

    }
}