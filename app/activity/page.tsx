'use client';

import { useState } from 'react';
import ActivityNotifications from '../components/activity/ActivityNotifications';
import SuggestedFriends from '../components/activity/SuggestedFriends';

export default function ActivityPage() {
  const [showAllNotifications, setShowAllNotifications] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* 반응 알림 섹션 */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">반응 알림</h2>
            <button
              onClick={() => setShowAllNotifications(!showAllNotifications)}
              className="text-sm text-pink-600 hover:text-pink-700"
            >
              {showAllNotifications ? '최근 알림만 보기' : '전체 보기'}
            </button>
          </div>
          <ActivityNotifications showAll={showAllNotifications} />
        </section>

        {/* 친구 추천 섹션 */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">친구 추천</h2>
          <SuggestedFriends />
        </section>
      </div>
    </div>
  );
} 