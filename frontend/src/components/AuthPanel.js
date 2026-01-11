import React, { useState } from 'react';
import { login, register } from '../api/authService';
import './AuthPanel.css';

export default function AuthPanel({ onLogin, currentUser, onLogout }) {
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError('用户名和密码不能为空');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const action = mode === 'login' ? login : register;
      const result = await action(username.trim(), password.trim());
      onLogin?.(result);
      setPassword('');
      setUsername('');
    } catch (err) {
      setError(err.message || '操作失败');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
  };

  // 如果已登录,显示用户信息
  if (currentUser) {
    return (
      <div className="auth-panel">
        <div className="profile-container">
          <div className="profile-header">
            <div className="profile-avatar">
              {currentUser.username.charAt(0).toUpperCase()}
            </div>
            <h2>{currentUser.username}</h2>
            <p className="profile-user-id">ID: {currentUser.id}</p>
          </div>
          
          <div className="profile-actions">
            <button className="profile-btn" onClick={() => alert('个人设置功能开发中...')}>
              ⚙️ 个人设置
            </button>
            <button className="profile-btn" onClick={() => alert('学习统计功能开发中...')}>
              📊 学习统计
            </button>
            <button className="profile-btn" onClick={() => alert('数据导出功能开发中...')}>
              💾 数据导出
            </button>
            <button className="profile-btn logout-btn" onClick={handleLogout}>
              🚪 退出登录
            </button>
          </div>
          
          <div className="profile-tip">
            <p>✨ 登录成功！您可以：</p>
            <ul>
              <li>保存和管理个人单词库</li>
              <li>记录学习进度</li>
              <li>导入自定义单词</li>
              <li>查看学习统计</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  // 未登录状态,显示登录/注册表单
  return (
    <div className="auth-panel">
      <div className="auth-header">
        <h2>我的账户</h2>
        <p className="auth-subtitle">登录后可以保存和管理个人单词库</p>
      </div>
      
      <div className="auth-tabs">
        <button
          className={mode === 'login' ? 'active' : ''}
          onClick={() => setMode('login')}
        >
          登录
        </button>
        <button
          className={mode === 'register' ? 'active' : ''}
          onClick={() => setMode('register')}
        >
          注册
        </button>
      </div>
      
      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-group">
          <label>用户名</label>
          <input
            type="text"
            placeholder="请输入用户名"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        
        <div className="form-group">
          <label>密码</label>
          <input
            type="password"
            placeholder="请输入密码"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        
        {error && <p className="auth-error">{error}</p>}
        
        <button type="submit" disabled={loading} className="auth-submit-btn">
          {loading ? '请稍候...' : mode === 'login' ? '登录' : '注册'}
        </button>
      </form>
      
      <div className="auth-features">
        <h4>登录后可以享受：</h4>
        <ul>
          <li>📚 保存个人单词库</li>
          <li>📊 查看学习统计</li>
          <li>⬆️ 导入自定义单词</li>
          <li>☁️ 数据云端同步</li>
        </ul>
      </div>
    </div>
  );
}

