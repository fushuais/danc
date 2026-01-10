# 全栈单词应用

一个功能完整的全栈单词学习应用，支持用户注册登录、单词管理、背单词学习等功能。

## 功能特性

### 用户功能
- 用户注册与登录
- 头像上传（支持自定义图片和随机生成）
- 用户信息管理
- 每日任务系统（签到、背单词、复习、学习时长）

### 单词管理
- 添加单词和中文含义
- 批量导入单词（支持 TXT 文件）
- 删除单词
- 单词列表展示

### 背单词学习
- 翻转卡片学习模式
- 记住/忘记功能
- 学习进度追踪
- 记住次数统计

### 学习统计
- 学习数据统计
- 复习提醒
- 学习进度可视化

## 技术栈

### 前端
- React 18
- React Router
- CSS3

### 后端
- Spring Boot
- Spring Data JPA
- MySQL

## 快速开始

### 前端

```bash
cd frontend
npm install
npm start
```

前端服务运行在 `http://localhost:3000`

### 后端

```bash
cd backend
mvn spring-boot:run
```

后端服务运行在 `http://localhost:8082`

### 数据库配置

确保 MySQL 已安装并运行，创建数据库：

```sql
CREATE DATABASE vocabulary_db;
```

后端配置文件 `backend/src/main/resources/application.properties` 中已配置数据库连接：
- URL: `jdbc:mysql://localhost:3306/vocabulary_db`
- 用户名: `root`
- 密码: `yourpassword`

请根据实际情况修改数据库密码。

## 项目结构

```
react/
├── backend/           # Spring Boot 后端
│   ├── src/
│   │   └── main/
│   │       ├── java/com/example/vocabulary/
│   │       │   ├── AuthController.java
│   │       │   ├── WordController.java
│   │       │   ├── User.java
│   │       │   ├── Item.java
│   │       │   └── ...
│   │       └── resources/
│   │           └── application.properties
│   └── pom.xml
├── frontend/          # React 前端
│   ├── src/
│   │   ├── components/
│   │   │   ├── Home.js       # 首页
│   │   │   ├── WordList.js   # 单词管理
│   │   │   ├── WordCard.js   # 背单词
│   │   │   └── AuthPanel.js  # 用户认证
│   │   ├── api/
│   │   │   ├── authService.js
│   │   │   └── wordService.js
│   │   └── App.js
│   └── package.json
├── start-backend.sh   # 后端启动脚本
├── start-frontend.sh  # 前端启动脚本
└── README.md
```

## 使用说明

### 1. 启动服务

使用提供的启动脚本：

```bash
# 启动后端
./start-backend.sh

# 启动前端
./start-frontend.sh
```

### 2. 用户注册

首次使用需要注册账户，填写用户名和密码。

### 3. 添加单词

在单词管理页面，可以：
- 手动添加单词和中文含义
- 导入 TXT 文件批量添加（每行一个单词，格式：`word:meaning` 或 `word`）

### 4. 开始背单词

进入背单词页面，点击卡片翻转查看中文含义，选择"记住"或"忘记"。

### 5. 查看学习统计

在用户面板点击"学习统计"按钮，查看单词学习情况和复习提醒。

## API 接口

### 认证接口
- `POST /api/auth/register` - 用户注册
- `POST /api/auth/login` - 用户登录
- `POST /api/auth/verify` - 验证用户

### 单词接口
- `GET /api/words?userId={userId}` - 获取单词列表
- `GET /api/words/full?userId={userId}` - 获取完整单词信息
- `POST /api/words` - 添加单词
- `DELETE /api/words/{index}?userId={userId}` - 删除单词
- `POST /api/words/remember/{index}?userId={userId}` - 记录记住次数
- `GET /api/words/stats?userId={userId}` - 获取学习统计

## 待开发功能

- [ ] 单词分类管理
- [ ] 学习计划设置
- [ ] 多语言支持扩展
- [ ] 单词发音功能
- [ ] 学习数据导出
- [ ] 社交分享功能

## 许可证

MIT License

## 作者

fushuai
