'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PlusIcon, PhotoIcon, ArrowPathIcon, XMarkIcon, ArrowUpTrayIcon } from '@heroicons/react/24/outline';
import { SparklesIcon } from '@heroicons/react/24/solid';
import ReactMarkdown from 'react-markdown';
import ReactCrop, { Crop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

interface Place {
  id: string;
  name: string;
  image: string;
  emotion?: string;
}

interface CletData {
  coverImage: string | null;
  coverType: 'single' | 'collage';
  name: string;
  description: string;
  places: Place[];
  tags: string[];
  previousInputs?: string[];
}

interface ImageUploadState {
  file: File | null;
  preview: string | null;
  crop: Crop;
}

const suggestedTags = [
  '로맨틱', '힐링', '데이트', '카페', '맛집',
  '전시', '공원', '바다', '산', '쇼핑',
  '힙한', '아늑한', '분위기 좋은', '조용한', '활기찬'
];

export default function CletPage() {
  const [cletData, setCletData] = useState<CletData>({
    coverImage: null,
    coverType: 'single',
    name: '',
    description: '',
    places: [],
    tags: [],
    previousInputs: []
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPlaceSelector, setShowPlaceSelector] = useState(false);
  const [nameError, setNameError] = useState<string | null>(null);
  const [showEmojiWarning, setShowEmojiWarning] = useState(false);
  const [showCoverOptions, setShowCoverOptions] = useState(false);
  const [isCreatingCollage, setIsCreatingCollage] = useState(false);
  const [nameLength, setNameLength] = useState(0);
  const [descriptionLength, setDescriptionLength] = useState(0);
  const [showMarkdownGuide, setShowMarkdownGuide] = useState(false);
  const [imageUpload, setImageUpload] = useState<ImageUploadState>({
    file: null,
    preview: null,
    crop: {
      unit: '%',
      width: 100,
      height: 56.25, // 16:9 aspect ratio
      x: 0,
      y: 0
    }
  });
  const [isUploading, setIsUploading] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);
  const [tagInput, setTagInput] = useState('');
  const [showTagSuggestions, setShowTagSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const tagInputRef = useRef<HTMLInputElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const placeSelectorRef = useRef<HTMLButtonElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // AI 제목 추천 관련 상태
  const [suggestedNames, setSuggestedNames] = useState<string[]>([
    '봄날의 느긋한 오후',
    '설렘이 머문 거리들',
    '작은 쉼표 같은 공간들'
  ]);
  const [selectedSuggestion, setSelectedSuggestion] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // 테스트용 기본 장소 데이터
  const defaultPlaces: Place[] = [
    {
      id: '1',
      name: '테스트 카페',
      image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Y2FmZXxlbnwwfHwwfHx8MA%3D%3D',
      emotion: 'happy'
    }
  ];

  useEffect(() => {
    setNameLength(cletData.name.length);
    setDescriptionLength(cletData.description.length);
  }, [cletData.name, cletData.description]);

  // 사용자의 이전 입력 메모 저장
  const savePreviousInput = (input: string) => {
    if (input.trim().length > 0) {
      setCletData(prev => ({
        ...prev,
        previousInputs: [input] // 이전 입력을 초기화하고 현재 입력만 저장
      }));
    }
  };

  // 이름이 변경될 때 이전 입력 저장
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length <= 25) {
      setCletData(prev => ({ ...prev, name: value }));
      
      // 이모지 감지 로직
      const nonEmojiRegex = /[^\p{Emoji}\s]/gu;
      const hasOnlyEmojis = value.length > 0 && !nonEmojiRegex.test(value);
      setShowEmojiWarning(hasOnlyEmojis);

      // 이름 유효성 검사
      if (value.trim().length < 2) {
        setNameError('조금 더 구체적인 이름을 붙여주세요');
      } else {
        setNameError(null);
        // 유효한 이름이 입력되면 이전 입력을 초기화하고 현재 입력만 저장
        savePreviousInput(value);
      }
    }
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= 300) {
      setCletData(prev => ({ ...prev, description: value }));
    }
  };

  const handleTagInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTagInput(value);
    
    if (value) {
      const filtered = suggestedTags.filter(tag => 
        tag.toLowerCase().includes(value.toLowerCase()) &&
        !cletData.tags.includes(tag)
      );
      setFilteredSuggestions(filtered);
      setShowTagSuggestions(true);
    } else {
      setShowTagSuggestions(false);
    }
  };

  const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      handleTagAdd(tagInput.trim());
      setTagInput('');
      setShowTagSuggestions(false);
    }
  };

  const handleTagAdd = (tag: string) => {
    if (cletData.tags.length < 5 && !cletData.tags.includes(tag)) {
      setCletData(prev => ({ ...prev, tags: [...prev.tags, tag] }));
      setTagInput('');
      setShowTagSuggestions(false);
    }
  };

  const handleTagRemove = (tag: string) => {
    setCletData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
  };

  const handlePlaceAdd = (place: Place) => {
    if (!cletData.places.find(p => p.id === place.id)) {
      const newPlaces = [...cletData.places, place];
      setCletData(prev => ({ ...prev, places: newPlaces }));
      
      // 첫 번째 장소가 추가되면 자동으로 대표 이미지로 설정
      if (newPlaces.length === 1) {
        setCletData(prev => ({
          ...prev,
          coverImage: place.image,
          coverType: 'single'
        }));
      }
    }
  };

  const handlePlaceRemove = (placeId: string) => {
    setCletData(prev => ({
      ...prev,
      places: prev.places.filter(p => p.id !== placeId)
    }));
  };

  const handleSubmit = async () => {
    if (!cletData.name.trim() || cletData.name.trim().length < 2) {
      setNameError('조금 더 구체적인 이름을 붙여주세요');
      nameInputRef.current?.focus();
      return;
    }
    if (cletData.places.length === 0) {
      setNameError('최소 1개의 장소를 선택해주세요');
      setShowPlaceSelector(true);
      placeSelectorRef.current?.focus();
      return;
    }

    setIsSubmitting(true);
    try {
      // TODO: 실제 저장 로직 구현
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // 저장 성공 후 클렛 상세 페이지로 이동
      // TODO: 실제 클렛 ID로 교체
      window.location.href = `/clet/123`;
    } catch (error) {
      console.error('클렛 저장 실패:', error);
      setNameError('클렛 저장에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const createCollage = async () => {
    if (cletData.places.length < 2) return;
    
    setIsCreatingCollage(true);
    try {
      // 실제 구현에서는 이미지 처리 라이브러리를 사용하여 콜라주 생성
      // 예: sharp, jimp 등을 사용하여 서버 사이드에서 처리
      const collageImage = await generateCollage(cletData.places.map(p => p.image));
      setCletData(prev => ({
        ...prev,
        coverImage: collageImage,
        coverType: 'collage'
      }));
    } catch (error) {
      console.error('콜라주 생성 실패:', error);
    } finally {
      setIsCreatingCollage(false);
    }
  };

  const generateCollage = async (images: string[]): Promise<string> => {
    // 실제 구현에서는 이미지 처리 로직이 들어감
    // 현재는 첫 번째 이미지를 반환하는 더미 구현
    return images[0];
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImageUpload(prev => ({
          ...prev,
          file,
          preview: reader.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCropComplete = (crop: Crop) => {
    setImageUpload(prev => ({ ...prev, crop }));
  };

  const handleSaveImage = async () => {
    if (!imageRef.current || !imageUpload.file) return;

    setIsUploading(true);
    try {
      // 실제 구현에서는 이미지 크롭 및 최적화 로직이 들어감
      // 현재는 더미 구현으로 원본 이미지를 사용
      setCletData(prev => ({
        ...prev,
        coverImage: imageUpload.preview,
        coverType: 'single'
      }));
      setShowCoverOptions(false);
    } catch (error) {
      console.error('이미지 저장 실패:', error);
    } finally {
      setIsUploading(false);
    }
  };

  // 입력 필드 포커스 시 자동 스크롤
  const handleInputFocus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const inputRect = e.target.getBoundingClientRect();
    const containerRect = containerRef.current?.getBoundingClientRect();
    
    if (containerRect && inputRect.bottom > containerRect.bottom) {
      e.target.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  // 현재 시간 기반 계절/시간대 정보
  const getTimeContext = () => {
    const now = new Date();
    const hour = now.getHours();
    const month = now.getMonth() + 1;

    const timeOfDay = hour < 6 ? '새벽' :
                     hour < 12 ? '아침' :
                     hour < 18 ? '오후' : '저녁';

    const season = month >= 3 && month <= 5 ? '봄' :
                  month >= 6 && month <= 8 ? '여름' :
                  month >= 9 && month <= 11 ? '가을' : '겨울';

    return { timeOfDay, season };
  };

  // AI 제목 생성 함수 개선
  const generateSuggestions = () => {
    setIsGenerating(true);
    
    setTimeout(() => {
      const { timeOfDay, season } = getTimeContext();
      const placeNames = cletData.places.map(p => p.name);
      const emotions = cletData.tags.filter(tag => 
        ['로맨틱', '힐링', '설렘', '평화로운', '활기찬'].includes(tag)
      );
      const previousInputs = cletData.previousInputs || [];

      // 기본 추천 제목 목록
      const baseSuggestions = [
        // 장소 기반 제목
        ...placeNames.map(name => 
          `${season}의 ${timeOfDay}, ${name}`
        ),
        // 감정 태그 기반 제목
        ...emotions.map(emotion => 
          `${emotion} 순간이 머문 곳`
        ),
        // 시간 정보 기반 제목
        `${timeOfDay}의 추억`,
        `${season}의 특별한 순간`,
        // 이전 입력 기반 제목 (유사한 패턴으로 변형)
        ...previousInputs.map(input => {
          // 한글 문자열을 그대로 사용
          return `${input}에서의 ${timeOfDay}`;
        })
      ];

      // 장소가 없는 경우의 대체 제목
      const fallbackSuggestions = [
        `${season}의 ${timeOfDay}`,
        '특별한 순간이 머문 곳',
        `${timeOfDay}의 추억`,
        '소중한 추억의 공간',
        `${season}의 특별한 순간`,
        // 이전 입력 기반 제목
        ...previousInputs.map(input => 
          `${input}의 추억`
        )
      ];

      // 장소가 있으면 기본 제목, 없으면 대체 제목 사용
      const suggestions = cletData.places.length > 0 ? baseSuggestions : fallbackSuggestions;

      // 중복 제거 및 3~4개 랜덤 선택
      const uniqueSuggestions = [...new Set(suggestions)];
      const selectedCount = 3 + Math.floor(Math.random() * 2);
      const newSuggestions = uniqueSuggestions
        .sort(() => Math.random() - 0.5)
        .slice(0, selectedCount);

      setSuggestedNames(newSuggestions);
      setSelectedSuggestion(null);
      setIsGenerating(false);
    }, 1000);
  };

  // 추천 제목 선택 핸들러
  const handleSuggestionClick = (suggestion: string) => {
    setSelectedSuggestion(suggestion);
    setCletData(prev => ({ ...prev, name: suggestion }));
    nameInputRef.current?.focus();
  };

  // 컴포넌트 마운트 시 초기 추천 생성
  useEffect(() => {
    generateSuggestions();
  }, []);

  // 장소나 태그가 변경될 때마다 추천 갱신
  useEffect(() => {
    if (cletData.places.length > 0 || cletData.tags.length > 0) {
      generateSuggestions();
    }
  }, [cletData.places, cletData.tags]);

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-b from-white to-pink-50 pb-20">
      <div className="w-full max-w-[1200px] mx-auto px-4">
        <motion.div
          ref={containerRef}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-[800px] mx-auto py-8 pb-32"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-center mb-12"
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
              새로운 클렛 만들기
            </h1>
            <p className="text-gray-600 text-lg">의미 있는 장소들을 하나로 모아보세요</p>
          </motion.div>

          <div className="space-y-8 w-full">
            {/* 대표 이미지 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative aspect-video w-full max-w-2xl mx-auto"
            >
              {cletData.coverImage ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="relative w-full h-full group"
                >
                  <img
                    src={cletData.coverImage}
                    alt="클렛 대표 이미지"
                    className="w-full h-full object-cover rounded-lg shadow-lg"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center space-x-4">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setShowCoverOptions(true)}
                      className="p-2 bg-white/90 rounded-full text-gray-800 hover:bg-white"
                    >
                      <PhotoIcon className="w-5 h-5" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setCletData(prev => ({ ...prev, coverImage: null }))}
                      className="p-2 bg-white/90 rounded-full text-gray-800 hover:bg-white"
                    >
                      <XMarkIcon className="w-5 h-5" />
                    </motion.button>
                  </div>
                  {cletData.coverType === 'collage' && (
                    <div className="absolute top-2 left-2 px-2 py-1 bg-black/60 text-white text-xs rounded-full">
                      콜라주
                    </div>
                  )}
                </motion.div>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowCoverOptions(true)}
                  className="w-full h-full border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center hover:border-pink-300 transition-colors bg-white/50 backdrop-blur-sm"
                >
                  <PlusIcon className="w-8 h-8 text-gray-400 mb-2" />
                  <span className="text-gray-500">대표 이미지 등록하기</span>
                </motion.button>
              )}
            </motion.div>

            {/* 대표 이미지 옵션 모달 */}
            <AnimatePresence>
              {showCoverOptions && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center"
                >
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="w-full max-w-2xl bg-white rounded-2xl p-6 mx-4"
                  >
                    <h3 className="text-xl font-bold mb-4">대표 이미지 선택</h3>
                    <div className="space-y-6">
                      {/* 이미지 업로드 섹션 */}
                      <div className="border-2 border-dashed border-gray-200 rounded-lg p-6">
                        <div className="text-center">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                            id="image-upload"
                          />
                          <label
                            htmlFor="image-upload"
                            className="cursor-pointer inline-flex flex-col items-center"
                          >
                            <ArrowUpTrayIcon className="w-8 h-8 text-gray-400 mb-2" />
                            <span className="text-gray-500">이미지 업로드</span>
                            <span className="text-sm text-gray-400 mt-1">JPG, PNG (최대 5MB)</span>
                          </label>
                        </div>
                      </div>

                      {/* 이미지 크롭 섹션 */}
                      {imageUpload.preview && (
                        <div className="space-y-4">
                          <h4 className="font-medium">이미지 크롭</h4>
                          <div className="relative aspect-video w-full overflow-hidden rounded-lg">
                            <ReactCrop
                              crop={imageUpload.crop}
                              onChange={c => setImageUpload(prev => ({ ...prev, crop: c }))}
                              onComplete={handleCropComplete}
                              aspect={16/9}
                            >
                              <img
                                ref={imageRef}
                                src={imageUpload.preview}
                                alt="크롭할 이미지"
                                className="max-w-full"
                              />
                            </ReactCrop>
                          </div>
                        </div>
                      )}

                      {/* 기존 장소 이미지 옵션 */}
                      {cletData.places.length > 0 && (
                        <div className="space-y-4">
                          <h4 className="font-medium">또는 기존 장소 이미지 선택</h4>
                          <div className="grid grid-cols-2 gap-4">
                            <button
                              onClick={() => {
                                setCletData(prev => ({
                                  ...prev,
                                  coverImage: cletData.places[0].image,
                                  coverType: 'single'
                                }));
                                setShowCoverOptions(false);
                              }}
                              className="p-4 text-left border border-gray-200 rounded-lg hover:border-pink-300 transition-colors"
                            >
                              <div className="flex items-center space-x-3">
                                <img
                                  src={cletData.places[0].image}
                                  alt="첫 번째 장소"
                                  className="w-16 h-16 object-cover rounded-lg"
                                />
                                <div>
                                  <p className="font-medium">첫 번째 장소 이미지 사용</p>
                                  <p className="text-sm text-gray-500">자동으로 첫 번째 장소의 이미지를 대표 이미지로 설정합니다</p>
                                </div>
                              </div>
                            </button>
                            {cletData.places.length >= 2 && (
                              <button
                                onClick={() => {
                                  createCollage();
                                  setShowCoverOptions(false);
                                }}
                                disabled={isCreatingCollage}
                                className="p-4 text-left border border-gray-200 rounded-lg hover:border-pink-300 transition-colors"
                              >
                                <div className="flex items-center space-x-3">
                                  <div className="w-16 h-16 relative">
                                    {cletData.places.slice(0, 4).map((place, index) => (
                                      <img
                                        key={place.id}
                                        src={place.image}
                                        alt={`콜라주 이미지 ${index + 1}`}
                                        className="absolute w-8 h-8 object-cover rounded-lg"
                                        style={{
                                          top: index < 2 ? 0 : '50%',
                                          left: index % 2 === 0 ? 0 : '50%',
                                          transform: `translate(${index % 2 === 1 ? '-50%' : '0'}, ${index >= 2 ? '-50%' : '0'})`
                                        }}
                                      />
                                    ))}
                                  </div>
                                  <div>
                                    <p className="font-medium">콜라주 만들기</p>
                                    <p className="text-sm text-gray-500">선택된 장소들의 이미지로 콜라주를 만듭니다</p>
                                  </div>
                                </div>
                              </button>
                            )}
                          </div>
                        </div>
                      )}

                      {/* 액션 버튼 */}
                      <div className="flex justify-end space-x-4">
                        <button
                          onClick={() => {
                            setShowCoverOptions(false);
                            setImageUpload({ file: null, preview: null, crop: { unit: '%', width: 100, height: 56.25, x: 0, y: 0 } });
                          }}
                          className="px-4 py-2 text-gray-600 hover:text-gray-800"
                        >
                          취소
                        </button>
                        {imageUpload.preview && (
                          <button
                            onClick={handleSaveImage}
                            disabled={isUploading}
                            className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 disabled:opacity-50"
                          >
                            {isUploading ? '저장 중...' : '저장하기'}
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* 클렛 이름 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">클렛 이름</h2>
                <span className="text-sm text-gray-500">필수</span>
              </div>
              <div className="relative">
                <input
                  ref={nameInputRef}
                  type="text"
                  value={cletData.name}
                  onChange={handleNameChange}
                  onFocus={handleInputFocus}
                  placeholder="이 클렛을 어떻게 불러볼까요?"
                  className="w-full p-4 text-lg border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200"
                  minLength={2}
                  maxLength={25}
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-400">
                  {nameLength}/25
                </div>
              </div>
              <AnimatePresence mode="wait">
                {showEmojiWarning && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="flex items-center space-x-2 text-sm text-gray-500"
                  >
                    <SparklesIcon className="w-4 h-4 text-pink-400" />
                    <p>이모지도 좋지만, 단어가 함께 있다면 클렛 이름이 더 특별해질 거예요 :)</p>
                  </motion.div>
                )}
                {nameError && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-sm text-red-500"
                  >
                    {nameError}
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>

            {/* AI 제목 추천 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-3 w-full"
            >
              <p className="text-sm text-gray-500">이런 이름은 어때요?</p>
              <div className="grid grid-cols-[1fr,auto] gap-2 min-h-[40px] w-full">
                <div className="grid grid-cols-3 gap-2 h-[40px] w-[600px]">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <motion.button
                      key={index}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => suggestedNames[index] && handleSuggestionClick(suggestedNames[index])}
                      className={`px-4 py-2 text-sm rounded-full transition-all duration-200 whitespace-nowrap truncate text-center h-[40px] w-[192px]
                        ${suggestedNames[index] ? (
                          selectedSuggestion === suggestedNames[index]
                            ? 'bg-pink-500 text-white shadow-md'
                            : 'bg-white border border-gray-200 hover:border-pink-300'
                        ) : 'bg-gray-50 border border-gray-100 text-gray-300 cursor-default'}`}
                    >
                      {suggestedNames[index] || ''}
                    </motion.button>
                  ))}
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={generateSuggestions}
                  disabled={isGenerating}
                  className="px-3 py-2 text-sm text-gray-500 hover:text-gray-700 flex items-center space-x-1 whitespace-nowrap h-[40px] w-[140px]"
                >
                  <motion.div
                    animate={isGenerating ? { rotate: 360 } : {}}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <ArrowPathIcon className="w-4 h-4" />
                  </motion.div>
                  <span>다른 이름 추천받기</span>
                </motion.button>
              </div>
            </motion.div>

            {/* 클렛 설명 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">클렛 설명</h2>
                <button
                  onClick={() => setShowMarkdownGuide(!showMarkdownGuide)}
                  className="text-sm text-gray-500 hover:text-gray-700 flex items-center space-x-1"
                >
                  <SparklesIcon className="w-4 h-4" />
                  <span>마크다운 도움말</span>
                </button>
              </div>
              <div className="relative">
                <textarea
                  value={cletData.description}
                  onChange={handleDescriptionChange}
                  onFocus={handleInputFocus}
                  placeholder="클렛에 담긴 이야기나 감정을 간단히 적어주세요"
                  className="w-full p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none min-h-[120px] transition-all duration-200"
                  maxLength={300}
                />
                <div className="absolute right-4 bottom-4 text-sm text-gray-400">
                  {descriptionLength}/300
                </div>
              </div>
              <AnimatePresence mode="wait">
                {showMarkdownGuide && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="overflow-hidden"
                  >
                    <div className="p-4 bg-pink-50/50 rounded-lg text-sm text-gray-600 space-y-2">
                      <p className="font-medium">마크다운 문법:</p>
                      <ul className="space-y-1">
                        <li><code>**굵게**</code> - <strong>굵은 텍스트</strong></li>
                        <li><code>*기울임*</code> - <em>기울어진 텍스트</em></li>
                      </ul>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              {cletData.description && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="p-4 bg-white rounded-lg border border-gray-100"
                >
                  <h3 className="text-sm font-medium text-gray-500 mb-2">미리보기</h3>
                  <div className="prose prose-sm max-w-none">
                    <ReactMarkdown>
                      {cletData.description}
                    </ReactMarkdown>
                  </div>
                </motion.div>
              )}
            </motion.div>

            {/* 장소 선택 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">이 클렛에 어떤 장소를 담을까요?</h2>
                <span className="text-sm text-gray-500">필수</span>
              </div>
              
              <div className="flex flex-wrap gap-4">
                {cletData.places.map(place => (
                  <motion.div
                    key={place.id}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    className="relative group"
                  >
                    <div className="relative w-24 h-24">
                      <img
                        src={place.image}
                        alt={place.name}
                        className="w-full h-full object-cover rounded-lg shadow-sm"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                        <button
                          onClick={() => handlePlaceRemove(place.id)}
                          className="p-1.5 bg-white/90 rounded-full text-gray-800 hover:bg-white transition-colors"
                        >
                          <XMarkIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <p className="mt-1 text-xs text-gray-600 text-center truncate max-w-[96px]">
                      {place.name}
                    </p>
                  </motion.div>
                ))}
                <motion.button
                  ref={placeSelectorRef}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowPlaceSelector(true)}
                  className="w-24 h-24 border-2 border-dashed border-gray-200 rounded-lg flex flex-col items-center justify-center hover:border-pink-300 transition-colors bg-white/50"
                >
                  <PlusIcon className="w-6 h-6 text-gray-400 mb-1" />
                  <span className="text-sm text-gray-500">장소 선택</span>
                </motion.button>
              </div>
            </motion.div>

            {/* 태그 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">태그</h2>
                <span className="text-sm text-gray-500">
                  {cletData.tags.length}/5
                </span>
              </div>

              <div className="space-y-3">
                {/* 태그 입력 필드 */}
                <div className="relative">
                  <input
                    ref={tagInputRef}
                    type="text"
                    value={tagInput}
                    onChange={handleTagInputChange}
                    onKeyDown={handleTagInputKeyDown}
                    onFocus={() => setShowTagSuggestions(true)}
                    placeholder="태그를 입력하세요"
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  />
                  <AnimatePresence>
                    {showTagSuggestions && filteredSuggestions.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute z-10 w-full mt-1 bg-white rounded-lg shadow-lg border border-gray-100"
                      >
                        <div className="p-2 space-y-1">
                          {filteredSuggestions.map((tag, index) => (
                            <button
                              key={index}
                              onClick={() => handleTagAdd(tag)}
                              className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-pink-50 rounded-md transition-colors"
                            >
                              {tag}
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* 선택된 태그 */}
                <div className="flex flex-wrap gap-2">
                  {cletData.tags.map(tag => (
                    <motion.div
                      key={tag}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.8, opacity: 0 }}
                      className="flex items-center space-x-1 px-3 py-1.5 bg-pink-100 text-pink-600 rounded-full"
                    >
                      <span className="text-sm">{tag}</span>
                      <button
                        onClick={() => handleTagRemove(tag)}
                        className="text-pink-400 hover:text-pink-600 transition-colors"
                      >
                        <XMarkIcon className="w-4 h-4" />
                      </button>
                    </motion.div>
                  ))}
                </div>

                {/* 추천 태그 */}
                {cletData.tags.length < 5 && (
                  <div className="flex flex-wrap gap-2">
                    {suggestedTags
                      .filter(tag => !cletData.tags.includes(tag))
                      .slice(0, 5)
                      .map((tag, index) => (
                        <motion.button
                          key={index}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleTagAdd(tag)}
                          className="px-3 py-1.5 text-sm text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                        >
                          + {tag}
                        </motion.button>
                      ))}
                  </div>
                )}
              </div>
            </motion.div>

            {/* 저장 버튼 */}
            <motion.button
              whileHover={{ scale: 1.02, boxShadow: "0 10px 30px -10px rgba(236, 72, 153, 0.3)" }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full py-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden group"
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
              <span className="relative z-10 flex items-center justify-center">
                {isSubmitting ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
                    />
                    저장 중...
                  </>
                ) : (
                  '클렛 만들기'
                )}
              </span>
            </motion.button>
          </div>
        </motion.div>

        {/* 장소 선택 모달 */}
        <AnimatePresence>
          {showPlaceSelector && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center"
            >
              <motion.div
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="w-full max-w-lg bg-white rounded-t-2xl sm:rounded-2xl p-6 max-h-[80vh] overflow-y-auto"
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold">장소 선택</h2>
                  <button
                    onClick={() => setShowPlaceSelector(false)}
                    className="p-2 text-gray-500 hover:text-gray-700"
                  >
                    <XMarkIcon className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="space-y-4">
                  {/* 장소 검색 */}
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="장소 검색"
                      className="w-full p-3 pl-10 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    />
                    <SparklesIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  </div>

                  {/* 장소 목록 - 리스트 형태로 변경 */}
                  <div className="space-y-2">
                    {defaultPlaces.map(place => (
                      <motion.div
                        key={place.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center space-x-4 p-3 border border-gray-200 rounded-lg hover:border-pink-300 transition-colors cursor-pointer"
                        onClick={() => handlePlaceAdd(place)}
                      >
                        <img
                          src={place.image}
                          alt={place.name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h3 className="font-medium">{place.name}</h3>
                          {place.emotion && (
                            <span className="text-sm text-pink-500">{place.emotion}</span>
                          )}
                        </div>
                        <button
                          className="p-2 text-gray-400 hover:text-gray-600"
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePlaceAdd(place);
                          }}
                        >
                          <PlusIcon className="w-5 h-5" />
                        </button>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
} 