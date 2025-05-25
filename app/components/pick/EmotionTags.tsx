'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TagIcon } from '@heroicons/react/24/outline';

interface EmotionTag {
  id: string;
  label: string;
  color: string;
  gradient: string;
  description: string;
  icon: string;
}

const emotionTags: EmotionTag[] = [
  { 
    id: 'excited', 
    label: '설렘', 
    color: '#FF6B6B', 
    gradient: 'from-pink-400 to-red-400',
    description: '가슴이 두근거리는 설렘',
    icon: '✨'
  },
  { 
    id: 'curious', 
    label: '호기심', 
    color: '#4ECDC4', 
    gradient: 'from-purple-400 to-mint-400',
    description: '새로운 발견의 기쁨',
    icon: '🔍'
  },
  { 
    id: 'peaceful', 
    label: '고요함', 
    color: '#95E1D3', 
    gradient: 'from-blue-400 to-teal-400',
    description: '마음이 편안해지는 순간',
    icon: '🌿'
  },
  { 
    id: 'happy', 
    label: '행복', 
    color: '#FFD93D', 
    gradient: 'from-yellow-400 to-orange-400',
    description: '따뜻한 행복이 가득한',
    icon: '☀️'
  },
  { 
    id: 'nostalgic', 
    label: '그리움', 
    color: '#6C5CE7', 
    gradient: 'from-purple-400 to-indigo-400',
    description: '추억이 새록새록',
    icon: '💫'
  },
];

interface EmotionTagsProps {
  onSelect: (emotion: EmotionTag) => void;
  onKeywordsChange: (keywords: string[]) => void;
  selectedEmotion?: EmotionTag;
}

export default function EmotionTags({ onSelect, onKeywordsChange, selectedEmotion }: EmotionTagsProps) {
  const [keywords, setKeywords] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [announcement, setAnnouncement] = useState('');

  useEffect(() => {
    if (selectedEmotion) {
      setAnnouncement(`${selectedEmotion.label} 감정이 선택되었습니다. ${selectedEmotion.description}`);
    }
  }, [selectedEmotion]);

  const handleKeywordAdd = () => {
    if (inputValue.trim() && !keywords.includes(inputValue.trim())) {
      const newKeywords = [...keywords, inputValue.trim()];
      setKeywords(newKeywords);
      onKeywordsChange(newKeywords);
      setInputValue('');
      setAnnouncement(`키워드 "${inputValue.trim()}"가 추가되었습니다.`);
    }
  };

  const handleKeywordRemove = (keyword: string) => {
    const newKeywords = keywords.filter(k => k !== keyword);
    setKeywords(newKeywords);
    onKeywordsChange(newKeywords);
    setAnnouncement(`키워드 "${keyword}"가 제거되었습니다.`);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleKeywordAdd();
    }
  };

  return (
    <div className="space-y-6">
      <div 
        role="status" 
        aria-live="polite" 
        className="sr-only"
      >
        {announcement}
      </div>

      <div className="grid grid-cols-3 gap-3">
        {emotionTags.map((emotion) => (
          <motion.button
            key={emotion.id}
            whileHover={{ scale: 1.05, rotate: 1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelect(emotion)}
            className={`group relative p-4 rounded-lg text-center transition-all duration-300 ${
              selectedEmotion?.id === emotion.id
                ? `bg-gradient-to-r ${emotion.gradient} text-white`
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
            aria-label={`${emotion.label} 감정 선택`}
            aria-pressed={selectedEmotion?.id === emotion.id}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="text-2xl mb-2"
            >
              {emotion.icon}
            </motion.div>
            <span className="block font-medium">{emotion.label}</span>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent rounded-lg pointer-events-none"
            />
          </motion.button>
        ))}
      </div>

      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <TagIcon className="w-5 h-5 text-gray-400" />
          <h3 className="text-sm font-medium text-gray-700">키워드 추가</h3>
        </div>
        <div className="flex space-x-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="키워드를 입력하세요"
            className="flex-1 p-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            aria-label="키워드 입력"
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleKeywordAdd}
            className="px-4 py-2 text-sm text-white bg-pink-500 rounded-lg hover:bg-pink-600"
            aria-label="키워드 추가"
          >
            추가
          </motion.button>
        </div>
        <AnimatePresence>
          {keywords.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="flex flex-wrap gap-2"
            >
              {keywords.map((keyword) => (
                <motion.div
                  key={keyword}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  className="flex items-center space-x-1 px-3 py-1 bg-gray-100 rounded-full"
                >
                  <span className="text-sm text-gray-700">{keyword}</span>
                  <button
                    onClick={() => handleKeywordRemove(keyword)}
                    className="text-gray-400 hover:text-gray-600"
                    aria-label={`${keyword} 키워드 제거`}
                  >
                    ×
                  </button>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
} 