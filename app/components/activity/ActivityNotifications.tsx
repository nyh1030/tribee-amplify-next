'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { format, formatDistanceToNow, isYesterday, isToday } from 'date-fns';
import { ko } from 'date-fns/locale';

interface Notification {
  id: string;
  type: 'like' | 'comment';
  user: {
    id: string;
    nickname: string;
    profileImage: string;
  };
  content: {
    type: 'place' | 'cllet';
    id: string;
    title: string;
    thumbnail?: string;
  };
  comment?: string;
  createdAt: Date;
}

interface ActivityNotificationsProps {
  showAll: boolean;
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'like',
    user: {
      id: 'user1',
      nickname: '김픽',
      profileImage: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop',
    },
    content: {
      type: 'place',
      id: 'place1',
      title: '카페 드 파리',
      thumbnail: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=200&h=200&fit=crop',
    },
    createdAt: new Date(Date.now() - 1000 * 60 * 5), // 5분 전
  },
  {
    id: '2',
    type: 'comment',
    user: {
      id: 'user2',
      nickname: '서클렛',
      profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop',
    },
    content: {
      type: 'cllet',
      id: 'cllet1',
      title: '서울의 숨겨진 카페',
      thumbnail: 'https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=200&h=200&fit=crop',
    },
    comment: '이 조합 정말 좋아요!',
    createdAt: new Date(Date.now() - 1000 * 60 * 30), // 30분 전
  },
  {
    id: '3',
    type: 'like',
    user: {
      id: 'user3',
      nickname: '카페인러버',
      profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
    },
    content: {
      type: 'place',
      id: 'place2',
      title: '스타벅스 강남점',
      thumbnail: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=200&h=200&fit=crop',
    },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2시간 전
  },
  {
    id: '4',
    type: 'comment',
    user: {
      id: 'user4',
      nickname: '여행자',
      profileImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop',
    },
    content: {
      type: 'cllet',
      id: 'cllet2',
      title: '서울의 숨겨진 카페',
      thumbnail: 'https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=200&h=200&fit=crop',
    },
    comment: '이 카페 정말 좋네요!',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1일 전
  },
];

export default function ActivityNotifications({ showAll }: ActivityNotificationsProps) {
  const router = useRouter();
  const displayedNotifications = showAll ? mockNotifications : mockNotifications.slice(0, 7);

  const handleNotificationClick = (notification: Notification) => {
    const path = notification.content.type === 'place' ? '/place' : '/cllet';
    router.push(`${path}/${notification.content.id}`);
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInMinutes < 1) {
      return '방금 전';
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes}분 전`;
    } else if (diffInHours < 24) {
      return `${diffInHours}시간 전`;
    } else if (isYesterday(date)) {
      const period = date.getHours() < 12 ? '오전' : '오후';
      const hour = date.getHours() % 12 || 12;
      return `어제 ${period} ${hour}시`;
    } else if (diffInDays < 7) {
      return `${diffInDays}일 전`;
    } else if (diffInDays < 30) {
      const weeks = Math.floor(diffInDays / 7);
      return `${weeks}주 전`;
    } else {
      return format(date, 'yyyy.MM.dd');
    }
  };

  return (
    <div className="space-y-4">
      {displayedNotifications.map((notification) => (
        <div
          key={notification.id}
          onClick={() => handleNotificationClick(notification)}
          className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer group"
        >
          <div className="flex items-start space-x-3">
            {/* 프로필 이미지 */}
            <div className="flex-shrink-0">
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-pink-100 group-hover:border-pink-200 transition-colors">
                <Image
                  src={notification.user.profileImage || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop'}
                  alt={notification.user.nickname}
                  width={48}
                  height={48}
                  className="object-cover"
                />
              </div>
            </div>

            {/* 알림 내용 */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-900 group-hover:text-gray-700 transition-colors">
                    <span className="font-medium">{notification.user.nickname}</span>
                    님이{' '}
                    {notification.type === 'like' ? '좋아요를 눌렀어요' : '댓글을 남겼어요'}
                  </p>
                  {notification.comment && (
                    <p className="mt-1 text-sm text-gray-600 group-hover:text-gray-500 transition-colors">
                      {notification.comment}
                    </p>
                  )}
                  <p className="mt-1 text-sm text-gray-500 group-hover:text-gray-400 transition-colors">
                    {notification.content.title}
                  </p>
                </div>
                <span className="text-xs text-gray-400 group-hover:text-gray-500 transition-colors">
                  {formatTime(notification.createdAt)}
                </span>
              </div>

              {/* 썸네일 */}
              {notification.content.thumbnail && (
                <div className="mt-2 w-20 h-20 rounded-lg overflow-hidden group-hover:ring-2 group-hover:ring-pink-100 transition-all">
                  <Image
                    src={notification.content.thumbnail}
                    alt={notification.content.title}
                    width={80}
                    height={80}
                    className="object-cover"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
} 