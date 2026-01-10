import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

export default function Home() {
  const navigate = useNavigate();
  const [languages, setLanguages] = useState([
    {
      id: 'english',
      name: '英语',
      icon: '🇬🇧',
      color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      path: '/'
    },
    {
      id: 'spanish',
      name: '西班牙语',
      icon: '🇪🇸',
      color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      path: '/study'
    },
    {
      id: 'japanese',
      name: '日语',
      icon: '🇯🇵',
      color: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      path: '/study'
    },
    {
      id: 'korean',
      name: '韩语',
      icon: '🇰🇷',
      color: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
      path: '/study'
    }
  ]);

  const [draggedIndex, setDraggedIndex] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const pressTimerRef = useRef(null);

  const handleLanguageClick = (language, e) => {
    if (isDragging) return;
    console.log('选择语言:', language.name);
    navigate(language.path);
  };

  const handleDragStart = (e, index) => {
    setDraggedIndex(index);
    setIsDragging(true);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', e.target.innerHTML);
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (draggedIndex !== null && draggedIndex !== index) {
      setDragOverIndex(index);
    }
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleDrop = (e, dropIndex) => {
    e.preventDefault();
    if (draggedIndex !== null && draggedIndex !== dropIndex) {
      const newLanguages = [...languages];
      const draggedItem = newLanguages[draggedIndex];
      newLanguages.splice(draggedIndex, 1);
      newLanguages.splice(dropIndex, 0, draggedItem);
      setLanguages(newLanguages);

      if (navigator.vibrate) {
        navigator.vibrate(30);
      }
    }
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const getCardStyle = (index) => {
    const style = { background: languages[index].color };

    if (draggedIndex === index) {
      return {
        ...style,
        opacity: '0.5',
        transform: 'scale(1.1)',
        cursor: 'grabbing'
      };
    } else if (dragOverIndex === index) {
      return {
        ...style,
        transform: 'scale(1.08)',
        boxShadow: '0 15px 35px rgba(0, 0, 0, 0.25)'
      };
    }

    return style;
  };

  return (
    <div className="home-container">
      <div className="home-header">
        <h1>选择学习语言</h1>
        <p className="home-subtitle">点击选择你想学习的语言，长按拖动可调整顺序</p>
      </div>
      <div className="languages-grid">
        {languages.map((language, index) => (
          <div
            key={language.id}
            className={`language-card ${draggedIndex === index ? 'dragging' : ''}`}
            style={getCardStyle(index)}
            onClick={(e) => handleLanguageClick(language, e)}
            draggable={true}
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, index)}
            onDragEnd={handleDragEnd}
          >
            <div className="language-icon">{language.icon}</div>
            <div className="language-name">{language.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
