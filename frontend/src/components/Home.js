import React, { useState } from 'react';
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
      path: '/japanese'
    },
    {
      id: 'korean',
      name: '韩语',
      icon: '🇰🇷',
      color: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
      path: '/korean'
    }
  ]);

  const [draggedIndex, setDraggedIndex] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleLanguageClick = (language) => {
    if (isDragging) return;
    console.log('选择语言:', language.name);
    navigate(language.path);
  };

  const handleDragStart = (e, index) => {
    console.log('drag start', index, e.type);
    setDraggedIndex(index);
    setIsDragging(true);
    if (e.dataTransfer) {
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/html', e.target.innerHTML);
      // 某些浏览器需要至少一种数据类型
      e.dataTransfer.setData('text/plain', '');
    }
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    if (e.dataTransfer) {
      e.dataTransfer.dropEffect = 'move';
    }
    console.log('drag over', index, e.type);
    if (draggedIndex !== null && draggedIndex !== index) {
      setDragOverIndex(index);
    }
  };

  const handleDragLeave = () => {
    console.log('drag leave');
    setDragOverIndex(null);
  };

  const handleDrop = (e, dropIndex) => {
    console.log('drop', dropIndex, e.type);
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
    console.log('drag end');
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
      <div className="languages-grid">
        {languages.map((language, index) => (
          <div
            key={language.id}
            className={`language-card ${draggedIndex === index ? 'dragging' : ''}`}
            style={getCardStyle(index)}
            onClick={() => handleLanguageClick(language)}
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
