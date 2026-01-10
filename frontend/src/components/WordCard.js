import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getWordsFull } from '../api/wordService';
import { updateDailyTasks } from '../api/authService';
import './WordCard.css';

export default function WordCard({ currentUser, onUserUpdate }) {
  const location = useLocation();
  const [words, setWords] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showMeaning, setShowMeaning] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rememberedCount, setRememberedCount] = useState(0);
  const [examples, setExamples] = useState([]);
  const [examplesExpanded, setExamplesExpanded] = useState(false);
  const [loadingExamples, setLoadingExamples] = useState(false);

  useEffect(() => {
    const fetchWords = async () => {
      // 如果用户未登录，仍然可以显示单词（但无法记录进度）
      try {
        setLoading(true);
        // 不传 userId，获取所有有含义的单词（与首页逻辑一致）
        const data = await getWordsFull(null);
        // 不过滤，显示所有单词（用于测试）
        const wordsToDisplay = data;

        console.log(`📊 单词统计: 总数 ${data.length}`);

        if (wordsToDisplay.length === 0) {
          setError('没有可背的单词，请先在单词管理中添加单词和中文意思');
          setWords([]);
        } else {
          setWords(wordsToDisplay);
          setCurrentIndex(0);
          setError(null);
        }
      } catch (err) {
        setError('获取单词列表失败');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchWords();
  }, []);

  // 监听路由变化，当导航到背单词页面时刷新单词列表
  useEffect(() => {
    if (location.pathname === '/study') {
      console.log('🔄 进入背单词页面，刷新单词列表');
      // 不传 userId，获取所有单词（与首页逻辑一致）
      getWordsFull(null).then(data => {
        const wordsToDisplay = data;

        console.log(`📊 单词统计: 总数 ${data.length}`);

        if (wordsToDisplay.length === 0) {
          setError('没有可背的单词，请先在单词管理中添加单词和中文意思');
          setWords([]);
        } else {
          const previousCount = words.length;
          setWords(wordsToDisplay);
          setCurrentIndex(0);

          if (previousCount > 0 && wordsToDisplay.length > previousCount) {
            setError(`发现 ${wordsToDisplay.length - previousCount} 个新单词！`);
            setTimeout(() => setError(null), 3000);
          } else {
            setError(null);
          }
        }
      }).catch(err => {
        setError('获取单词列表失败');
        console.error(err);
      });
    }
  }, [location.pathname]);

  // 监听页面可见性变化，当用户从其他页面回到背单词页面时刷新单词列表
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && currentUser) {
        // 页面变为可见时重新获取单词列表
        getWordsFull(currentUser.id).then(data => {
          const wordsToDisplay = data;

          if (wordsToDisplay.length > 0) {
            // 检查单词数量是否有变化
            if (wordsToDisplay.length !== words.length) {
              setWords(wordsToDisplay);
              setCurrentIndex(0);
              console.log('📚 单词列表已更新，包含新导入的单词');

              // 显示更新提示
              if (words.length > 0) {
                setError(`单词列表已更新！新增 ${wordsToDisplay.length - words.length} 个单词`);
                setTimeout(() => setError(null), 3000);
              } else {
                setError(null);
              }
            }
          }
        }).catch(err => {
          console.error('刷新单词列表失败:', err);
        });
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [currentUser, words.length]);

  const handleCardClick = () => {
    if (!showMeaning) {
      setShowMeaning(true);
    }
  };

  const handleNext = () => {
    setShowMeaning(false);
    if (currentIndex < words.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // 循环到第一个
      setCurrentIndex(0);
    }
  };

  const handleForget = () => {
    // 忘记：将当前单词移到后面，继续下一个
    if (words.length > 1) {
      const newWords = [...words];
      const currentWord = newWords.splice(currentIndex, 1)[0];
      newWords.push(currentWord);
      setWords(newWords);
      // 保持在当前索引（因为移除了一个，索引不变）
      if (currentIndex >= newWords.length) {
        setCurrentIndex(0);
      }
    }
    setShowMeaning(false);
  };

  const handleRemember = async () => {
    // 在切换到下一个之前，保存当前单词信息
    const wordToRemember = words[currentIndex];
    
    // 记住：直接下一个
    handleNext();

    // 记录记住次数（会话内计数，无论是否登录）
    const newCount = rememberedCount + 1;
    setRememberedCount(newCount);

    // 如果用户已登录，更新后端记住次数和任务进度
    if (currentUser && wordToRemember) {
      try {
        // 找到当前单词在单词列表中的索引，并更新后端记住次数
        const { getWordsFull, rememberWord: apiRememberWord } = await import('../api/wordService');
        // 获取所有单词来查找索引
        const allWords = await getWordsFull(null);
        const currentWordIndex = allWords.findIndex(word => word.word === wordToRemember.word);

        if (currentWordIndex !== -1) {
          // 调用后端API更新记住次数（需要传入 userId）
          await apiRememberWord(currentWordIndex, currentUser.id);
        }

        // 每记住10个单词（基于会话计数），增加背单词进度
        if (newCount % 10 === 0 && onUserUpdate) {
          try {
            // 获取当前任务状态
            const currentProgress = currentUser.dailyTasks?.learnWordsProgress || 0;

            // 增加10点进度（最多30点）
            const newProgress = Math.min(currentProgress + 10, 30);

            // 更新后端任务进度
            const backendTasks = {
              checkInCompleted: currentUser.dailyTasks?.checkInCompleted || false,
              learnWordsProgress: newProgress,
              reviewWordsProgress: currentUser.dailyTasks?.reviewWordsProgress || 0,
              studyTimeProgress: currentUser.dailyTasks?.studyTimeProgress || 0,
              lastTaskDate: new Date().toDateString()
            };

            await updateDailyTasks(currentUser.id, backendTasks);

            // 更新父组件的用户信息
            const updatedUser = {
              ...currentUser,
              dailyTasks: backendTasks
            };
            onUserUpdate(updatedUser);

            console.log(`背单词进度已增加！当前进度: ${newProgress}/30`);
          } catch (error) {
            console.error('更新背单词进度失败:', error);
          }
        }
      } catch (error) {
        console.error('更新记住次数失败:', error);
      }
    }
  };

  // 移除登录检查，允许未登录用户也能背单词（但无法记录进度）

  // 调用本地例句数据库获取例句（免费）
  const fetchExamples = async (word) => {
    try {
      setLoadingExamples(true);
      const response = await fetch('/api/examples', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ word }),
      });

      if (!response.ok) {
        throw new Error('获取例句失败');
      }

      const data = await response.json();
      setExamples(data.examples || []);
      setExamplesExpanded(false);
    } catch (error) {
      console.error('获取例句失败:', error);
      setExamples([]);
    } finally {
      setLoadingExamples(false);
    }
  };

  // 当卡片翻转时获取例句
  useEffect(() => {
    if (showMeaning && currentWord) {
      const parsedWord = parseWord(currentWord.word);
      if (parsedWord.english) {
        fetchExamples(parsedWord.english);
      }
    } else {
      setExamples([]);
      setExamplesExpanded(false);
    }
  }, [showMeaning, currentIndex]);

  // 切换例句展开状态
  const toggleExamples = () => {
    setExamplesExpanded(!examplesExpanded);
  };

  if (loading) {
    return (
      <div className="word-card-container">
        <p>加载中...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="word-card-container">
        <p className="error">{error}</p>
      </div>
    );
  }

  if (words.length === 0) {
    return (
      <div className="word-card-container">
        <p>没有可背的单词，请先在单词管理中添加单词和中文意思</p>
      </div>
    );
  }

  const currentWord = words[currentIndex];

  // 从 word 字段中提取英文单词和中文意思
  const parseWord = (wordText) => {
    // 格式类似: "abandon [əˈbændən] vt.丢弃；放弃，抛弃"
    // 匹配单词开头（英文）和后面的音标、中文意思
    const match = wordText.match(/^([a-zA-Z]+)\s+(.*)/);
    if (match) {
      return {
        english: match[1],
        content: match[2] // 包含音标和中文意思
      };
    }
    // 如果没有匹配到，返回完整文本
    return {
      english: wordText,
      content: ''
    };
  };

  const parsedWord = parseWord(currentWord.word);

  return (
    <div className="word-card-container">
      <div className="word-progress">
        {currentIndex + 1} / {words.length}
        {rememberedCount > 0 && (
          <span className="remember-count"> | 本次记住: {rememberedCount}</span>
        )}
      </div>
      <div
        className={`word-card ${showMeaning ? 'flipped' : ''}`}
        onClick={handleCardClick}
      >
        <div className="word-card-front">
          <div className="word-text english-word">{parsedWord.english}</div>
          <div className="hint">点击显示中文意思</div>
        </div>
        <div className="word-card-back">
          <div className="word-text english-word">{parsedWord.english}</div>
          <div className="meaning-text">{parsedWord.content || currentWord.meaning || '暂无中文含义'}</div>
        </div>
      </div>
      {showMeaning && (
        <>
          <div className="examples-section">
            {loadingExamples ? (
              <div className="examples-loading">加载例句中...</div>
            ) : examples.length > 0 ? (
              <>
                <div className="examples-header">
                  <span className="examples-title">相关例句</span>
                  <button className="examples-toggle-btn" onClick={toggleExamples}>
                    {examplesExpanded ? '⬇️' : '⬇️'}
                  </button>
                </div>
                <div className={`examples-list ${examplesExpanded ? 'expanded' : ''}`}>
                  {examples.slice(0, examplesExpanded ? examples.length : 3).map((example, index) => (
                    <div key={index} className="example-item">
                      <div className="example-english">{example.english}</div>
                      <div className="example-chinese">{example.chinese}</div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="examples-empty">暂无例句</div>
            )}
          </div>
          <div className="word-actions">
            <button className="btn-forget" onClick={handleForget}>
              忘记
            </button>
            <button className="btn-remember" onClick={handleRemember}>
              记住
            </button>
          </div>
        </>
      )}
    </div>
  );
}
