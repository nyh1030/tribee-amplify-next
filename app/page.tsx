'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HeartIcon, MapPinIcon, ClockIcon, FireIcon, ChatBubbleLeftIcon, StarIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid, StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import Masonry from 'react-masonry-css';

interface Place {
  id: string;
  name: string;
  location: string;
  image: string;
  emotion: string;
  memo: string;
  likes: number;
  comments: number;
  stars: number;
  createdAt: string;
  isLiked?: boolean;
  isStarred?: boolean;
  aspectRatio: number;
}

const breakpointColumns = {
  default: 4,
  1280: 3,
  1024: 2,
  640: 1
};

const emotions = [
  '설렘', '고요함', '열정', '향수', '호기심', '평화', '행복', '추억'
];

const emotionColors = {
  '설렘': 'from-pink-400 to-rose-400',
  '고요함': 'from-blue-400 to-indigo-400',
  '열정': 'from-orange-400 to-red-400',
  '향수': 'from-purple-400 to-pink-400',
  '호기심': 'from-yellow-400 to-orange-400',
  '평화': 'from-green-400 to-teal-400',
  '행복': 'from-yellow-400 to-pink-400',
  '추억': 'from-indigo-400 to-purple-400'
};

const emotionGradients = {
  '설렘': 'from-pink-400/20 to-rose-400/20',
  '고요함': 'from-blue-400/20 to-indigo-400/20',
  '열정': 'from-orange-400/20 to-red-400/20',
  '향수': 'from-purple-400/20 to-pink-400/20',
  '호기심': 'from-yellow-400/20 to-orange-400/20',
  '평화': 'from-green-400/20 to-teal-400/20',
  '행복': 'from-yellow-400/20 to-pink-400/20',
  '추억': 'from-indigo-400/20 to-purple-400/20',
  '탐험': 'from-cyan-400/20 to-blue-400/20'
};

const welcomeMessages = [
  '당신의 취향은 ..?',
  '어떤 장소를 발견했나요?',
  '오늘의 특별한 순간은?',
  '새로운 감정을 찾아보세요'
];

