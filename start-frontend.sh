#!/bin/bash

echo "修复npm缓存权限问题..."
sudo chown -R $(whoami) ~/.npm

echo "进入前端目录..."
cd frontend

echo "安装依赖..."
npm install

echo "启动前端开发服务器..."
npm start