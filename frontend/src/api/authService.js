// authService.js

// 动态获取API基础URL，适配不同环境的访问
const getApiBaseUrl = () => {
  const currentHost = window.location.hostname;
  const currentPort = window.location.port;

  console.log('🔍 API配置 - 当前主机:', currentHost, '端口:', currentPort);

  // 如果是localhost，使用localhost:8082
  if (currentHost === 'localhost' || currentHost === '127.0.0.1') {
    console.log('🏠 使用本地API地址: http://localhost:8082');
    return 'http://localhost:8082';
  }

  // 否则使用当前访问的域名/IP + 8082端口
  const apiUrl = `http://${currentHost}:8082`;
  console.log('🌐 使用远程API地址:', apiUrl);
  return apiUrl;
};

const AUTH_BASE_URL = `${getApiBaseUrl()}/api/auth`;

export const register = async (username, password) => {
  const response = await fetch(`${AUTH_BASE_URL}/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || `Failed to register: ${response.status}`);
  }

  return response.json();
};

export const login = async (username, password) => {
  console.log('🚀 发送登录请求到:', `${AUTH_BASE_URL}/login`);

  try {
    const response = await fetch(`${AUTH_BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    console.log('📡 登录响应状态:', response.status);

    if (!response.ok) {
      const text = await response.text();
      console.error('❌ 登录失败:', text);
      throw new Error(text || `Failed to login: ${response.status}`);
    }

    const result = await response.json();
    console.log('✅ 登录成功:', result);
    return result;
  } catch (error) {
    console.error('❌ 登录请求失败:', error);
    throw error;
  }
};

export const verifyUser = async (userId) => {
  console.log('🔍 调用 verifyUser API:', userId, `${AUTH_BASE_URL}/verify`);

  try {
    const response = await fetch(`${AUTH_BASE_URL}/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId }),
      // 添加超时设置
      signal: AbortSignal.timeout(5000)
    });

    console.log('📡 API响应状态:', response.status);

    if (!response.ok) {
      const text = await response.text();
      console.error('❌ API响应错误:', text);
      throw new Error(text || `Failed to verify user: ${response.status}`);
    }

    const result = await response.json();
    console.log('✅ API响应成功:', result);
    return result;
  } catch (error) {
    console.error('❌ API调用失败:', error.message);
    throw error;
  }
};

export const updateDailyTasks = async (userId, tasks) => {
  console.log('📝 调用 updateDailyTasks API:', userId, tasks);

  try {
    const response = await fetch(`${AUTH_BASE_URL}/update-daily-tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        tasks
      }),
      signal: AbortSignal.timeout(5000)
    });

    console.log('📡 API响应状态:', response.status);

    if (!response.ok) {
      const text = await response.text();
      console.error('❌ API响应错误:', text);
      throw new Error(text || `Failed to update daily tasks: ${response.status}`);
    }

    const result = await response.json();
    console.log('✅ API响应成功:', result);
    return result;
  } catch (error) {
    console.error('❌ API调用失败:', error.message);
    throw error;
  }
};

