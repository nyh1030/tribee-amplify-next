'use client';

import { useState } from 'react';
import Image from 'next/image';

interface Pick {
  id: string;
  title: string;
  image: string;
  emotion: string;
  emotionColor: string;
  createdAt: string;
  likes: number;
}

interface Clet {
  id: string;
  title: string;
  coverImage: string;
  placeCount: number;
  description: string;
  isPublic: boolean;
}

interface ArchivingHistoryProps {
  picks: Pick[];
  clets: Clet[];
}

export default function ArchivingHistory({ picks, clets }: ArchivingHistoryProps) {
  const [activeTab, setActiveTab] = useState<'picks' | 'clets'>('picks');
  const [sortBy, setSortBy] = useState<'latest' | 'emotion' | 'popular'>('latest');
  const [selectedPick, setSelectedPick] = useState<Pick | null>(null);
  const [selectedClet, setSelectedClet] = useState<Clet | null>(null);

  const sortedPicks = [...picks].sort((a, b) => {
    switch (sortBy) {
      case 'latest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'popular':
        return b.likes - a.likes;
      case 'emotion':
        return a.emotion.localeCompare(b.emotion);
      default:
        return 0;
    }
  });

  const handlePickClick = (pick: Pick) => {
    setSelectedPick(pick);
  };

  const handleCletClick = (clet: Clet) => {
    setSelectedClet(clet);
  };

  const closeModal = () => {
    setSelectedPick(null);
    setSelectedClet(null);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold">나의 아카이빙 기록</h2>
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveTab('picks')}
            className={`px-4 py-2 rounded-lg ${
              activeTab === 'picks'
                ? 'bg-pink-500 text-white'
                : 'bg-gray-100 text-gray-600'
            }`}
          >
            Pick
          </button>
          <button
            onClick={() => setActiveTab('clets')}
            className={`px-4 py-2 rounded-lg ${
              activeTab === 'clets'
                ? 'bg-pink-500 text-white'
                : 'bg-gray-100 text-gray-600'
            }`}
          >
            Clet
          </button>
        </div>
      </div>

      <div className="min-h-[400px] max-h-[calc(100vh-400px)] overflow-y-auto pr-2">
        {activeTab === 'picks' ? (
          <>
            <div className="flex justify-between items-center mb-4 sticky top-0 bg-white py-2">
              <div className="text-sm text-gray-500">
                총 {picks.length}개의 Pick
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-1 text-sm"
              >
                <option value="latest">최신순</option>
                <option value="emotion">감정별</option>
                <option value="popular">인기순</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {sortedPicks.map((pick) => (
                <div
                  key={pick.id}
                  className="relative rounded-xl overflow-hidden cursor-pointer transform transition-transform hover:scale-105"
                  onClick={() => handlePickClick(pick)}
                >
                  <Image
                    src={pick.image}
                    alt={pick.title}
                    width={200}
                    height={200}
                    className="w-full h-40 object-cover"
                  />
                  <div
                    className="absolute bottom-0 left-0 right-0 p-3"
                    style={{
                      background: `linear-gradient(to top, ${pick.emotionColor}, transparent)`
                    }}
                  >
                    <h3 className="text-white font-medium">{pick.title}</h3>
                    <div className="flex items-center justify-between">
                      <span className="text-white text-sm opacity-80">{pick.emotion}</span>
                      <div className="flex items-center text-white text-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                        {pick.likes}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {clets.map((clet) => (
              <div
                key={clet.id}
                className="relative rounded-xl overflow-hidden cursor-pointer transform transition-transform hover:scale-105"
                onClick={() => handleCletClick(clet)}
              >
                <Image
                  src={clet.coverImage}
                  alt={clet.title}
                  width={200}
                  height={200}
                  className="w-full h-40 object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent">
                  <h3 className="text-white font-medium">{clet.title}</h3>
                  <div className="flex items-center justify-between text-white text-sm">
                    <span>{clet.placeCount}개의 장소</span>
                    <div className="flex items-center space-x-2">
                      {clet.isPublic && (
                        <span className="bg-green-500/50 px-2 py-0.5 rounded-full text-xs">
                          공개
                        </span>
                      )}
                      <button className="hover:text-pink-300">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pick 상세 모달 */}
      {selectedPick && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full mx-4">
            <div className="relative">
              <Image
                src={selectedPick.image}
                alt={selectedPick.title}
                width={400}
                height={300}
                className="w-full h-64 object-cover rounded-xl"
              />
              <button
                onClick={closeModal}
                className="absolute top-2 right-2 bg-white/80 rounded-full p-2 hover:bg-white"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="mt-4">
              <h3 className="text-xl font-bold">{selectedPick.title}</h3>
              <div className="flex items-center justify-between mt-2">
                <span className="text-pink-500">{selectedPick.emotion}</span>
                <div className="flex items-center text-gray-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  {selectedPick.likes}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Clet 상세 모달 */}
      {selectedClet && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full mx-4">
            <div className="relative">
              <Image
                src={selectedClet.coverImage}
                alt={selectedClet.title}
                width={400}
                height={300}
                className="w-full h-64 object-cover rounded-xl"
              />
              <button
                onClick={closeModal}
                className="absolute top-2 right-2 bg-white/80 rounded-full p-2 hover:bg-white"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="mt-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold">{selectedClet.title}</h3>
                {selectedClet.isPublic && (
                  <span className="bg-green-500/50 px-3 py-1 rounded-full text-sm">
                    공개
                  </span>
                )}
              </div>
              <p className="text-gray-600 mt-2">{selectedClet.description}</p>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-gray-500">{selectedClet.placeCount}개의 장소</span>
                <button className="text-pink-500 hover:text-pink-600">
                  장소 목록 보기
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 