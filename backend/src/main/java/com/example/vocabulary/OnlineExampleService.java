package com.example.vocabulary;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class OnlineExampleService {

    @Autowired
    private RestTemplate restTemplate;

    @Autowired
    private ExampleSentenceService localExampleService;

    private final ObjectMapper objectMapper = new ObjectMapper();

    /**
     * 获取单词例句（优先使用本地，失败时尝试在线API）
     */
    public List<Map<String, String>> getExamples(String word) {
        // 1. 先尝试本地数据库
        List<Map<String, String>> localExamples = localExampleService.getExamples(word);
        if (!localExamples.isEmpty()) {
            return localExamples;
        }

        // 2. 本地没有，尝试在线API
        try {
            return fetchOnlineExamples(word);
        } catch (Exception e) {
            System.err.println("在线API失败: " + e.getMessage());
            return new ArrayList<>();
        }
    }

    /**
     * 从免费词典API获取例句
     * 使用 Free Dictionary API: https://api.dictionaryapi.dev/
     */
    private List<Map<String, String>> fetchOnlineExamples(String word) throws Exception {
        // 提取纯英文单词
        String cleanWord = extractEnglishWord(word);

        // 调用 Free Dictionary API
        String url = "https://api.dictionaryapi.dev/api/v2/entries/en/" + cleanWord;
        ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);

        if (!response.getStatusCode().is2xxSuccessful()) {
            throw new RuntimeException("API调用失败");
        }

        JsonNode root = objectMapper.readTree(response.getBody());

        if (!root.isArray() || root.size() == 0) {
            return new ArrayList<>();
        }

        List<Map<String, String>> examples = new ArrayList<>();

        // 解析返回的JSON
        JsonNode meanings = root.get(0).get("meanings");
        if (meanings != null && meanings.isArray()) {
            for (JsonNode meaning : meanings) {
                JsonNode definitions = meaning.get("definitions");
                if (definitions != null && definitions.isArray()) {
                    for (JsonNode def : definitions) {
                        // 提取例句
                        JsonNode exampleNode = def.get("example");
                        if (exampleNode != null && !exampleNode.isNull()) {
                            String english = exampleNode.asText();

                            // 添加中文翻译（简单的占位符或自动翻译）
                            Map<String, String> exampleMap = new HashMap<>();
                            exampleMap.put("english", english);
                            exampleMap.put("chinese", "[需要翻译] " + english); // 可以集成其他翻译API

                            examples.add(exampleMap);

                            // 最多返回5条
                            if (examples.size() >= 5) {
                                break;
                            }
                        }
                    }
                    if (examples.size() >= 5) break;
                }
            }
        }

        System.out.println("✅ 从在线API获取到 " + examples.size() + " 条例句");
        return examples;
    }

    /**
     * 检查单词是否有例句
     */
    public boolean hasExamples(String word) {
        return localExampleService.hasExamples(word);
    }

    /**
     * 从单词字符串中提取纯英文单词
     */
    private String extractEnglishWord(String wordText) {
        java.util.regex.Pattern pattern = java.util.regex.Pattern.compile("^([a-zA-Z]+)");
        java.util.regex.Matcher matcher = pattern.matcher(wordText);
        if (matcher.find()) {
            return matcher.group(1);
        }
        return wordText;
    }
}
