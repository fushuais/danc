package com.example.vocabulary;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class WordController {

    @Autowired
    private ItemRepository itemRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private OnlineExampleService onlineExampleService;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @GetMapping("/words")
    public List<String> getWords(@RequestParam(required = false) Long userId) {
        try {
            List<Item> items;
            
            if (userId == null) {
                // userId 为 null 时，返回所有单词（用于首页）
                items = itemRepository.findAll();
                System.out.println("📚 获取所有单词列表，总数: " + items.size());
            } else {
                // 验证用户存在
                if (!userRepository.existsById(userId)) {
                    return List.of();
                }
                items = itemRepository.findByUserIdOrderByIdAsc(userId);
                System.out.println("📚 获取用户 " + userId + " 的单词列表，数量: " + items.size());
            }
            
            return items.stream()
                    .map(Item::getWord)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            System.err.println("❌ 获取单词列表失败: " + e.getMessage());
            return List.of();
        }
    }

    @GetMapping("/words/full")
    public List<Item> getWordsFull(@RequestParam(required = false) Long userId) {
        if (userId == null) {
            // userId 为 null 时，返回所有单词（不过滤）
            List<Item> allItems = itemRepository.findAll();
            System.out.println("📚 获取所有单词列表，总数: " + allItems.size());
            return allItems;
        }

        // 验证用户存在
        if (!userRepository.existsById(userId)) {
            return List.of();
        }

        List<Item> userItems = itemRepository.findByUserIdOrderByIdAsc(userId);
        System.out.println("📚 获取用户 " + userId + " 的单词列表，数量: " + userItems.size());
        return userItems;
    }

    @PostMapping("/words")
    public ResponseEntity<String> addWord(@RequestBody Map<String, Object> requestBody) {
        try {
            System.out.println("📥 收到添加单词请求: " + requestBody);

            // 验证用户是否登录
            Object userIdObj = requestBody.get("userId");
            if (userIdObj == null) {
                System.out.println("❌ 用户未登录");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("请先登录");
            }

            Long userId;
            if (userIdObj instanceof Number) {
                userId = ((Number) userIdObj).longValue();
            } else if (userIdObj instanceof String) {
                userId = Long.parseLong((String) userIdObj);
            } else {
                System.out.println("❌ 用户ID格式错误: " + userIdObj.getClass());
                return ResponseEntity.badRequest().body("用户ID格式错误");
            }

            System.out.println("👤 验证用户ID: " + userId);

            // 验证用户存在
            Optional<User> userOptional = userRepository.findById(userId);
            if (userOptional.isEmpty()) {
                System.out.println("❌ 用户不存在: " + userId);
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("用户不存在");
            }
            User user = userOptional.get();
            System.out.println("✅ 用户验证成功: " + user.getUsername());

            // 提取单词数据
            Object wordObj = requestBody.get("word");
            if (wordObj == null || !(wordObj instanceof String) || ((String) wordObj).trim().isEmpty()) {
                System.out.println("❌ 单词不能为空");
                return ResponseEntity.badRequest().body("单词不能为空");
            }

            String word = ((String) wordObj).trim();
            System.out.println("📝 单词: " + word);

            // 创建并保存单词
            Item item = new Item();
            item.setWord(word);
            item.setUser(user);

            // 可选的中文意思
            Object meaningObj = requestBody.get("meaning");
            if (meaningObj instanceof String && !((String) meaningObj).trim().isEmpty()) {
                item.setMeaning(((String) meaningObj).trim());
                System.out.println("📝 中文意思: " + item.getMeaning());
            }

            Item savedItem = itemRepository.save(item);
            System.out.println("✅ 单词保存成功，ID: " + savedItem.getId());

            return ResponseEntity.ok("单词添加成功！");
        } catch (Exception e) {
            System.err.println("❌ 添加单词异常: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("添加单词失败: " + e.getMessage());
        }
    }

    @DeleteMapping("/words/{index}")
    public ResponseEntity<String> deleteWord(@PathVariable int index, @RequestParam Long userId) {
        try {
            if (userId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("请先登录");
            }

            // 验证用户存在
            if (!userRepository.existsById(userId)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("用户不存在");
            }

            List<Item> userItems = itemRepository.findByUserIdOrderByIdAsc(userId);
            if (index >= 0 && index < userItems.size()) {
                Item itemToDelete = userItems.get(index);
                itemRepository.deleteById(itemToDelete.getId());
                return ResponseEntity.ok("单词删除成功！");
            } else {
                return ResponseEntity.badRequest().body("无效的索引！");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("删除单词失败: " + e.getMessage());
        }
    }

    @PostMapping("/words/remember/{index}")
    public ResponseEntity<String> rememberWord(@PathVariable int index, @RequestParam Long userId) {
        try {
            if (userId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("请先登录");
            }

            // 验证用户存在
            if (!userRepository.existsById(userId)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("用户不存在");
            }

            List<Item> userItems = itemRepository.findByUserIdOrderByIdAsc(userId);
            if (index >= 0 && index < userItems.size()) {
                Item item = userItems.get(index);
                // 增加记住次数
                Integer currentCount = item.getRememberedCount() != null ? item.getRememberedCount() : 0;
                item.setRememberedCount(currentCount + 1);
                itemRepository.save(item);
                return ResponseEntity.ok("单词记住次数已更新！");
            } else {
                return ResponseEntity.badRequest().body("无效的索引！");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("更新记住次数失败: " + e.getMessage());
        }
    }

    @GetMapping("/words/stats")
    public ResponseEntity<List<Map<String, Object>>> getLearningStats(@RequestParam Long userId) {
        try {
            if (userId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }

            // 验证用户存在
            if (!userRepository.existsById(userId)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }

            List<Item> userItems = itemRepository.findByUserIdOrderByIdAsc(userId);

            List<Map<String, Object>> stats = userItems.stream()
                    .map(item -> {
                        Map<String, Object> stat = new java.util.HashMap<>();
                        stat.put("id", item.getId());
                        stat.put("word", item.getWord());
                        stat.put("meaning", item.getMeaning());
                        stat.put("rememberedCount", item.getRememberedCount() != null ? item.getRememberedCount() : 0);
                        // 根据记住次数判断是否需要重新学习
                        Integer count = item.getRememberedCount() != null ? item.getRememberedCount() : 0;
                        stat.put("needsReview", count < 3); // 记住少于3次需要复习
                        return stat;
                    })
                    .collect(Collectors.toList());

            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * 获取单词例句（优先本地，失败时尝试在线免费API）
     */
    @PostMapping("/examples")
    public ResponseEntity<?> getExamples(@RequestBody Map<String, String> request) {
        try {
            String word = request.get("word");
            if (word == null || word.trim().isEmpty()) {
                return ResponseEntity.badRequest().body("单词不能为空");
            }

            System.out.println("📖 请求获取例句: " + word);

            // 从在线服务获取例句（优先本地，失败时使用API）
            List<Map<String, String>> examples = onlineExampleService.getExamples(word);

            return ResponseEntity.ok(Map.of(
                "word", word,
                "examples", examples,
                "hasExamples", !examples.isEmpty()
            ));
        } catch (Exception e) {
            System.err.println("❌ 获取例句失败: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("获取例句失败: " + e.getMessage());
        }
    }
}
