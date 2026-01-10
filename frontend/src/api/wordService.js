// wordService.js

// 动态获取API基础URL，适配不同环境的访问
const getApiBaseUrl = () => {
  const currentHost = window.location.hostname;

  // 如果是localhost，使用localhost:8082
  if (currentHost === 'localhost' || currentHost === '127.0.0.1') {
    return 'http://localhost:8082';
  }

  // 否则使用当前访问的域名/IP + 8082端口
  return `http://${currentHost}:8082`;
};

const API_BASE_URL = `${getApiBaseUrl()}/api/words`;

// 获取单词列表
export const getWords = async (userId = null) => {
  try {
    const url = userId ? `${API_BASE_URL}?userId=${userId}` : API_BASE_URL;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch words');
    }
    const data = await response.json();
    // 后端返回的是字符串数组，直接返回
    return data;
  } catch (error) {
    console.error('Error fetching words:', error);
    throw error;
  }
};

// 添加单词
export const addWord = async (word, userId = null) => {
  try {
    const requestData = userId ? { ...word, userId } : word;
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    });
    if (!response.ok) {
      throw new Error(`Failed to add word: ${response.status} ${response.statusText}`);
    }
    // 后端返回字符串 "Word added successfully!"
    return await response.text();
  } catch (error) {
    console.error('Error adding word:', error.message, 'URL:', API_BASE_URL);
    throw error;
  }
};

// 获取完整单词列表（包含word和meaning）
export const getWordsFull = async (userId = null) => {
  try {
    const url = userId ? `${API_BASE_URL}/full?userId=${userId}` : `${API_BASE_URL}/full`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch words');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching words:', error);
    throw error;
  }
};

// 批量添加单词
export const addWordsBatch = async (words) => {
  try {
    const promises = words.map(word => addWord(word));
    const results = await Promise.all(promises);
    return results;
  } catch (error) {
    console.error('Error adding words batch:', error);
    throw error;
  }
};

// 删除单词（使用索引）
export const deleteWord = async (index, userId = null) => {
  try {
    const url = userId ? `${API_BASE_URL}/${index}?userId=${userId}` : `${API_BASE_URL}/${index}`;
    const response = await fetch(url, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete word');
    }
    // 后端返回字符串 "Word deleted successfully!"
    return await response.text();
  } catch (error) {
    console.error('Error deleting word:', error);
    throw error;
  }
};

// 记住单词（更新记住次数）
export const rememberWord = async (index, userId = null) => {
  try {
    const url = userId ? `${API_BASE_URL}/remember/${index}?userId=${userId}` : `${API_BASE_URL}/remember/${index}`;
    const response = await fetch(url, {
      method: 'POST',
    });
    if (!response.ok) {
      throw new Error('Failed to remember word');
    }
    return await response.text();
  } catch (error) {
    console.error('Error remembering word:', error);
    throw error;
  }
};

// 获取学习统计数据
export const getLearningStats = async (userId = null) => {
  try {
    const url = userId ? `${API_BASE_URL}/stats?userId=${userId}` : `${API_BASE_URL}/stats`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch learning stats');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching learning stats:', error);
    throw error;
  }
};
