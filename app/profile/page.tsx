'use client';

import { ProfileCard, ConnectionInfo, ArchivingHistory } from '../components/profile';

// 임시 데이터
const mockData = {
  profile: {
    nickname: '행복한 여행자',
    statusMessage: '작은 빛을 수집하는 중이에요',
    email: 'user@example.com',
    profileImage: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop',
    interests: ['카페', '전시회', '자연']
  },
  connections: {
    following: 12,
    followers: 8
  },
  archiving: {
    picks: [
      {
        id: '1',
        title: '조용한 카페',
        image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400&h=300&fit=crop',
        emotion: '고요함',
        emotionColor: 'rgba(100, 116, 139, 0.8)',
        createdAt: '2024-03-20T10:00:00Z',
        likes: 24
      },
      {
        id: '2',
        title: '아늑한 서점',
        image: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=400&h=300&fit=crop',
        emotion: '포근함',
        emotionColor: 'rgba(251, 146, 60, 0.8)',
        createdAt: '2024-03-19T15:30:00Z',
        likes: 18
      },
      {
        id: '3',
        title: '바다가 보이는 카페',
        image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=300&fit=crop',
        emotion: '설렘',
        emotionColor: 'rgba(59, 130, 246, 0.8)',
        createdAt: '2024-03-18T09:15:00Z',
        likes: 32
      },
      {
        id: '4',
        title: '숨겨진 정원',
        image: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=400&h=300&fit=crop',
        emotion: '신비로움',
        emotionColor: 'rgba(139, 92, 246, 0.8)',
        createdAt: '2024-03-17T14:45:00Z',
        likes: 15
      }
    ],
    clets: [
      {
        id: '1',
        title: '나만의 카페 리스트',
        coverImage: 'https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=400&h=300&fit=crop',
        placeCount: 5,
        description: '주말에 가기 좋은 조용한 카페들을 모았어요',
        isPublic: true
      },
      {
        id: '2',
        title: '주말 데이트 코스',
        coverImage: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop',
        placeCount: 3,
        description: '특별한 날을 위한 로맨틱한 장소들',
        isPublic: false
      },
      {
        id: '3',
        title: '작업하기 좋은 공간',
        coverImage: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=400&h=300&fit=crop',
        placeCount: 4,
        description: '집중하기 좋은 카페와 공유오피스',
        isPublic: true
      },
      {
        id: '4',
        title: '힐링 스팟',
        coverImage: 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=400&h=300&fit=crop',
        placeCount: 6,
        description: '마음의 평화를 찾을 수 있는 장소들',
        isPublic: true
      }
    ]
  }
};

export default function ProfilePage() {
  return (
    <div className="container mx-auto px-4 py-8 pb-24">
      <ProfileCard {...mockData.profile} />
      <ConnectionInfo {...mockData.connections} />
      <ArchivingHistory {...mockData.archiving} />
    </div>
  );
} 