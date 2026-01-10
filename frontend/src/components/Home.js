import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

export default function Home() {
  const navigate = useNavigate();

  const languages = [
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
  ];

  const handleLanguageClick = (language) => {
    console.log('选择语言:', language.name);
    navigate(language.path);
  };

  return (
    <div className="home-container">
      <div className="home-header">
        <h1>选择学习语言</h1>
        <p className="home-subtitle">点击选择你想学习的语言</p>
      </div>
      <div className="languages-grid">
        {languages.map((language) => (
          <div
            key={language.id}
            className="language-card"
            style={{ background: language.color }}
            onClick={() => handleLanguageClick(language)}
          >
            <div className="language-icon">{language.icon}</div>
            <div className="language-name">{language.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
