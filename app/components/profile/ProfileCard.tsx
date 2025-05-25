'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface ProfileCardProps {
  profile?: {
    nickname: string;
    statusMessage?: string;
    email: string;
    profileImage?: string;
    interests?: string[];
  };
}

export default function ProfileCard({ 
  profile = {
    nickname: '행복한 여행자',
    email: 'user@example.com',
    statusMessage: '작은 빛을 수집하는 중이에요',
    profileImage: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop',
    interests: ['카페', '전시회', '자연']
  }
}: ProfileCardProps) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [showInterestModal, setShowInterestModal] = useState(false);
  const [newInterest, setNewInterest] = useState('');
  const [interests, setInterests] = useState(profile.interests || []);

  const handleEditClick = () => {
    router.push('/profile/edit');
  };

  const handleAddInterest = () => {
    if (newInterest.trim() && !interests.includes(newInterest.trim())) {
      setInterests([...interests, newInterest.trim()]);
      setNewInterest('');
      setShowInterestModal(false);
    }
  };

  const handleRemoveInterest = (interestToRemove: string) => {
    setInterests(interests.filter(interest => interest !== interestToRemove));
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
      <div className="flex items-start space-x-6">
        {/* 프로필 이미지 */}
        <div className="relative">
          <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-pink-100">
            <Image
              src={profile.profileImage || '/default-avatar.png'}
              alt="프로필 이미지"
              width={96}
              height={96}
              className="object-cover"
            />
          </div>
          <button
            onClick={handleEditClick}
            className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-md hover:bg-gray-50"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </button>
        </div>

        {/* 프로필 정보 */}
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <h2 className="text-xl font-bold">{profile.nickname}</h2>
            <button className="text-gray-400 hover:text-gray-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>
          
          <p className="text-gray-500 mb-2">{profile.statusMessage || '당신을 짧게 표현해볼까요?'}</p>
          <p className="text-sm text-gray-400 mb-4">{profile.email}</p>

          {/* 취향 키워드 */}
          <div className="flex flex-wrap gap-2 mb-4">
            {interests.map((interest, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-pink-50 text-pink-600 rounded-full text-sm flex items-center gap-1"
              >
                {interest}
                <button 
                  onClick={() => handleRemoveInterest(interest)}
                  className="hover:text-pink-700"
                >
                  ×
                </button>
              </span>
            ))}
            <button 
              onClick={() => setShowInterestModal(true)}
              className="px-3 py-1 bg-gray-50 text-gray-600 rounded-full text-sm hover:bg-gray-100"
            >
              +
            </button>
          </div>

          {/* 버튼 그룹 */}
          <div className="flex space-x-3">
            <button 
              onClick={handleEditClick}
              className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600"
            >
              프로필 수정
            </button>
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              로그아웃
            </button>
            <button className="px-4 py-2 text-gray-500 hover:text-gray-700">
              회원탈퇴
            </button>
          </div>
        </div>
      </div>

      {/* 관심사 추가 모달 */}
      {showInterestModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="text-lg font-semibold mb-4">관심사 추가</h3>
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={newInterest}
                onChange={(e) => setNewInterest(e.target.value)}
                placeholder="새로운 관심사를 입력하세요"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                maxLength={10}
              />
              <button
                onClick={handleAddInterest}
                className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600"
              >
                추가
              </button>
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => {
                  setShowInterestModal(false);
                  setNewInterest('');
                }}
                className="px-4 py-2 text-gray-500 hover:text-gray-700"
              >
                취소
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 