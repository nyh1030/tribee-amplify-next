'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface ProfileEditFormProps {
  initialData: {
    nickname: string;
    statusMessage: string;
    email: string;
    profileImage: string;
    interests: string[];
  };
}

const defaultAvatars = [
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop',
];

const emotionTags = [
  { 
    id: 'excited', 
    label: '설렘', 
    color: 'rgba(59, 130, 246, 0.8)',
    gradient: 'from-blue-400 to-blue-600'
  },
  { 
    id: 'calm', 
    label: '고요함', 
    color: 'rgba(100, 116, 139, 0.8)',
    gradient: 'from-slate-400 to-slate-600'
  },
  { 
    id: 'curious', 
    label: '호기심', 
    color: 'rgba(139, 92, 246, 0.8)',
    gradient: 'from-purple-400 to-purple-600'
  },
  { 
    id: 'cozy', 
    label: '포근함', 
    color: 'rgba(251, 146, 60, 0.8)',
    gradient: 'from-orange-400 to-orange-600'
  },
  { 
    id: 'happy', 
    label: '행복', 
    color: 'rgba(34, 197, 94, 0.8)',
    gradient: 'from-green-400 to-green-600'
  },
  { 
    id: 'nostalgic', 
    label: '그리움', 
    color: 'rgba(236, 72, 153, 0.8)',
    gradient: 'from-pink-400 to-pink-600'
  }
];

// 닉네임 생성 함수
const generateNicknames = (count: number = 4): string[] => {
  const adjectives = ['행복한', '즐거운', '아늑한', '따뜻한', '신나는', '평화로운', '귀여운', '멋진', '특별한', '소중한'];
  const nouns = ['여행자', '탐험가', '수집가', '꿈꾸는', '그림자', '별빛', '바람', '구름', '꽃', '나무'];
  
  const nicknames = new Set<string>();
  while (nicknames.size < count) {
    const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];
    nicknames.add(`${adj} ${noun}`);
  }
  
  return Array.from(nicknames);
};

// 비속어 필터링 함수
const containsBadWords = (text: string): boolean => {
  const badWords = ['바보', '멍청이', '똥', '씨발', '개새끼']; // 실제로는 더 많은 비속어 목록이 필요
  return badWords.some(word => text.includes(word));
};

const statusMessagePlaceholders = [
  '당신을 짧게 표현해볼까요?',
  '조용한 순간을 좋아해요',
  '작은 행복을 모으는 중이에요',
  '오늘도 좋은 하루 보내세요',
  '나만의 특별한 이야기를 담아요',
  '일상의 소중한 순간들',
  '마음이 편안해지는 곳을 찾아요',
  '작은 기쁨을 나누고 싶어요'
];

