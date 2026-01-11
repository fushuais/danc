import React from 'react';
import { useNavigate } from 'react-router-dom';
import './KoreanPage.css';

export default function KoreanPage() {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/home');
  };

  return (
    <div className="korean-page">
      <div className="korean-header">
        <button className="back-button" onClick={handleBack}>
          <span className="back-arrow">←</span>
          <span className="back-text">返回</span>
        </button>
        <h1>韩语学习</h1>
      </div>
      <div className="korean-content">
        <div className="welcome-section">
          <h2>欢迎学习韩语</h2>
          <p>这里将是韩语学习的主页面。功能正在开发中...</p>
          <div className="placeholder">
            <p>你可以在这里添加韩语单词学习、语法练习、听力训练等内容。</p>
          </div>
        </div>
        <div className="quick-actions">
          <div className="action-card">
            <div className="action-icon">📚</div>
            <div className="action-title">背单词</div>
            <div className="action-desc">学习常用韩语词汇</div>
          </div>
          <div className="action-card">
            <div className="action-icon">🗣️</div>
            <div className="action-title">练发音</div>
            <div className="action-desc">练习韩语发音和语调</div>
          </div>
          <div className="action-card">
            <div className="action-icon">✍️</div>
            <div className="action-title">写韩文</div>
            <div className="action-desc">学习韩文字母和书写</div>
          </div>
          <div className="action-card">
            <div className="action-icon">🎧</div>
            <div className="action-title">听力练习</div>
            <div className="action-desc">通过听力提高理解能力</div>
          </div>
        </div>
      </div>
    </div>
  );
}