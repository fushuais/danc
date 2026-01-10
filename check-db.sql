-- 检查数据库状态的SQL脚本
-- 请在MySQL中运行以下命令

-- 1. 检查数据库是否存在
SHOW DATABASES LIKE 'vocabulary_db';

-- 2. 使用数据库
USE vocabulary_db;

-- 3. 检查表结构
SHOW TABLES;

-- 4. 检查用户表
SELECT COUNT(*) as total_users FROM user;
SELECT id, username FROM user LIMIT 5;

-- 5. 检查单词表
SELECT COUNT(*) as total_items FROM item;
SELECT id, word, meaning, user_id FROM item LIMIT 10;

-- 6. 检查特定用户的单词
-- 将USER_ID替换为实际的用户ID
-- SELECT word, meaning FROM item WHERE user_id = USER_ID ORDER BY id;