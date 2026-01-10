-- 修复数据库结构，添加今日任务字段
USE vocabulary_db;

-- 1. 删除外键约束（如果存在）
ALTER TABLE item DROP FOREIGN KEY FKc4s174l330le17rblwgyjawev;

-- 2. 删除有问题的记录（如果有的话）
DELETE FROM item WHERE user_id NOT IN (SELECT id FROM users);

-- 3. 重新添加外键约束
ALTER TABLE item ADD CONSTRAINT FK_item_user FOREIGN KEY (user_id) REFERENCES users (id);

-- 4. 为users表添加今日任务字段
ALTER TABLE users
ADD COLUMN check_in_completed BOOLEAN NOT NULL DEFAULT FALSE,
ADD COLUMN learn_words_progress INT NOT NULL DEFAULT 0,
ADD COLUMN review_words_progress INT NOT NULL DEFAULT 0,
ADD COLUMN study_time_progress INT NOT NULL DEFAULT 0,
ADD COLUMN last_task_date VARCHAR(20) NULL;

-- 5. 检查结果
SELECT 'Users table structure:' as info;
DESCRIBE users;

SELECT 'Items count:' as info, COUNT(*) as count FROM item;
SELECT 'Users count:' as info, COUNT(*) as count FROM users;