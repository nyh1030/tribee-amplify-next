'use client';

import { ProfileEditForm } from '../../components/profile';

// 임시 데이터
const mockProfileData = {
  nickname: '행복한 여행자',
  statusMessage: '작은 빛을 수집하는 중이에요',
  email: 'user@example.com',
  profileImage: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop',
  interests: ['카페', '전시회', '자연']
};

export default function ProfileEditPage() {
  return (
    <div className="container mx-auto px-4 py-8 pb-24">
      <h1 className="text-2xl font-bold mb-6">프로필 수정</h1>
      <ProfileEditForm initialData={mockProfileData} />
    </div>
  );
} 