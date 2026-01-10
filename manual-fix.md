# 手动修复npm网络超时问题

## 问题描述
npm安装依赖时遇到 `ERR_SOCKET_TIMEOUT` 错误

## 解决方案

### 方案1：修复npm权限并切换镜像源
```bash
# 1. 修复npm缓存权限
sudo chown -R $(whoami) ~/.npm

# 2. 清理缓存
npm cache clean --force

# 3. 切换到淘宝镜像
npm config set registry https://registry.npmmirror.com

# 4. 或者尝试华为镜像
npm config set registry https://mirrors.huaweicloud.com/repository/npm/
```

### 方案2：使用yarn替代npm
```bash
# 1. 安装yarn
npm install -g yarn

# 2. 设置yarn镜像
yarn config set registry https://registry.npmmirror.com

# 3. 进入前端目录
cd frontend

# 4. 安装依赖
yarn install

# 5. 启动项目
yarn start
```

### 方案3：使用cnpm（淘宝npm客户端）
```bash
# 1. 安装cnpm
npm install -g cnpm --registry=https://registry.npmmirror.com

# 2. 进入前端目录
cd frontend

# 3. 使用cnpm安装
cnpm install

# 4. 启动项目
cnpm start
```

### 方案4：手动下载依赖包
如果网络问题持续，可以考虑：
1. 使用VPN
2. 在网络更好的环境下安装
3. 检查防火墙设置

### 验证安装成功
安装完成后，检查 `node_modules` 目录是否存在，并且可以运行：
```bash
cd frontend
npm start
```

## 常用npm镜像源
- 官方：`https://registry.npmjs.org`
- 淘宝：`https://registry.npmmirror.com`
- 华为：`https://mirrors.huaweicloud.com/repository/npm/`
- 中科院：`https://npmreg.proxy.ustclug.org`

## 故障排除
如果仍然有问题，检查：
1. 网络连接是否正常
2. 是否在企业网络环境中
3. 防火墙是否阻止了npm访问