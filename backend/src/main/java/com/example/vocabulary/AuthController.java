package com.example.vocabulary;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @Autowired
    public AuthController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> payload) {
        String username = payload.get("username");
        String password = payload.get("password");

        if (username == null || username.trim().isEmpty()
                || password == null || password.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("用户名和密码不能为空");
        }

        if (userRepository.existsByUsername(username.trim())) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("用户名已存在");
        }

        String hash = passwordEncoder.encode(password.trim());
        User user = new User(username.trim(), hash);
        userRepository.save(user);

        Map<String, Object> resp = new HashMap<>();
        resp.put("id", user.getId());
        resp.put("username", user.getUsername());
        resp.put("avatarUrl", user.getAvatarUrl());

        // 添加今日任务信息（新用户默认为false/0）
        Map<String, Object> dailyTasks = new HashMap<>();
        dailyTasks.put("checkInCompleted", false);
        dailyTasks.put("learnWordsProgress", 0);
        dailyTasks.put("reviewWordsProgress", 0);
        dailyTasks.put("studyTimeProgress", 0);
        dailyTasks.put("lastTaskDate", null);
        resp.put("dailyTasks", dailyTasks);

        return ResponseEntity.ok(resp);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> payload) {
        String username = payload.get("username");
        String password = payload.get("password");

        if (username == null || password == null
                || username.trim().isEmpty() || password.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("用户名和密码不能为空");
        }

        Optional<User> userOpt = userRepository.findByUsername(username.trim());
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("用户名或密码错误");
        }

        User user = userOpt.get();
        if (!passwordEncoder.matches(password.trim(), user.getPasswordHash())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("用户名或密码错误");
        }

        // 返回用户信息，包括头像URL和今日任务
        Map<String, Object> resp = new HashMap<>();
        resp.put("id", user.getId());
        resp.put("username", user.getUsername());
        resp.put("avatarUrl", user.getAvatarUrl());

        // 添加今日任务信息
        Map<String, Object> dailyTasks = new HashMap<>();
        dailyTasks.put("checkInCompleted", user.getCheckInCompleted());
        dailyTasks.put("learnWordsProgress", user.getLearnWordsProgress());
        dailyTasks.put("reviewWordsProgress", user.getReviewWordsProgress());
        dailyTasks.put("studyTimeProgress", user.getStudyTimeProgress());
        dailyTasks.put("lastTaskDate", user.getLastTaskDate());
        resp.put("dailyTasks", dailyTasks);

        return ResponseEntity.ok(resp);
    }

    @PostMapping("/verify")
    public ResponseEntity<?> verify(@RequestBody Map<String, Object> payload) {
        Object userIdObj = payload.get("userId");
        if (userIdObj == null) {
            return ResponseEntity.badRequest().body("用户ID不能为空");
        }

        Long userId;
        if (userIdObj instanceof Number) {
            userId = ((Number) userIdObj).longValue();
        } else if (userIdObj instanceof String) {
            try {
                userId = Long.parseLong((String) userIdObj);
            } catch (NumberFormatException e) {
                return ResponseEntity.badRequest().body("用户ID格式错误");
            }
        } else {
            return ResponseEntity.badRequest().body("用户ID格式错误");
        }

        Optional<User> userOptional = userRepository.findById(userId);
        if (userOptional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("用户不存在");
        }

        User user = userOptional.get();
        Map<String, Object> resp = new HashMap<>();
        resp.put("id", user.getId());
        resp.put("username", user.getUsername());
        resp.put("avatarUrl", user.getAvatarUrl());

        // 添加今日任务信息
        Map<String, Object> dailyTasks = new HashMap<>();
        dailyTasks.put("checkInCompleted", user.getCheckInCompleted());
        dailyTasks.put("learnWordsProgress", user.getLearnWordsProgress());
        dailyTasks.put("reviewWordsProgress", user.getReviewWordsProgress());
        dailyTasks.put("studyTimeProgress", user.getStudyTimeProgress());
        dailyTasks.put("lastTaskDate", user.getLastTaskDate());
        resp.put("dailyTasks", dailyTasks);

        return ResponseEntity.ok(resp);
    }

    @PostMapping("/avatar")
    public ResponseEntity<?> uploadAvatar(
            @RequestParam("avatar") MultipartFile file,
            @RequestParam("userId") Long userId) {
        try {
            // 验证用户身份
            Optional<User> userOptional = userRepository.findById(userId);
            if (userOptional.isEmpty()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("用户不存在");
            }

            // 验证文件
            if (file.isEmpty()) {
                return ResponseEntity.badRequest().body("文件不能为空");
            }

            // 验证文件类型
            String contentType = file.getContentType();
            if (contentType == null ||
                (!contentType.equals("image/jpeg") &&
                 !contentType.equals("image/jpg") &&
                 !contentType.equals("image/png") &&
                 !contentType.equals("image/gif"))) {
                return ResponseEntity.badRequest().body("只支持 JPG、PNG、GIF 格式的图片");
            }

            // 验证文件大小 (5MB)
            if (file.getSize() > 5 * 1024 * 1024) {
                return ResponseEntity.badRequest().body("文件大小不能超过 5MB");
            }

            // 创建上传目录
            Path uploadDir = Paths.get("uploads", "avatars");
            if (!Files.exists(uploadDir)) {
                Files.createDirectories(uploadDir);
            }

            // 生成唯一文件名
            String originalFilename = file.getOriginalFilename();
            String extension = "";
            if (originalFilename != null && originalFilename.contains(".")) {
                extension = originalFilename.substring(originalFilename.lastIndexOf("."));
            }
            String filename = UUID.randomUUID().toString() + extension;

            // 保存文件
            Path filePath = uploadDir.resolve(filename);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            // 更新数据库中的用户头像路径
            User user = userOptional.get();
            user.setAvatarUrl(filename);
            userRepository.save(user);

            Map<String, Object> resp = new HashMap<>();
            resp.put("avatarUrl", filename);
            resp.put("message", "头像上传成功");

            return ResponseEntity.ok(resp);

        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("文件上传失败: " + e.getMessage());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("上传处理失败: " + e.getMessage());
        }
    }

    @PostMapping("/random-avatar")
    public ResponseEntity<?> setRandomAvatar(@RequestBody Map<String, String> payload) {
        try {
            String userIdStr = payload.get("userId");
            String avatarUrl = payload.get("avatarUrl");

            if (userIdStr == null || avatarUrl == null) {
                return ResponseEntity.badRequest().body("用户ID和头像URL不能为空");
            }

            Long userId = Long.parseLong(userIdStr);

            // 验证用户身份
            Optional<User> userOptional = userRepository.findById(userId);
            if (userOptional.isEmpty()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("用户不存在");
            }

            // 验证URL格式（确保是DiceBear API或其他可信来源）
            if (!avatarUrl.startsWith("https://api.dicebear.com/")) {
                return ResponseEntity.badRequest().body("无效的头像URL");
            }

            // 更新用户头像
            User user = userOptional.get();
            user.setAvatarUrl(avatarUrl);
            userRepository.save(user);

            Map<String, Object> resp = new HashMap<>();
            resp.put("avatarUrl", avatarUrl);
            resp.put("message", "随机头像设置成功");

            return ResponseEntity.ok(resp);

        } catch (NumberFormatException e) {
            return ResponseEntity.badRequest().body("用户ID格式错误");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("设置随机头像失败: " + e.getMessage());
        }
    }

    @GetMapping("/avatar/{filename}")
    public ResponseEntity<?> getAvatar(@PathVariable String filename) {
        try {
            Path filePath = Paths.get("uploads", "avatars", filename);
            if (!Files.exists(filePath)) {
                return ResponseEntity.notFound().build();
            }

            String contentType = "image/jpeg"; // 默认类型
            if (filename.toLowerCase().endsWith(".png")) {
                contentType = "image/png";
            } else if (filename.toLowerCase().endsWith(".gif")) {
                contentType = "image/gif";
            }

            return ResponseEntity.ok()
                    .header("Content-Type", contentType)
                    .body(Files.readAllBytes(filePath));

        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("获取头像失败");
        }
    }

    @PostMapping("/update-daily-tasks")
    public ResponseEntity<?> updateDailyTasks(@RequestBody Map<String, Object> payload) {
        try {
            Long userId = Long.parseLong(payload.get("userId").toString());
            Map<String, Object> tasks = (Map<String, Object>) payload.get("tasks");

            // 验证用户身份
            Optional<User> userOptional = userRepository.findById(userId);
            if (userOptional.isEmpty()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("用户不存在");
            }

            User user = userOptional.get();

            // 更新今日任务
            if (tasks.containsKey("checkInCompleted")) {
                user.setCheckInCompleted((Boolean) tasks.get("checkInCompleted"));
            }
            if (tasks.containsKey("learnWordsProgress")) {
                user.setLearnWordsProgress(((Number) tasks.get("learnWordsProgress")).intValue());
            }
            if (tasks.containsKey("reviewWordsProgress")) {
                user.setReviewWordsProgress(((Number) tasks.get("reviewWordsProgress")).intValue());
            }
            if (tasks.containsKey("studyTimeProgress")) {
                user.setStudyTimeProgress(((Number) tasks.get("studyTimeProgress")).intValue());
            }
            if (tasks.containsKey("lastTaskDate")) {
                user.setLastTaskDate((String) tasks.get("lastTaskDate"));
            }

            userRepository.save(user);

            Map<String, Object> resp = new HashMap<>();
            resp.put("message", "今日任务更新成功");

            return ResponseEntity.ok(resp);

        } catch (NumberFormatException e) {
            return ResponseEntity.badRequest().body("用户ID格式错误");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("更新今日任务失败: " + e.getMessage());
        }
    }
}