// 이미지 높이 변형을 위한 랜덤 비율 생성 함수
const getRandomAspectRatio = () => {
  const ratios = [1.2, 1.3, 1.4, 1.5, 1.6, 1.7];
  return ratios[Math.floor(Math.random() * ratios.length)];
};

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<'recent' | 'popular'>('recent');
  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null);
  const [welcomeMessage, setWelcomeMessage] = useState(welcomeMessages[0]);
  const [places, setPlaces] = useState<Place[]>([]);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [visibleItems, setVisibleItems] = useState<Set<string>>(new Set());
  const [emotionHoverStates, setEmotionHoverStates] = useState<Record<string, boolean>>({});
  const gridRef = useRef<HTMLDivElement>(null);

  // 초기 데이터 설정
  useEffect(() => {
    const initialPlaces: Place[] = [
      {
        id: '1',
        name: '망원동 골목 속 디저트 카페',
        location: '서울 마포구 망원동',
        image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Y2FmZXxlbnwwfHwwfHx8MA%3D%3D',
        emotion: '설렘',
        memo: '창밖이 예뻤던 어느 겨울날',
        likes: 42,
        comments: 12,
        stars: 8,
        createdAt: '2024-03-15T10:00:00Z',
        isLiked: false,
        isStarred: false,
        aspectRatio: getRandomAspectRatio()
      },
      {
        id: '2',
        name: '잠실 한적한 호숫가 산책길',
        location: '서울 송파구 잠실동',
        image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8bGFrZXxlbnwwfHwwfHx8MA%3D%3D',
        emotion: '고요함',
        memo: '물결에 비친 노을이 아름다웠던 순간',
        likes: 28,
        comments: 8,
        stars: 5,
        createdAt: '2024-03-14T15:30:00Z',
        isLiked: true,
        isStarred: true,
        aspectRatio: getRandomAspectRatio()
      },
      {
        id: '3',
        name: '한남동 빈티지 LP 카페',
        location: '서울 용산구 한남동',
        image: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8bXVzaWN8ZW58MHx8MHx8fDA%3D',
        emotion: '향수',
        memo: '옛날 노래가 흐르는 따뜻한 공간',
        likes: 56,
        comments: 15,
        stars: 12,
        createdAt: '2024-03-13T20:15:00Z',
        isLiked: false,
        isStarred: false,
        aspectRatio: getRandomAspectRatio()
      }
    ];
    setPlaces(initialPlaces);
  }, []);

  // 환영 메시지 랜덤 변경
  useEffect(() => {
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * welcomeMessages.length);
      setWelcomeMessage(welcomeMessages[randomIndex]);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleLike = (placeId: string) => {
    setPlaces(prev => prev.map(place => 
      place.id === placeId 
        ? { ...place, isLiked: !place.isLiked, likes: place.isLiked ? place.likes - 1 : place.likes + 1 }
        : place
    ));
  };

  const handleStar = (placeId: string) => {
    setPlaces(prev => prev.map(place => 
      place.id === placeId 
        ? { ...place, isStarred: !place.isStarred, stars: place.isStarred ? place.stars - 1 : place.stars + 1 }
        : place
    ));
  };

  const handleTabChange = (tab: 'recent' | 'popular') => {
    setIsTransitioning(true);
    setActiveTab(tab);
    setTimeout(() => setIsTransitioning(false), 300);
  };

  // 인기 있는 장소 정렬
  const sortedPlaces = [...places].sort((a, b) => {
    if (activeTab === 'popular') {
      return (b.likes + b.comments + b.stars) - (a.likes + a.comments + a.stars);
    }
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const filteredPlaces = sortedPlaces.filter(place => 
    !selectedEmotion || place.emotion === selectedEmotion
  );

  // Intersection Observer 설정
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('data-id');
            if (id) {
              setVisibleItems(prev => new Set([...prev, id]));
            }
          }
        });
      },
      {
        root: null,
        rootMargin: '50px',
        threshold: 0.1
      }
    );

    const cards = document.querySelectorAll('.place-card');
    cards.forEach(card => observer.observe(card));

    return () => {
      cards.forEach(card => observer.unobserve(card));
    };
  }, [filteredPlaces]);

  const handleEmotionHover = (emotion: string, isHovered: boolean) => {
    setEmotionHoverStates(prev => ({
      ...prev,
      [emotion]: isHovered
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-pink-50 pb-20">
      {/* 환영 메시지 섹션 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative h-[200px] overflow-hidden"
      >
        <motion.div
          animate={{
            background: [
              'linear-gradient(to right, #fbcfe8, #e9d5ff)',
              'linear-gradient(to right, #e9d5ff, #fbcfe8)',
              'linear-gradient(to right, #fbcfe8, #e9d5ff)'
            ]
          }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute inset-0"
        />
        <div className="relative h-full flex flex-col items-center justify-center text-center px-4">
          <AnimatePresence mode="wait">
            <motion.h1
              key={welcomeMessage}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-2xl font-bold mb-2"
            >
              {welcomeMessage}
            </motion.h1>
          </AnimatePresence>
          <p className="text-gray-600">기억하고 싶은 순간을 감정과 함께 남겨보세요</p>
        </div>
      </motion.div>

      {/* 감정 필터 */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-wrap gap-2 mb-6">
          {emotions.map(emotion => (
            <motion.button
              key={emotion}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedEmotion(selectedEmotion === emotion ? null : emotion)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors
                ${selectedEmotion === emotion
                  ? `bg-gradient-to-r ${emotionColors[emotion as keyof typeof emotionColors]} text-white`
                  : 'bg-white border border-gray-200 text-gray-600 hover:border-pink-300'
                }`}
            >
              {emotion}
            </motion.button>
          ))}
        </div>

        {/* 탭 네비게이션 */}
        <div className="flex gap-4 mb-6">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleTabChange('recent')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors
              ${activeTab === 'recent'
                ? 'bg-pink-500 text-white'
                : 'bg-white text-gray-600 hover:bg-pink-50'
              }`}
          >
            <ClockIcon className="w-5 h-5" />
            <span>최근 등록한</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleTabChange('popular')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors
              ${activeTab === 'popular'
                ? 'bg-pink-500 text-white'
                : 'bg-white text-gray-600 hover:bg-pink-50'
              }`}
          >
            <FireIcon className="w-5 h-5" />
            <span>인기있는</span>
          </motion.button>
        </div>

        {/* 메이슨리 그리드 */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className={isTransitioning ? 'pointer-events-none' : ''}
            ref={gridRef}
          >
            <Masonry
              breakpointCols={breakpointColumns}
              className="flex -ml-4 w-auto"
              columnClassName="pl-4 bg-clip-padding"
            >
              {filteredPlaces.map(place => (
                <motion.div
                  key={place.id}
                  data-id={place.id}
                  className="place-card mb-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={visibleItems.has(place.id) ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                >
                  <div className="group relative bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
                    {/* 이미지 */}
                    <div 
                      className="relative overflow-hidden"
                      style={{ aspectRatio: place.aspectRatio }}
                    >
                      <motion.img
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.3 }}
                        src={place.image}
                        alt={place.name}
                        className="w-full h-full object-cover"
                      />
                      <div className={`absolute inset-0 bg-gradient-to-r ${emotionGradients[place.emotion as keyof typeof emotionGradients]} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>

                    {/* 감정 태그 */}
                    <motion.div 
                      className="absolute top-4 left-4"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      onHoverStart={() => handleEmotionHover(place.emotion, true)}
                      onHoverEnd={() => handleEmotionHover(place.emotion, false)}
                    >
                      <motion.span
                        className={`px-3 py-1.5 rounded-full text-sm font-medium text-white
                          bg-gradient-to-r ${emotionColors[place.emotion as keyof typeof emotionColors]}`}
                        animate={{
                          scale: emotionHoverStates[place.emotion] ? 1.05 : 1,
                          transition: { duration: 0.2 }
                        }}
                      >
                        {place.emotion}
                      </motion.span>
                    </motion.div>

                    {/* 상호작용 버튼들 */}
                    <div className="absolute top-4 right-4 flex gap-2">
                      <motion.button
                        onClick={() => handleStar(place.id)}
                        className="p-2 rounded-full bg-white/90 text-gray-600 hover:text-yellow-500 transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        {place.isStarred ? (
                          <StarIconSolid className="w-5 h-5 text-yellow-500" />
                        ) : (
                          <StarIcon className="w-5 h-5" />
                        )}
                      </motion.button>
                      <motion.button
                        onClick={() => handleLike(place.id)}
                        className="p-2 rounded-full bg-white/90 text-gray-600 hover:text-pink-500 transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        {place.isLiked ? (
                          <HeartIconSolid className="w-5 h-5 text-pink-500" />
                        ) : (
                          <HeartIcon className="w-5 h-5" />
                        )}
                      </motion.button>
                    </div>

                    {/* 장소 정보 */}
                    <div className="p-4">
                      <h3 className="font-semibold text-lg mb-1">{place.name}</h3>
                      <div className="flex items-center text-gray-500 text-sm mb-2">
                        <MapPinIcon className="w-4 h-4 mr-1" />
                        {place.location}
                      </div>
                      <p className="text-gray-600 text-sm mb-3">{place.memo}</p>
                      
                      {/* 인기도 지표 */}
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <HeartIcon className="w-4 h-4" />
                          <span>{place.likes}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <ChatBubbleLeftIcon className="w-4 h-4" />
                          <span>{place.comments}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <StarIcon className="w-4 h-4" />
                          <span>{place.stars}</span>
                        </div>
                      </div>
                    </div>

                    {/* 호버 시 나타나는 버튼 */}
                    <motion.div 
                      className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-4 py-2 bg-white/90 rounded-full text-sm font-medium text-gray-700 hover:bg-white"
                      >
                        기억 보기 →
                      </motion.button>
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </Masonry>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