export default function ProfileEditForm({ initialData }: ProfileEditFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState(initialData);
  const [selectedEmotions, setSelectedEmotions] = useState<string[]>([]);
  const [nicknameError, setNicknameError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [imageOpacity, setImageOpacity] = useState(1);
  const [suggestedNicknames, setSuggestedNicknames] = useState<string[]>([]);
  const [isCheckingNickname, setIsCheckingNickname] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const nicknameCheckTimeout = useRef<NodeJS.Timeout>();
  const [currentPlaceholder, setCurrentPlaceholder] = useState(statusMessagePlaceholders[0]);
  const [isPlaceholderVisible, setIsPlaceholderVisible] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  // 초기 닉네임 추천 생성
  useEffect(() => {
    setSuggestedNicknames(generateNicknames());
  }, []);

  // Placeholder 순환 효과
  useEffect(() => {
    if (isPlaceholderVisible) {
      const interval = setInterval(() => {
        setCurrentPlaceholder(prev => {
          const currentIndex = statusMessagePlaceholders.indexOf(prev);
          const nextIndex = (currentIndex + 1) % statusMessagePlaceholders.length;
          return statusMessagePlaceholders[nextIndex];
        });
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [isPlaceholderVisible]);

  // 닉네임 중복 체크 함수
  const checkNicknameAvailability = useCallback(async (nickname: string) => {
    setIsCheckingNickname(true);
    try {
      // TODO: 실제 API 호출로 대체
      await new Promise(resolve => setTimeout(resolve, 500));
      const isAvailable = Math.random() > 0.3; // 임시 로직
      return isAvailable;
    } finally {
      setIsCheckingNickname(false);
    }
  }, []);

  const handleNicknameChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, nickname: value }));

    // 이전 타임아웃 취소
    if (nicknameCheckTimeout.current) {
      clearTimeout(nicknameCheckTimeout.current);
    }

    // 기본 유효성 검사
    if (value.length < 2) {
      setNicknameError('닉네임은 2자 이상이어야 합니다.');
      return;
    }
    if (value.length > 16) {
      setNicknameError('닉네임은 16자 이하여야 합니다.');
      return;
    }
    if (!/^[가-힣a-zA-Z0-9]+$/.test(value)) {
      setNicknameError('한글, 영문, 숫자만 사용 가능합니다.');
      return;
    }
    if (containsBadWords(value)) {
      setNicknameError('부적절한 닉네임입니다.');
      return;
    }

    // 디바운스 처리
    nicknameCheckTimeout.current = setTimeout(async () => {
      const isAvailable = await checkNicknameAvailability(value);
      if (isAvailable) {
        setNicknameError('');
      } else {
        setNicknameError('이미 사용 중인 닉네임입니다.');
      }
    }, 500);
  }, [checkNicknameAvailability]);

  const handleRefreshNicknames = useCallback(() => {
    setSuggestedNicknames(generateNicknames());
  }, []);

  const handleSelectSuggestedNickname = useCallback((nickname: string) => {
    setFormData(prev => ({ ...prev, nickname: nickname }));
    handleNicknameChange({ target: { value: nickname } } as React.ChangeEvent<HTMLInputElement>);
  }, [handleNicknameChange]);

  const handleImageChange = useCallback((file: File) => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageOpacity(0);
        setTimeout(() => {
          setFormData(prev => ({
            ...prev,
            profileImage: reader.result as string
          }));
          setImageOpacity(1);
        }, 300);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageChange(file);
    }
  }, [handleImageChange]);

  const handleRandomAvatar = useCallback(() => {
    const randomAvatar = defaultAvatars[Math.floor(Math.random() * defaultAvatars.length)];
    setImageOpacity(0);
    setTimeout(() => {
      setFormData(prev => ({
        ...prev,
        profileImage: randomAvatar
      }));
      setImageOpacity(1);
    }, 300);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      handleImageChange(file);
    }
  }, [handleImageChange]);

  const handleEmotionSelect = useCallback((emotionId: string) => {
    setSelectedEmotions(prev => {
      if (prev.includes(emotionId)) {
        return prev.filter(id => id !== emotionId);
      }
      if (prev.length < 2) {
        return [...prev, emotionId];
      }
      return prev;
    });
  }, []);

  const getBackgroundGradient = useCallback(() => {
    if (selectedEmotions.length === 0) {
      return 'from-gray-50 to-gray-100';
    }
    
    const gradients = selectedEmotions.map(emotionId => {
      const emotion = emotionTags.find(tag => tag.id === emotionId);
      return emotion?.gradient || '';
    });

    return gradients.join(', ');
  }, [selectedEmotions]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (nicknameError) return;

    setIsSaving(true);
    try {
      // TODO: API 호출하여 프로필 업데이트
      await new Promise(resolve => setTimeout(resolve, 1000)); // 임시 딜레이
      
      // 성공 토스트 표시
      setShowSuccessToast(true);
      
      // 1.5초 후 프로필 페이지로 이동
      setTimeout(() => {
        router.push('/profile');
      }, 1500);
    } catch (error) {
      console.error('프로필 업데이트 실패:', error);
      // TODO: 에러 처리
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 pb-24 relative">
      {/* 프로필 이미지 섹션 */}
      <div className="flex flex-col items-center space-y-4">
        <div 
          className="relative"
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className={`relative w-32 h-32 rounded-full overflow-hidden border-2 border-pink-100 transition-opacity duration-300 ${isDragging ? 'border-pink-500' : ''}`}>
            <Image
              src={formData.profileImage}
              alt="프로필 이미지"
              width={128}
              height={128}
              className="object-cover transition-opacity duration-300"
              style={{ opacity: imageOpacity }}
            />
            {isDragging && (
              <div className="absolute inset-0 bg-pink-500 bg-opacity-20 flex items-center justify-center">
                <p className="text-white font-medium">이미지를 여기에 놓으세요</p>
              </div>
            )}
          </div>
          <div className="absolute bottom-0 right-0 flex space-x-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="bg-white rounded-full p-2 shadow-md hover:bg-gray-50 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
            <button
              type="button"
              onClick={handleRandomAvatar}
              className="bg-white rounded-full p-2 shadow-md hover:bg-gray-50 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileInput}
          />
        </div>
        <p className="text-sm text-gray-500">
          이미지를 드래그하거나 클릭하여 업로드하세요
        </p>
      </div>

      {/* 닉네임 섹션 */}
      <div className="space-y-4">
        <div>
          <label htmlFor="nickname" className="block text-sm font-medium text-gray-700">
            닉네임
          </label>
          <div className="mt-1 relative">
            <input
              type="text"
              id="nickname"
              value={formData.nickname}
              onChange={handleNicknameChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              placeholder="닉네임을 입력하세요"
            />
            <button
              type="button"
              onClick={handleRefreshNicknames}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              title="다른 이름 추천받기"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>
          
          {/* 닉네임 상태 메시지 */}
          <div className="mt-2">
            {isCheckingNickname ? (
              <p className="text-sm text-gray-500">닉네임 확인 중...</p>
            ) : nicknameError ? (
              <p className="text-sm text-red-500">{nicknameError}</p>
            ) : (
              <p className="text-sm text-green-500">사용 가능한 닉네임입니다 ✔️</p>
            )}
          </div>

          {/* 닉네임 규칙 안내 */}
          <div className="mt-2 text-sm text-gray-500">
            <ul className="list-disc list-inside space-y-1">
              <li>2자 이상 16자 이하</li>
              <li>한글, 영문, 숫자만 사용 가능</li>
              <li>공백과 특수문자는 사용할 수 없습니다</li>
              <li>비속어는 자동으로 필터링됩니다</li>
            </ul>
          </div>
        </div>

        {/* 추천 닉네임 */}
        <div className="space-y-2">
          <p className="text-sm text-gray-500">추천 닉네임</p>
          <div className="flex flex-wrap gap-2">
            {suggestedNicknames.map((nickname, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleSelectSuggestedNickname(nickname)}
                className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors"
              >
                {nickname}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 한 줄 소개 섹션 */}
      <div className="space-y-4">
        <div>
          <label htmlFor="statusMessage" className="block text-sm font-medium text-gray-700">
            한 줄 소개
            <span className="text-gray-400 text-xs ml-1">(선택)</span>
          </label>
          <div className="mt-1 relative">
            <input
              type="text"
              id="statusMessage"
              value={formData.statusMessage}
              onChange={(e) => setFormData(prev => ({ ...prev, statusMessage: e.target.value }))}
              onFocus={() => setIsPlaceholderVisible(false)}
              onBlur={() => setIsPlaceholderVisible(true)}
              maxLength={30}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200"
              placeholder={currentPlaceholder}
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center space-x-2">
              <span className="text-sm text-gray-400">
                {formData.statusMessage.length}/30
              </span>
              {formData.statusMessage && (
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, statusMessage: '' }))}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>
          <p className="mt-2 text-sm text-gray-500">
            {formData.statusMessage ? (
              <span className="text-pink-500">✨ {formData.statusMessage}</span>
            ) : (
              <span className="text-gray-400 italic">
                {isPlaceholderVisible ? currentPlaceholder : '당신을 표현해보세요'}
              </span>
            )}
          </p>
        </div>
      </div>

      {/* 감정 태그 섹션 */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            테마 감정
            <span className="text-gray-400 text-xs ml-1">(선택, 최대 2개)</span>
          </label>
          <div className="mt-2">
            <div className="flex flex-wrap gap-2">
              {emotionTags.map((emotion) => (
                <button
                  key={emotion.id}
                  type="button"
                  onClick={() => handleEmotionSelect(emotion.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    selectedEmotions.includes(emotion.id)
                      ? 'text-white shadow-lg scale-105'
                      : 'text-gray-600 bg-gray-100 hover:bg-gray-200'
                  }`}
                  style={{
                    backgroundColor: selectedEmotions.includes(emotion.id)
                      ? emotion.color
                      : undefined
                  }}
                >
                  {emotion.label}
                  {selectedEmotions.includes(emotion.id) && (
                    <span className="ml-1">✓</span>
                  )}
                </button>
              ))}
            </div>
          </div>
          <p className="mt-2 text-sm text-gray-500">
            {selectedEmotions.length === 0 && '나를 표현하는 감정을 선택해보세요'}
            {selectedEmotions.length === 1 && '한 개 더 선택할 수 있어요'}
            {selectedEmotions.length === 2 && '감정 선택이 완료되었어요'}
          </p>
        </div>

        {/* 미리보기 섹션 */}
        <div className="mt-6">
          <p className="text-sm font-medium text-gray-700 mb-2">프로필 미리보기</p>
          <div 
            className={`p-6 rounded-2xl bg-gradient-to-br ${getBackgroundGradient()} transition-all duration-500 border border-gray-200`}
          >
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white shadow-md">
                <Image
                  src={formData.profileImage}
                  alt="프로필 이미지"
                  width={64}
                  height={64}
                  className="object-cover"
                />
              </div>
              <div className={selectedEmotions.length > 0 ? 'text-white' : 'text-gray-800'}>
                <h3 className="font-bold">{formData.nickname}</h3>
                <p className={`text-sm ${selectedEmotions.length > 0 ? 'opacity-90' : 'text-gray-600'}`}>
                  {formData.statusMessage || currentPlaceholder}
                </p>
                {selectedEmotions.length > 0 && (
                  <div className="flex gap-2 mt-2">
                    {selectedEmotions.map(emotionId => {
                      const emotion = emotionTags.find(tag => tag.id === emotionId);
                      return (
                        <span
                          key={emotionId}
                          className="px-2 py-0.5 text-xs rounded-full bg-white bg-opacity-20"
                        >
                          {emotion?.label}
                        </span>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 저장 버튼 */}
      <div className="flex justify-end mt-6">
        <button
          type="submit"
          disabled={isSaving || !!nicknameError}
          className={`
            px-6 py-2
            bg-pink-500 
            text-white 
            rounded-full 
            shadow-lg 
            hover:bg-pink-600 
            disabled:opacity-50 
            disabled:cursor-not-allowed 
            transition-all 
            duration-300
            flex 
            items-center 
            space-x-2
            text-sm
            ${isSaving ? 'scale-95' : 'hover:scale-105'}
          `}
        >
          {isSaving ? (
            <>
              <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>저장 중...</span>
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>저장하기</span>
            </>
          )}
        </button>
      </div>

      {/* 성공 토스트 메시지 */}
      {showSuccessToast && (
        <div className="fixed bottom-24 left-1/2 transform -translate-x-1/2 z-[100]">
          <div className="bg-gray-800 text-white px-6 py-3 rounded-full shadow-lg flex items-center space-x-2 animate-fade-in-up">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>프로필이 수정되었어요 :)</span>
          </div>
        </div>
      )}
    </form>
  );
} 