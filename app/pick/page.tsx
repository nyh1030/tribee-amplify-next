'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChatBubbleLeftIcon, SparklesIcon } from '@heroicons/react/24/outline';
import EmotionTags from '../components/pick/EmotionTags';
import ImageLocationUpload from '../components/pick/ImageLocationUpload';

interface PickData {
  image: File | null;
  location: { lat: number; lng: number } | null;
  emotion: any | null;
  keywords: string[];
  memo: string;
}

export default function PickPage() {
  const [pickData, setPickData] = useState<PickData>({
    image: null,
    location: null,
    emotion: null,
    keywords: [],
    memo: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCompletion, setShowCompletion] = useState(false);
  const [showCard, setShowCard] = useState(false);

  const handleImageSelect = (file: File) => {
    setPickData(prev => ({ ...prev, image: file }));
  };

  const handleLocationSelect = (location: { lat: number; lng: number }) => {
    setPickData(prev => ({ ...prev, location }));
  };

  const handleEmotionSelect = (emotion: any) => {
    setPickData(prev => ({ ...prev, emotion }));
  };

  const handleKeywordsChange = (keywords: string[]) => {
    setPickData(prev => ({ ...prev, keywords }));
  };

  const handleMemoChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPickData(prev => ({ ...prev, memo: e.target.value }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    // 카메라 셔터 효과를 위한 애니메이션
    const elements = document.querySelectorAll('.content-element');
    elements.forEach((el) => {
      (el as HTMLElement).style.transform = 'scale(0.95)';
      (el as HTMLElement).style.transition = 'transform 0.5s ease-out';
    });

    // 저장 로직 (실제 구현 필요)
    await new Promise(resolve => setTimeout(resolve, 1500));

    // 완료 애니메이션
    setShowCompletion(true);
    
    // 카드가 나타나기 전에 잠시 대기
    await new Promise(resolve => setTimeout(resolve, 1000));
    setShowCard(true);

    // 전체 애니메이션 완료 후 초기화
    setTimeout(() => {
      setShowCompletion(false);
      setShowCard(false);
      setIsSubmitting(false);
      // 폼 초기화
      setPickData({
        image: null,
        location: null,
        emotion: null,
        keywords: [],
        memo: '',
      });
    }, 5000);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-b from-white to-pink-50 pb-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="container mx-auto px-4 py-8"
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-12 content-element"
        >
          <motion.div
            animate={{
              scale: [1, 1.05, 1],
              rotate: [0, 1, -1, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              repeatType: "reverse",
            }}
            className="inline-block mb-4"
          >
            <SparklesIcon className="w-8 h-8 text-pink-400" />
          </motion.div>
          <h1 className="text-3xl font-bold mb-3 bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
            어떤 장소를 발견했나요?
          </h1>
          <p className="text-gray-600 text-lg">기억하고 싶은 순간을 감정과 함께 남겨보세요</p>
        </motion.div>

        <div className="space-y-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="content-element"
          >
            <ImageLocationUpload
              onImageSelect={handleImageSelect}
              onLocationSelect={handleLocationSelect}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-6 content-element"
          >
            <div className="flex items-center space-x-3">
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
                className="text-2xl"
              >
                {pickData.emotion?.icon || '✨'}
              </motion.div>
              <h2 className="text-xl font-semibold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
                이 장소에서의 감정은?
              </h2>
            </div>
            <EmotionTags
              onSelect={handleEmotionSelect}
              onKeywordsChange={handleKeywordsChange}
              selectedEmotion={pickData.emotion}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="space-y-6 content-element"
          >
            <div className="flex items-center space-x-3">
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
              >
                <ChatBubbleLeftIcon className="w-6 h-6 text-pink-400" />
              </motion.div>
              <h2 className="text-xl font-semibold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
                메모
              </h2>
            </div>
            <textarea
              value={pickData.memo}
              onChange={handleMemoChange}
              placeholder="이곳이 좋았던 이유는? 나중의 나에게 전할 한마디"
              className="w-full p-4 border border-pink-100 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none bg-white/50 backdrop-blur-sm shadow-sm"
              rows={4}
            />
          </motion.div>

          <motion.button
            whileHover={{ scale: 1.02, boxShadow: "0 10px 30px -10px rgba(236, 72, 153, 0.3)" }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full py-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 content-element relative overflow-hidden group"
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0"
              animate={{
                x: ["-100%", "100%"],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: "loop",
              }}
            />
            <span className="relative z-10">
              {isSubmitting ? '저장 중...' : '기록 남기기'}
            </span>
          </motion.button>
        </div>

        <AnimatePresence>
          {showCompletion && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50"
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="relative w-full max-w-sm mx-4"
              >
                {showCard && (
                  <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    transition={{ type: "spring", damping: 15, stiffness: 100 }}
                    className={`absolute inset-0 bg-gradient-to-r ${
                      pickData.emotion?.gradient || 'from-pink-400 to-purple-400'
                    } rounded-lg shadow-xl overflow-hidden backdrop-blur-sm z-10`}
                  >
                    <div className="p-8 text-white">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring", damping: 15 }}
                        className="text-5xl mb-6"
                      >
                        {pickData.emotion?.icon || '✨'}
                      </motion.div>
                      <motion.h3
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3, type: "spring", damping: 15 }}
                        className="text-2xl font-bold mb-3"
                      >
                        {pickData.emotion?.label || '새로운 장소'}
                      </motion.h3>
                      <motion.p
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.4, type: "spring", damping: 15 }}
                        className="text-white/90 text-lg"
                      >
                        {pickData.memo || '새로운 추억이 추가되었어요'}
                      </motion.p>
                    </div>
                  </motion.div>
                )}
                <motion.div
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 50, opacity: 0 }}
                  transition={{ type: "spring", damping: 15 }}
                  className="bg-white/90 backdrop-blur-sm p-8 rounded-lg shadow-xl text-center relative z-0"
                >
                  <motion.div
                    animate={{
                      scale: [1, 1.2, 1],
                      rotate: [0, 10, -10, 0],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: 1,
                      repeatType: "reverse"
                    }}
                    className="text-5xl mb-6"
                  >
                    ✨
                  </motion.div>
                  <h3 className="text-2xl font-bold mb-3 bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
                    기록이 완료되었어요!
                  </h3>
                  <p className="text-gray-600 text-lg">도감에 새로운 장소가 추가되었습니다</p>
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
} 