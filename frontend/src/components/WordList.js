import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import './WordList.css';
import { getWords, addWord, deleteWord } from '../api/wordService';


// 优化的列表项组件
const WordListItem = React.memo(({ word, index, onDelete, isDeleting }) => {
  const handleDelete = useCallback(() => {
    if (!isDeleting) {
      onDelete(index);
    }
  }, [index, onDelete, isDeleting]);

  return (
    <li>
      {word}
      <button onClick={handleDelete} disabled={isDeleting}>
        {isDeleting ? '删除中...' : '删除'}
      </button>
    </li>
  );
});

WordListItem.displayName = 'WordListItem';

export default function WordList({ currentUser }) {
  const [words, setWords] = useState([]);
  const [newWord, setNewWord] = useState('');
  const [newMeaning, setNewMeaning] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [deletingIndex, setDeletingIndex] = useState(null);
  
  // 使用 ref 存储节流状态
  const addThrottleRef = useRef(null);
  const deleteThrottleRef = useRef(null);
  const fetchingRef = useRef(false);

  // 获取单词列表
  useEffect(() => {
    const fetchWords = async () => {
      // 如果用户未登录，直接设置 loading 为 false
      if (!currentUser || !currentUser.id) {
        setLoading(false);
        setWords([]);
        fetchingRef.current = false;
        return;
      }
      
      // 如果正在请求中，不重复请求
      if (fetchingRef.current) {
        return;
      }
      
      fetchingRef.current = true;
      
      try {
        setLoading(true);
        const data = await getWords(currentUser.id);
        setWords(data || []);
        setError(null);
      } catch (err) {
        setError('获取单词列表失败');
        console.error('获取单词列表失败:', err);
        setWords([]);
      } finally {
        setLoading(false);
        fetchingRef.current = false;
      }
    };
    
    fetchWords();
  }, [currentUser?.id]);

  // 清理定时器，避免内存泄漏
  useEffect(() => {
    return () => {
      if (addThrottleRef.current) {
        clearTimeout(addThrottleRef.current);
      }
      if (deleteThrottleRef.current) {
        clearTimeout(deleteThrottleRef.current);
      }
    };
  }, []);

  // 处理添加单词（使用节流）
  const handleAddWord = useCallback(async () => {
    if (!newWord.trim() || isAdding) return;
    
    if (!currentUser) {
      setError('请先登录后再添加单词');
      return;
    }

    // 清除之前的节流
    if (addThrottleRef.current) {
      clearTimeout(addThrottleRef.current);
    }

    // 设置新的节流
    addThrottleRef.current = setTimeout(async () => {
      setIsAdding(true);
      try {
        const wordData = {
          word: newWord.trim(),
          ...(newMeaning.trim() && { meaning: newMeaning.trim() })
        };
        await addWord(wordData, currentUser.id);
        
        // 优化：直接更新本地状态，而不是重新获取整个列表
        setWords(prevWords => [...prevWords, wordData.word]);
        setNewWord('');
        setNewMeaning('');
        setError(null);
      } catch (err) {
        setError('添加单词失败: ' + (err.message || '未知错误'));
        console.error(err);
        // 如果添加失败，重新获取列表以确保数据一致性
        try {
          const data = await getWords(currentUser.id);
          setWords(data);
        } catch (fetchErr) {
          console.error('重新获取单词列表失败:', fetchErr);
        }
      } finally {
        setIsAdding(false);
        addThrottleRef.current = null;
      }
    }, 300);
  }, [newWord, newMeaning, currentUser, isAdding]);

  // 处理删除单词（使用节流）
  const handleDeleteWord = useCallback(async (index) => {
    if (!currentUser || deletingIndex !== null) {
      return;
    }

    // 清除之前的节流
    if (deleteThrottleRef.current) {
      clearTimeout(deleteThrottleRef.current);
    }

    // 设置新的节流
    deleteThrottleRef.current = setTimeout(async () => {
      setDeletingIndex(index);
      try {
        await deleteWord(index, currentUser.id);
        
        // 优化：直接更新本地状态，而不是重新获取整个列表
        setWords(prevWords => prevWords.filter((_, i) => i !== index));
        setError(null);
      } catch (err) {
        setError('删除单词失败');
        console.error(err);
        // 如果删除失败，重新获取列表以确保数据一致性
        try {
          const data = await getWords(currentUser.id);
          setWords(data);
        } catch (fetchErr) {
          console.error('重新获取单词列表失败:', fetchErr);
        }
      } finally {
        setDeletingIndex(null);
        deleteThrottleRef.current = null;
      }
    }, 200);
  }, [currentUser, deletingIndex]);

  // 使用 useMemo 优化列表渲染
  const wordListItems = useMemo(() => {
    return words.map((word, index) => (
      <WordListItem
        key={`${word}-${index}`}
        word={word}
        index={index}
        onDelete={handleDeleteWord}
        isDeleting={deletingIndex === index}
      />
    ));
  }, [words, handleDeleteWord, deletingIndex]);

  // 处理输入变化（使用 useCallback 优化）
  const handleNewWordChange = useCallback((e) => {
    setNewWord(e.target.value);
  }, []);

  const handleNewMeaningChange = useCallback((e) => {
    setNewMeaning(e.target.value);
  }, []);

  // 处理回车键
  const handleKeyPress = useCallback((e) => {
    if (e.key === 'Enter' && !isAdding) {
      handleAddWord();
    }
  }, [handleAddWord, isAdding]);

  if (!currentUser) {
    return (
      <div className="word-list">
        <h2>单词管理</h2>
        <div style={{ textAlign: 'center', padding: '40px 20px' }}>
          <p style={{ color: '#666', marginBottom: '20px' }}>
            请先登录后才能管理您的单词
          </p>
          <p style={{ fontSize: '14px', color: '#999' }}>
            登录后您可以添加、删除和管理属于自己的单词库
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="word-list">
      <h2>单词管理</h2>
      {error && <p className="error">{error}</p>}
      {loading ? (
        <p>加载中...</p>
      ) : (
        <>
          <div className="word-input">
            <input
              type="text"
              value={newWord}
              onChange={handleNewWordChange}
              placeholder="输入新单词"
              onKeyPress={handleKeyPress}
              disabled={isAdding}
            />
            <input
              type="text"
              value={newMeaning}
              onChange={handleNewMeaningChange}
              placeholder="输入中文意思（可选）"
              onKeyPress={handleKeyPress}
              disabled={isAdding}
            />
            <button onClick={handleAddWord} disabled={isAdding}>
              {isAdding ? '添加中...' : '添加'}
            </button>
          </div>
          {words.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#666', marginTop: '20px' }}>
              暂无数据，请添加单词
            </p>
          ) : (
            <ul>
              {wordListItems}
            </ul>
          )}
        </>
      )}
    </div>
  );
}