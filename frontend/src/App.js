import React, { useEffect, useState, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import './index.css';
import WordList from './components/WordList';
import WordCard from './components/WordCard';
import Home from './components/Home';
import AuthPanel from './components/AuthPanel';
import { verifyUser, updateDailyTasks } from './api/authService';

function UserPanel({ currentUser, onClose, isVisible, isAnimating, onUserUpdate, onStatsClick, importLoading, importFile, onFileSelect, onImportWords }) {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const fileInputRef = useRef(null);

  // 今日任务状态
  const [dailyTasks, setDailyTasks] = useState({
    checkIn: { completed: false, progress: 0 },
    learnWords: { completed: false, progress: 0 },
    reviewWords: { completed: false, progress: 0 },
    studyTime: { completed: false, progress: 0 }
  });

  // 当currentUser变化时，更新今日任务状态
  React.useEffect(() => {
    if (currentUser && currentUser.dailyTasks) {
      const tasks = currentUser.dailyTasks;
      const today = new Date().toDateString();

      // 检查是否需要重置（新的一天）
      if (tasks.lastTaskDate !== today) {
        setDailyTasks({
          checkIn: { completed: false, progress: 0 },
          learnWords: { completed: false, progress: 0 },
          reviewWords: { completed: false, progress: 0 },
          studyTime: { completed: false, progress: 0 }
        });
      } else {
        setDailyTasks({
          checkIn: { completed: tasks.checkInCompleted || false, progress: tasks.checkInCompleted ? 30 : 0 },
          learnWords: { completed: (tasks.learnWordsProgress || 0) >= 30, progress: tasks.learnWordsProgress || 0 },
          reviewWords: { completed: (tasks.reviewWordsProgress || 0) >= 30, progress: tasks.reviewWordsProgress || 0 },
          studyTime: { completed: (tasks.studyTimeProgress || 0) >= 10, progress: tasks.studyTimeProgress || 0 }
        });
      }
    }
  }, [currentUser]);

  // 获取用户头像URL（优先使用上传的图片，否则使用默认头像）
  const getAvatarUrl = () => {
    if (currentUser && currentUser.avatarUrl) {
      // 如果是DiceBear随机头像URL，直接返回
      if (currentUser.avatarUrl.startsWith('https://api.dicebear.com/')) {
        return currentUser.avatarUrl;
      }
      // 如果是上传的文件，使用API路径
      return `/api/auth/avatar/${currentUser.avatarUrl}`;
    }
    return null;
  };

  // 处理文件选择
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // 验证文件类型
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      setUploadError('只支持 JPG、PNG、GIF 格式的图片');
      return;
    }

    // 验证文件大小 (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('图片大小不能超过 5MB');
      return;
    }

    setSelectedImage(file);
    setUploadError(null);

    // 创建预览
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  // 生成随机头像URL
  const generateRandomAvatar = () => {
    // 使用 DiceBear API 生成随机头像
    // 可以使用多种风格：adventurer, avataaars, big-ears, etc.
    const styles = ['adventurer', 'avataaars', 'big-ears', 'big-smile', 'bottts', 'croodles', 'identicon', 'initials', 'lorelei', 'miniavs', 'open-peeps', 'personas', 'pixel-art'];
    const randomStyle = styles[Math.floor(Math.random() * styles.length)];
    const seed = Math.random().toString(36).substring(2, 15);
    return `https://api.dicebear.com/7.x/${randomStyle}/svg?seed=${seed}`;
  };

  // 处理随机头像
  const handleRandomAvatar = async () => {
    setUploading(true);
    setUploadError(null);

    try {
      const randomAvatarUrl = generateRandomAvatar();

      const response = await fetch('/api/auth/random-avatar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: currentUser.id,
          avatarUrl: randomAvatarUrl
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `设置随机头像失败: ${response.status}`);
      }

      const result = await response.json();

      // 更新当前用户信息
      const updatedUser = {
        ...currentUser,
        avatarUrl: randomAvatarUrl
      };

      // 通知父组件更新用户信息
      if (onUserUpdate) {
        onUserUpdate(updatedUser);
      }

      alert('随机头像设置成功！');

    } catch (error) {
      console.error('设置随机头像失败:', error);
      setUploadError(error.message || '设置失败，请重试');
    } finally {
      setUploading(false);
    }
  };

  // 处理头像上传
  const handleAvatarUpload = async () => {
    if (!selectedImage) return;

    setUploading(true);
    setUploadError(null);

    try {
      const formData = new FormData();
      formData.append('avatar', selectedImage);
      formData.append('userId', currentUser.id.toString());

      const response = await fetch('/api/auth/avatar', {
        method: 'POST',
        body: formData,
        // 注意：这里不设置 Content-Type，让浏览器自动设置 multipart/form-data
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `上传失败: ${response.status}`);
      }

      const result = await response.json();

      // 更新当前用户信息
      const updatedUser = {
        ...currentUser,
        avatarUrl: result.avatarUrl
      };

      // 通知父组件更新用户信息
      if (onUserUpdate) {
        onUserUpdate(updatedUser);
      }

      setSelectedImage(null);
      setImagePreview(null);
      alert('头像上传成功！');

    } catch (error) {
      console.error('头像上传失败:', error);
      setUploadError(error.message || '上传失败，请重试');
    } finally {
      setUploading(false);
    }
  };

  // 取消选择
  const handleCancelSelection = () => {
    setSelectedImage(null);
    setImagePreview(null);
    setUploadError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // 任务处理函数
  const handleTaskClick = async (taskType) => {
    if (!currentUser) return;

    setDailyTasks(prev => {
      const task = prev[taskType];
      let newProgress = task.progress;
      let newCompleted = task.completed;

      switch (taskType) {
        case 'checkIn':
          // 每日签到是一次性任务，点击后直接完成，不可以取消
          if (!task.completed) {
            newCompleted = true;
            newProgress = 30;
          }
          break;
        case 'learnWords':
          newProgress = Math.min(task.progress + 10, 30);
          newCompleted = newProgress >= 30;
          break;
        case 'reviewWords':
          newProgress = Math.min(task.progress + 5, 30);
          newCompleted = newProgress >= 30;
          break;
        case 'studyTime':
          newProgress = Math.min(task.progress + 1, 10); // 10分钟为满，每次点击增加1分钟
          newCompleted = newProgress >= 10;
          break;
        default:
          break;
      }

      const newTasks = {
        ...prev,
        [taskType]: {
          completed: newCompleted,
          progress: newProgress
        }
      };

      // 保存到后端
      const backendTasks = {
        checkInCompleted: newTasks.checkIn.completed,
        learnWordsProgress: newTasks.learnWords.progress,
        reviewWordsProgress: newTasks.reviewWords.progress,
        studyTimeProgress: newTasks.studyTime.progress,
        lastTaskDate: new Date().toDateString()
      };

      updateDailyTasks(currentUser.id, backendTasks).then(() => {
        // 更新成功后，更新父组件的用户信息
        const updatedUser = {
          ...currentUser,
          dailyTasks: backendTasks
        };
        if (onUserUpdate) {
          onUserUpdate(updatedUser);
        }
      }).catch(error => {
        console.error('保存今日任务失败:', error);
        // 这里可以添加用户提示
      });

      return newTasks;
    });
  };

  if (!currentUser || (!isVisible && !isAnimating)) return null;

  const avatarUrl = getAvatarUrl();

  // 进度条组件
  const ProgressBar = ({ progress, maxProgress, completed, showNumbers = true }) => {
    const percentage = (progress / maxProgress) * 100;
    const isCompleted = completed || progress >= maxProgress;

    return (
      <div className="task-progress-bar-wrapper">
        <div className="task-progress-bar-container">
          <div
            className={`task-progress-bar ${isCompleted ? 'task-completed' : ''}`}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>
        {showNumbers && (
          <div className="task-progress-text">
            {progress}/{maxProgress}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {/* 遮罩层 */}
      <div
        className={`user-panel-overlay ${isAnimating ? 'fade-out' : ''}`}
        onClick={onClose}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.3)',
          zIndex: 1000,
        }}
      />
      {/* 用户面板 */}
      <div className={`user-panel ${isAnimating ? 'fade-out' : ''}`}>
        <div className="user-panel-header">
          <h3>用户信息</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        <div className="user-panel-content">
          {/* 头像区域 */}
          <div className="avatar-section">
            <div className="avatar-container">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="头像预览"
                  className="avatar-preview"
                />
              ) : avatarUrl ? (
                <div className="avatar-wrapper">
                  <img
                    src={avatarUrl}
                    alt="用户头像"
                    className="avatar-image"
                    onError={(e) => {
                      console.error('头像加载失败:', avatarUrl);
                      // 隐藏失败的图片，显示占位符
                      e.target.style.display = 'none';
                      const placeholder = e.target.parentNode.querySelector('.avatar-placeholder');
                      if (placeholder) placeholder.style.display = 'flex';
                    }}
                    onLoad={() => {
                      // 确保占位符隐藏
                      const placeholder = document.querySelector('.avatar-placeholder');
                      if (placeholder) placeholder.style.display = 'none';
                    }}
                  />
                  <div className="avatar-placeholder" style={{ display: 'none' }}>
                    {currentUser.username.charAt(0).toUpperCase()}
                  </div>
                </div>
              ) : (
                <div className="avatar-placeholder">
                  {currentUser.username.charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            {/* 文件选择区域 */}
            <div className="avatar-controls">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                accept="image/jpeg,image/jpg,image/png,image/gif"
                style={{ display: 'none' }}
              />
              <div className="avatar-button-group">
                <button
                  className="avatar-btn"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                >
                  选择图片
                </button>
                <button
                  className="random-avatar-btn"
                  onClick={handleRandomAvatar}
                  disabled={uploading}
                >
                  🎲 随机头像
                </button>
              </div>

              {selectedImage && (
                <div className="upload-controls">
                  <button
                    className="upload-btn"
                    onClick={handleAvatarUpload}
                    disabled={uploading}
                  >
                    {uploading ? '上传中...' : '上传头像'}
                  </button>
                  <button
                    className="cancel-btn"
                    onClick={handleCancelSelection}
                    disabled={uploading}
                  >
                    取消
                  </button>
                </div>
              )}
            </div>

            {uploadError && (
              <div className="upload-error">
                {uploadError}
              </div>
            )}

            {!avatarUrl && (
              <div className="avatar-hint">
                支持 JPG、PNG、GIF 格式，最大 5MB，或使用随机头像
              </div>
            )}
          </div>

          <div className="user-info">
            <h4>{currentUser.username}</h4>
            <p>ID: {currentUser.id}</p>
          </div>

          {/* 今日任务区域 */}
          <div className="daily-tasks-section">
            <h4 className="section-title">今日任务</h4>
            <div className="tasks-list">
              <div
                className={`task-item ${dailyTasks.checkIn.completed ? 'completed' : ''}`}
                onClick={() => !dailyTasks.checkIn.completed && handleTaskClick('checkIn')}
              >
                <div className="task-info">
                  <span className="task-icon">
                    {dailyTasks.checkIn.completed ? '✅' : '📅'}
                  </span>
                  <span className="task-name">每日签到</span>
                  {dailyTasks.checkIn.completed && (
                    <span className="task-status">已完成</span>
                  )}
                </div>
                {dailyTasks.checkIn.completed ? (
                  <div className="completed-indicator">✓</div>
                ) : (
                  <ProgressBar
                    progress={0}
                    maxProgress={1}
                    completed={false}
                    showNumbers={true}
                  />
                )}
              </div>

              <div className="task-item" onClick={() => handleTaskClick('learnWords')}>
                <div className="task-info">
                  <span className="task-icon">📚</span>
                  <span className="task-name">背单词</span>
                </div>
                <ProgressBar
                  progress={dailyTasks.learnWords.progress}
                  maxProgress={30}
                  completed={dailyTasks.learnWords.completed}
                  showNumbers={true}
                />
              </div>

              <div className="task-item" onClick={() => handleTaskClick('reviewWords')}>
                <div className="task-info">
                  <span className="task-icon">🔄</span>
                  <span className="task-name">复习单词</span>
                </div>
                <ProgressBar
                  progress={dailyTasks.reviewWords.progress}
                  maxProgress={30}
                  completed={dailyTasks.reviewWords.completed}
                  showNumbers={true}
                />
              </div>

              <div className="task-item" onClick={() => handleTaskClick('studyTime')}>
                <div className="task-info">
                  <span className="task-icon">⏱️</span>
                  <span className="task-name">学习时长</span>
                </div>
                <ProgressBar
                  progress={dailyTasks.studyTime.progress}
                  maxProgress={10}
                  completed={dailyTasks.studyTime.completed}
                  showNumbers={true}
                />
              </div>
            </div>
          </div>

          <div className="user-actions">
            <button className="action-btn">个人设置</button>
            <button className="action-btn" onClick={onStatsClick}>学习统计</button>
            <div className="import-section">
              <input
                type="file"
                id="word-import-input"
                accept=".txt"
                onChange={onFileSelect}
                style={{ display: 'none' }}
              />
              <button
                className="action-btn"
                onClick={() => document.getElementById('word-import-input').click()}
                disabled={importLoading}
                title="支持格式: 单词 或 单词:含义 (每行一个)"
              >
                📁 {importFile ? `已选择文件` : '导入单词'}
              </button>
              {importFile && (
                <button
                  className="action-btn"
                  onClick={onImportWords}
                  disabled={importLoading}
                >
                  {importLoading ? '📤 导入中...' : '✅ 确认导入'}
                </button>
              )}
            </div>
            <button className="action-btn">数据导出</button>
          </div>
        </div>
      </div>
    </>
  );
}


function Navigation({ currentUser, onLogout, onUserIconClick }) {
  const location = useLocation();

  // 获取用户头像URL
  const getNavAvatarUrl = () => {
    if (currentUser && currentUser.avatarUrl) {
      // 如果是DiceBear随机头像URL，直接返回
      if (currentUser.avatarUrl.startsWith('https://api.dicebear.com/')) {
        return currentUser.avatarUrl;
      }
      // 如果是上传的文件，使用API路径
      return `/api/auth/avatar/${currentUser.avatarUrl}`;
    }
    return null;
  };

  const navAvatarUrl = getNavAvatarUrl();

  return (
    <nav className="app-nav">
      <div className="app-nav-left">
        <h1>单词学习应用</h1>
      </div>
      <div className="app-nav-right">
        {currentUser && (
          <>
            <button className="logout-btn" onClick={onLogout}>退出登录</button>
            <button className="user-icon-btn" onClick={onUserIconClick}>
              {navAvatarUrl ? (
                <div className="nav-avatar-wrapper">
                  <img
                    src={navAvatarUrl}
                    alt="用户头像"
                    className="nav-user-avatar"
                    onError={(e) => {
                      console.error('导航栏头像加载失败:', navAvatarUrl);
                      // 隐藏失败的图片，显示占位符
                      e.target.style.display = 'none';
                      const placeholder = e.target.parentNode.querySelector('.user-avatar-fallback');
                      if (placeholder) placeholder.style.display = 'flex';
                    }}
                    onLoad={(e) => {
                      // 确保占位符隐藏
                      const placeholder = e.target.parentNode.querySelector('.user-avatar-fallback');
                      if (placeholder) placeholder.style.display = 'none';
                    }}
                  />
                  <div className="user-avatar-fallback" style={{ display: 'none' }}>
                    {currentUser.username.charAt(0).toUpperCase()}
                  </div>
                </div>
              ) : (
                <div className="user-avatar-fallback">
                  {currentUser.username.charAt(0).toUpperCase()}
                </div>
              )}
            </button>
          </>
        )}
      </div>
    </nav>
  );
}


// 底部导航栏组件
function BottomNavigation({ currentUser }) {
  const location = useLocation();

  const handleNavClick = (e, requiresAuth = true) => {
    if (requiresAuth && !currentUser) {
      e.preventDefault();
      alert('请先登录后再使用此功能');
      return false;
    }
  };

  return (
    <nav className="bottom-nav">
      <Link
        to="/home"
        className={`bottom-nav-item ${location.pathname === '/home' ? 'active' : ''}`}
        onClick={(e) => handleNavClick(e, false)}
      >
        <div className="nav-icon">🏠</div>
        <div className="nav-text">首页</div>
      </Link>
      <Link
        to="/"
        className={`bottom-nav-item ${location.pathname === '/' ? 'active' : ''}`}
        onClick={(e) => handleNavClick(e, false)}
      >
        <div className="nav-icon">📝</div>
        <div className="nav-text">单词管理</div>
      </Link>
      <Link
        to="/study"
        className={`bottom-nav-item ${location.pathname === '/study' ? 'active' : ''} ${!currentUser ? 'disabled' : ''}`}
        onClick={(e) => handleNavClick(e, true)}
      >
        <div className="nav-icon">📚</div>
        <div className="nav-text">背单词</div>
      </Link>
    </nav>
  );
}

// 学习统计弹窗组件
function StatsPanel({ isVisible, onClose, stats, loading }) {
  if (!isVisible) return null;

  const getReviewStatus = (count, needsReview) => {
    if (needsReview) {
      return { text: '需要复习', color: '#dc3545' };
    }
    if (count >= 5) {
      return { text: '掌握良好', color: '#28a745' };
    }
    return { text: '基本掌握', color: '#ffc107' };
  };

  return (
    <>
      {/* 遮罩层 */}
      <div
        className="stats-panel-overlay"
        onClick={onClose}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 1100,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* 统计面板 */}
        <div
          className="stats-panel"
          onClick={(e) => e.stopPropagation()}
          style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            width: '90%',
            maxWidth: '600px',
            maxHeight: '80vh',
            overflow: 'hidden',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
          }}
        >
          {/* 头部 */}
          <div
            style={{
              padding: '20px',
              borderBottom: '1px solid #e9ecef',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <h3 style={{ margin: 0, color: '#333' }}>学习统计</h3>
            <button
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '24px',
                cursor: 'pointer',
                color: '#666',
                padding: '0',
                width: '30px',
                height: '30px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              ×
            </button>
          </div>

          {/* 内容 */}
          <div style={{ padding: '20px', maxHeight: 'calc(80vh - 80px)', overflowY: 'auto' }}>
            {loading ? (
              <div style={{ textAlign: 'center', padding: '40px' }}>
                <p>加载中...</p>
              </div>
            ) : stats.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px' }}>
                <p style={{ color: '#666' }}>暂无学习数据</p>
              </div>
            ) : (
              <>
                {/* 统计概览 */}
                <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
                  <h4 style={{ margin: '0 0 10px 0', color: '#333' }}>学习概览</h4>
                  <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                    <div>
                      <strong>总单词数:</strong> {stats.length}
                    </div>
                    <div>
                      <strong>需要复习:</strong> {stats.filter(s => s.needsReview).length}
                    </div>
                    <div>
                      <strong>平均记住次数:</strong> {(stats.reduce((sum, s) => sum + (s.rememberedCount || 0), 0) / stats.length).toFixed(1)}
                    </div>
                  </div>
                </div>

                {/* 单词列表 */}
                <div>
                  <h4 style={{ margin: '0 0 15px 0', color: '#333' }}>单词详情</h4>
                  <div style={{ display: 'grid', gap: '10px' }}>
                    {stats.map((stat, index) => {
                      const status = getReviewStatus(stat.rememberedCount || 0, stat.needsReview);
                      return (
                        <div
                          key={stat.id || index}
                          style={{
                            padding: '12px 16px',
                            border: '1px solid #e9ecef',
                            borderRadius: '8px',
                            backgroundColor: 'white',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                          }}
                        >
                          <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: '600', color: '#333', marginBottom: '4px' }}>
                              {stat.word}
                            </div>
                            {stat.meaning && (
                              <div style={{ color: '#666', fontSize: '14px' }}>
                                {stat.meaning}
                              </div>
                            )}
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ textAlign: 'center' }}>
                              <div style={{ fontSize: '18px', fontWeight: '600', color: '#333' }}>
                                {stat.rememberedCount || 0}
                              </div>
                              <div style={{ fontSize: '12px', color: '#666' }}>记住次数</div>
                            </div>
                            <div
                              style={{
                                padding: '4px 8px',
                                borderRadius: '12px',
                                fontSize: '12px',
                                fontWeight: '500',
                                color: 'white',
                                backgroundColor: status.color,
                              }}
                            >
                              {status.text}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

// iOS设备检测和优化
const useIOSOptimizations = () => {
  useEffect(() => {
    // 检测iOS设备
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

    if (isIOS) {
      // 防止iOS Safari的弹性滚动
      document.body.style.overscrollBehavior = 'none';

      // 防止双击缩放
      let lastTouchEnd = 0;
      document.addEventListener('touchend', (event) => {
        const now = Date.now();
        if (now - lastTouchEnd <= 300) {
          event.preventDefault();
        }
        lastTouchEnd = now;
      }, false);

      // 优化iOS Safari的视口高度
      const setVH = () => {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
      };

      setVH();
      window.addEventListener('resize', setVH);
      window.addEventListener('orientationchange', setVH);

      return () => {
        window.removeEventListener('resize', setVH);
        window.removeEventListener('orientationchange', setVH);
      };
    }
  }, []);
};

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [isUserPanelVisible, setIsUserPanelVisible] = useState(false);
  const [isUserPanelAnimating, setIsUserPanelAnimating] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isStatsPanelVisible, setIsStatsPanelVisible] = useState(false);
  const [learningStats, setLearningStats] = useState([]);
  const [statsLoading, setStatsLoading] = useState(false);
  const [importLoading, setImportLoading] = useState(false);
  const [importFile, setImportFile] = useState(null);

  // 应用iOS优化
  useIOSOptimizations();

  // 调试网络连接
  useEffect(() => {
    console.log('🌐 App启动 - 当前URL:', window.location.href);
    console.log('🏠 当前主机:', window.location.hostname);
    console.log('🔌 当前端口:', window.location.port);

    // 测试API连接
    const testApiConnection = async () => {
      const testUrls = [
        'http://localhost:8082/api/auth/verify',
        `http://${window.location.hostname}:8082/api/auth/verify`
      ];

      for (const url of testUrls) {
        try {
          console.log('🔍 测试API连接:', url);
          const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: 1 })
          });
          console.log(`✅ ${url} - 响应状态:`, response.status);
        } catch (error) {
          console.log(`❌ ${url} - 连接失败:`, error.message);
        }
      }
    };

    testApiConnection();
  }, []);

  useEffect(() => {
    // 如果正在退出登录，跳过自动恢复
    if (isLoggingOut) {
      return;
    }

    const verifyStoredUser = async () => {
      const stored = localStorage.getItem('vocab_user');
      if (stored) {
        try {
          const userData = JSON.parse(stored);

          // 检查登录是否过期（3天）
          const now = Date.now();
          const expiryTime = userData.expiry || 0;
          if (now > expiryTime) {
            // 已过期，清除本地存储
            localStorage.removeItem('vocab_user');
            return;
          }

          try {
            // 验证用户会话是否仍然有效
            await verifyUser(userData.id);
            setCurrentUser(userData);
          } catch (apiError) {
            // 在开发环境下，如果API调用失败但localStorage数据看起来有效，我们可以信任它
            // 这避免了网络问题导致的频繁重新登录
            if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
              setCurrentUser(userData);
            } else {
              // 生产环境清除存储
              localStorage.removeItem('vocab_user');
            }
          }
        } catch {
          // 验证失败，清除本地存储
          localStorage.removeItem('vocab_user');
        }
      }
    };
    verifyStoredUser();
  }, [isLoggingOut]);

  const handleLogin = (user) => {
    // 设置3天过期时间
    const expiryTime = Date.now() + (3 * 24 * 60 * 60 * 1000); // 3天
    console.log('🎯 登录设置:', {
      user,
      currentTime: new Date().toLocaleString(),
      expiryTime: new Date(expiryTime).toLocaleString(),
      expiryMs: expiryTime
    });

    const userData = {
      ...user,
      expiry: expiryTime
    };
    setCurrentUser(user); // 只设置原始用户数据到state
    localStorage.setItem('vocab_user', JSON.stringify(userData)); // 存储包含expiry的数据
  };

  const handleUserIconClick = () => {
    setIsUserPanelVisible(true);
  };

  const handleCloseUserPanel = () => {
    // 先设置动画状态，播放淡出动画
    setIsUserPanelAnimating(true);

    // 动画结束后隐藏面板
    setTimeout(() => {
      setIsUserPanelVisible(false);
      setIsUserPanelAnimating(false);
    }, 300); // 与CSS动画时间匹配
  };

  const handleUserUpdate = (updatedUser) => {
    setCurrentUser(updatedUser);
    // 更新localStorage
    const stored = localStorage.getItem('vocab_user');
    if (stored) {
      const userData = JSON.parse(stored);
      // 更新所有可能改变的字段
      if (updatedUser.avatarUrl !== undefined) {
        userData.avatarUrl = updatedUser.avatarUrl;
      }
      if (updatedUser.dailyTasks !== undefined) {
        userData.dailyTasks = updatedUser.dailyTasks;
      }
      localStorage.setItem('vocab_user', JSON.stringify(userData));
    }
  };

  const handleStatsClick = async () => {
    if (!currentUser) return;

    setStatsLoading(true);
    setIsStatsPanelVisible(true);

    try {
      const { getLearningStats } = await import('./api/wordService');
      const stats = await getLearningStats(currentUser.id);
      setLearningStats(stats);
    } catch (error) {
      console.error('获取学习统计失败:', error);
      setLearningStats([]);
    } finally {
      setStatsLoading(false);
    }
  };

  const handleCloseStatsPanel = () => {
    setIsStatsPanelVisible(false);
    setLearningStats([]);
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'text/plain') {
      setImportFile(file);
    } else {
      alert('请选择txt格式的文件');
    }
  };

  const handleImportWords = async () => {
    if (!importFile || !currentUser) return;

    setImportLoading(true);
    try {
      const text = await importFile.text();
      const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);

      let successCount = 0;
      let failCount = 0;

      for (const line of lines) {
        try {
          let word = '';
          let meaning = '';

          // 支持多种格式解析
          if (line.includes(':')) {
            // 格式1: word:meaning
            const parts = line.split(':');
            word = parts[0].trim();
            meaning = parts.slice(1).join(':').trim(); // 处理含义中可能包含冒号的情况
          } else if (line.includes('\t')) {
            // 格式2: word\tmeaning (制表符分隔)
            const parts = line.split('\t');
            word = parts[0].trim();
            meaning = parts.slice(1).join('\t').trim();
          } else if (line.match(/^[a-zA-Z]+/)) {
            // 格式3: 尝试提取单词部分，其余作为含义
            // 例如: abandon [əˈbændən] vt.丢弃；放弃，抛弃
            const wordMatch = line.match(/^([a-zA-Z]+(?:-[a-zA-Z]+)*)/);
            if (wordMatch) {
              word = wordMatch[1];
              const rest = line.substring(word.length).trim();
              if (rest) {
                meaning = rest;
              }
            }
          }

          // 如果仍然没有提取到单词，跳过这一行
          if (!word) {
            console.warn('无法解析这一行，跳过:', line);
            failCount++;
            continue;
          }

          // 如果没有含义，尝试从单词本身提取
          if (!meaning && word.includes(' ')) {
            // 处理类似 "hello 你好" 的格式
            const parts = word.split(' ');
            if (parts.length >= 2) {
              const englishWord = parts[0];
              const chineseMeaning = parts.slice(1).join(' ');
              word = englishWord;
              meaning = chineseMeaning;
            }
          }

          const wordData = { word, userId: currentUser.id };
          if (meaning) {
            wordData.meaning = meaning;
          }

          console.log('导入单词:', word, '含义:', meaning);
          await import('./api/wordService').then(module => module.addWord(wordData));
          successCount++;
        } catch (error) {
          console.error('导入单词失败:', line, error);
          failCount++;
        }
      }

      alert(`导入完成！成功: ${successCount} 个，失败: ${failCount} 个`);
      setImportFile(null);

      // 清除文件输入
      const fileInput = document.getElementById('word-import-input');
      if (fileInput) fileInput.value = '';

    } catch (error) {
      console.error('读取文件失败:', error);
      alert('读取文件失败，请重试');
    } finally {
      setImportLoading(false);
    }
  };

  const performLogout = () => {
    // 设置退出登录标志，阻止useEffect自动恢复
    setIsLoggingOut(true);

    // 清除用户状态
    setCurrentUser(null);
    localStorage.removeItem('vocab_user');

    // 短暂延迟后重置退出登录标志
    setTimeout(() => {
      setIsLoggingOut(false);
    }, 500);
  };

  const handleLogout = () => {
    // 先关闭用户面板（带动画）
    if (isUserPanelVisible) {
      setIsUserPanelAnimating(true);
      setTimeout(() => {
        setIsUserPanelVisible(false);
        setIsUserPanelAnimating(false);

        // 然后执行登出逻辑
        performLogout();
      }, 300);
    } else {
      performLogout();
    }
  };




  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1>单词学习应用</h1>
          <Navigation
            key={currentUser ? currentUser.id : 'no-user'}
            currentUser={currentUser}
            onLogout={handleLogout}
            onUserIconClick={handleUserIconClick}
          />
        </header>
        <main>
          {!currentUser && <AuthPanel onLogin={handleLogin} />}
          <Routes>
            <Route path="/home" element={<Home />} />
            <Route path="/" element={<WordList currentUser={currentUser} />} />
            <Route path="/study" element={<WordCard currentUser={currentUser} onUserUpdate={handleUserUpdate} />} />
          </Routes>
        </main>

        {/* 底部导航栏 */}
        <BottomNavigation currentUser={currentUser} />

        <UserPanel
          currentUser={currentUser}
          isVisible={isUserPanelVisible}
          isAnimating={isUserPanelAnimating}
          onClose={handleCloseUserPanel}
          onUserUpdate={handleUserUpdate}
          onStatsClick={handleStatsClick}
          importLoading={importLoading}
          importFile={importFile}
          onFileSelect={handleFileSelect}
          onImportWords={handleImportWords}
        />

        {/* 学习统计弹窗 */}
        <StatsPanel
          isVisible={isStatsPanelVisible}
          onClose={handleCloseStatsPanel}
          stats={learningStats}
          loading={statsLoading}
        />
      </div>
    </Router>
  );
}

export default App;