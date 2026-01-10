import React, { useState } from 'react';
import { login, register } from '../api/authService';
import './AuthPanel.css';

export default function AuthPanel({ onLogin }) {
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
    } catch (err) {
      setError(err.message || '操作失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-panel">
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
        <input
          type="text"
          placeholder="用户名"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="密码"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <p className="auth-error">{error}</p>}
        <button type="submit" disabled={loading}>
          {loading ? '请稍候...' : mode === 'login' ? '登录' : '注册'}
        </button>
      </form>
      <p className="auth-tip">提示：登录后可以保存和管理属于自己的单词库。</p>
    </div>
  );
}

