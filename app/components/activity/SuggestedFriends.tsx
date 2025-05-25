'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

interface SuggestedFriend {
  id: string;
  nickname: string;
  profileImage: string;
  reason: {
    type: 'emotions' | 'places';
    count: number;
    details: string;
    tags?: string[];
  };
}

interface SuggestedFriendsProps {}

const mockSuggestedFriends: SuggestedFriend[] = [
  {
    id: 'user1',
    nickname: '고요한잔',
    profileImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop',
    reason: {
      type: 'emotions',
      count: 3,
      details: '고요함, 낯섦, 따뜻함을 자주 기록했어요',
      tags: ['고요함', '낯섦', '따뜻함']
    },
  },
  {
    id: 'user2',
    nickname: '달빛산책자',
    profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop',
    reason: {
      type: 'places',
      count: 3,
      details: '3곳의 장소를 함께 좋아했어요',
    },
  },
  {
    id: 'user3',
    nickname: '카페인러버',
    profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
    reason: {
      type: 'places',
      count: 5,
      details: '5곳의 카페를 함께 좋아했어요',
    },
  },
];

export default function SuggestedFriends({}: SuggestedFriendsProps) {
  const router = useRouter();
  const [following, setFollowing] = useState<string[]>([]);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const handleFollow = (userId: string) => {
    setFollowing((prev) => [...prev, userId]);
  };

  const handleProfileClick = (userId: string) => {
    router.push(`/profile/${userId}`);
  };

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300;
      const newScrollLeft = direction === 'left' 
        ? scrollContainerRef.current.scrollLeft - scrollAmount
        : scrollContainerRef.current.scrollLeft + scrollAmount;
      
      scrollContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="relative">
      {/* 좌측 화살표 */}
      {showLeftArrow && (
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 backdrop-blur-sm rounded-full p-2 shadow-md hover:bg-white transition-colors"
        >
          <ChevronLeftIcon className="w-5 h-5 text-gray-600" />
        </button>
      )}

      {/* 우측 화살표 */}
      {showRightArrow && (
        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 backdrop-blur-sm rounded-full p-2 shadow-md hover:bg-white transition-colors"
        >
          <ChevronRightIcon className="w-5 h-5 text-gray-600" />
        </button>
      )}

      {/* 스크롤 컨테이너 */}
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {mockSuggestedFriends.map((friend) => (
          <div
            key={friend.id}
            className="flex-none w-[280px] snap-start"
          >
            <div className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-all duration-200 h-[180px]">
              <div className="flex items-start space-x-3 h-full">
                {/* 프로필 이미지 */}
                <div 
                  className="flex-shrink-0 cursor-pointer"
                  onClick={() => handleProfileClick(friend.id)}
                >
                  <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-pink-100">
                    <Image
                      src={friend.profileImage}
                      alt={friend.nickname}
                      width={64}
                      height={64}
                      className="object-cover"
                    />
                  </div>
                </div>

                {/* 친구 정보 */}
                <div className="flex-1 min-w-0 flex flex-col h-full">
                  <div className="flex-1">
                    <h3 
                      className="text-base font-medium text-gray-900 cursor-pointer hover:text-gray-700"
                      onClick={() => handleProfileClick(friend.id)}
                    >
                      {friend.nickname}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                      {friend.reason.details}
                    </p>
                    {friend.reason.tags && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {friend.reason.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="px-2 py-0.5 bg-pink-50 text-pink-600 rounded-full text-xs"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* 버튼 그룹 */}
                  <div className="mt-auto flex items-center gap-2">
                    <button
                      onClick={() => handleFollow(friend.id)}
                      disabled={following.includes(friend.id)}
                      className={`flex-1 px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap ${
                        following.includes(friend.id)
                          ? 'bg-gray-100 text-gray-400 cursor-default'
                          : 'bg-pink-500 text-white hover:bg-pink-600'
                      }`}
                    >
                      {following.includes(friend.id) ? '팔로잉' : '팔로우'}
                    </button>
                    <button
                      onClick={() => handleProfileClick(friend.id)}
                      className="flex-1 px-3 py-1.5 rounded-full text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-100 whitespace-nowrap"
                    >
                      더 알아보기
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 