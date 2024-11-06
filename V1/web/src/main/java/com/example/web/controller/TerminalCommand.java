package com.example.web.controller;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.IOException;
import java.nio.file.Paths;
import java.nio.file.Path;


public class TerminalCommand {
    public void main(String filePath) {
        System.out.println("Current working directory: " + new java.io.File(".").getAbsolutePath());

        System.out.println(filePath);
        // 创建一个 ProcessBuilder 实例，传入要执行的命令
        ProcessBuilder processBuilder = new ProcessBuilder(
            "bash", 
            "gfaGlimpse/V0/run.sh", 
            filePath
        );
        System.out.println("548");
        System.out.println(processBuilder.command());

        // 设置要执行的命令（例如：ls 或 dir）
        // Path bashPath = Paths.get("gfaGlimpse/V0/run.sh");
        // processBuilder.command("bash "+bashPath.toString(),filePath);
        // System.out.println(bashPath.toString());
        try {
            // 启动进程
            Process process = processBuilder.start();

            // 获取进程的输出
            BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
            String line;
            while ((line = reader.readLine()) != null) {
                System.out.println(line);
            }

            // 等待进程结束，并获取其退出状态
            int exitCode = process.waitFor();
            System.out.println("Exited with code: " + exitCode);
        } catch (IOException | InterruptedException e) {
            e.printStackTrace();
        }
    }
}
