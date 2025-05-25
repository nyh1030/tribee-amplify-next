'use client';

import { useState } from 'react';
import Image from 'next/image';

interface User {
  id: string;
  nickname: string;
  profileImage: string;
  statusMessage: string;
  interests: string[];
}

interface ConnectionInfoProps {
  following: number;
  followers: number;
}

// 임시 데이터
const mockFollowingUsers: User[] = [
  {
    id: '1',
    nickname: '카페 탐험가',
    profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop',
    statusMessage: '새로운 카페를 찾아다니는 중',
    interests: ['카페', '디저트', '사진']
  },
  {
    id: '2',
    nickname: '여행의 기록',
    profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
    statusMessage: '세계 각지의 아름다움을 기록합니다',
    interests: ['여행', '사진', '자연']
  },
  {
    id: '3',
    nickname: '맛집 탐험가',
    profileImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop',
    statusMessage: '맛있는 음식과 좋은 공간을 찾아요',
    interests: ['맛집', '카페', '디자인']
  }
];

const mockFollowerUsers: User[] = [
  {
    id: '4',
    nickname: '도시의 기록',
    profileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop',
    statusMessage: '도시의 작은 순간들을 기록합니다',
    interests: ['사진', '도시', '건축']
  },
  {
    id: '5',
    nickname: '일상의 기록',
    profileImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop',
    statusMessage: '소소한 일상의 기록',
    interests: ['일상', '사진', '카페']
  }
];

export default function ConnectionInfo({ following, followers }: ConnectionInfoProps) {
  const [showFollowing, setShowFollowing] = useState(false);
  const [showFollowers, setShowFollowers] = useState(false);

  const handleUserClick = (userId: string) => {
    // TODO: 사용자 프로필 페이지로 이동
    console.log('Navigate to user profile:', userId);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
      <h2 className="text-lg font-semibold mb-4">연결 정보</h2>
      <div className="grid grid-cols-2 gap-4">
        <div className="text-center">
          <button
            onClick={() => setShowFollowing(true)}
            className="w-full p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
          >
            <div className="text-2xl font-bold text-pink-500">{following}</div>
            <div className="text-sm text-gray-600">내가 수집한 사람들</div>
          </button>
        </div>
        <div className="text-center">
          <button
            onClick={() => setShowFollowers(true)}
            className="w-full p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
          >
            <div className="text-2xl font-bold text-pink-500">{followers}</div>
            <div className="text-sm text-gray-600">나를 수집한 사람들</div>
          </button>
        </div>
      </div>

      {/* 팔로잉 모달 */}
      {showFollowing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">내가 수집한 사람들</h3>
              <button
                onClick={() => setShowFollowing(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="space-y-4">
              {mockFollowingUsers.map((user) => (
                <div
                  key={user.id}
                  onClick={() => handleUserClick(user.id)}
                  className="flex items-center space-x-4 p-3 rounded-xl hover:bg-gray-50 cursor-pointer"
                >
                  <Image
                    src={user.profileImage}
                    alt={user.nickname}
                    width={48}
                    height={48}
                    className="rounded-full"
                  />
                  <div className="flex-1">
                    <div className="font-medium">{user.nickname}</div>
                    <div className="text-sm text-gray-500">{user.statusMessage}</div>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {user.interests.map((interest) => (
                        <span
                          key={interest}
                          className="text-xs bg-pink-100 text-pink-600 px-2 py-0.5 rounded-full"
                        >
                          {interest}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 팔로워 모달 */}
      {showFollowers && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">나를 수집한 사람들</h3>
              <button
                onClick={() => setShowFollowers(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="space-y-4">
              {mockFollowerUsers.map((user) => (
                <div
                  key={user.id}
                  onClick={() => handleUserClick(user.id)}
                  className="flex items-center space-x-4 p-3 rounded-xl hover:bg-gray-50 cursor-pointer"
                >
                  <Image
                    src={user.profileImage}
                    alt={user.nickname}
                    width={48}
                    height={48}
                    className="rounded-full"
                  />
                  <div className="flex-1">
                    <div className="font-medium">{user.nickname}</div>
                    <div className="text-sm text-gray-500">{user.statusMessage}</div>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {user.interests.map((interest) => (
                        <span
                          key={interest}
                          className="text-xs bg-pink-100 text-pink-600 px-2 py-0.5 rounded-full"
                        >
                          {interest}
                        </span>
                      ))}
                    </div>
                  </div>
                  <button className="px-3 py-1 text-sm bg-pink-500 text-white rounded-full hover:bg-pink-600">
                    수집하기
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 