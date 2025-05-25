'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MagnifyingGlassIcon, MapPinIcon, CameraIcon, PhotoIcon } from '@heroicons/react/24/outline';

interface ImageLocationUploadProps {
  onImageSelect: (file: File) => void;
  onLocationSelect: (location: { lat: number; lng: number }) => void;
}

export default function ImageLocationUpload({ onImageSelect, onLocationSelect }: ImageLocationUploadProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [locationStatus, setLocationStatus] = useState<string>('');
  const [imageDescription, setImageDescription] = useState<string>('');
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        onImageSelect(file);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLocationClick = () => {
    setLocationStatus('위치 정보를 가져오는 중...');
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          onLocationSelect({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setLocationStatus('위치 정보가 저장되었습니다.');
          setTimeout(() => setLocationStatus(''), 2000);
        },
        (error) => {
          console.error('Error getting location:', error);
          setLocationStatus('위치 정보를 가져오는데 실패했습니다.');
          setTimeout(() => setLocationStatus(''), 2000);
        }
      );
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
      }
      setIsCameraActive(true);
    } catch (error) {
      console.error('Error accessing camera:', error);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  const captureImage = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0);
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], 'camera-capture.jpg', { type: 'image/jpeg' });
            setSelectedImage(URL.createObjectURL(blob));
            onImageSelect(file);
            stopCamera();
          }
        }, 'image/jpeg');
      }
    }
  };

  return (
    <div className="space-y-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative aspect-square w-full max-w-md mx-auto"
      >
        <AnimatePresence mode="wait">
          {selectedImage ? (
            <motion.div
              key="selected-image"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="relative"
            >
              <img
                src={selectedImage}
                alt={imageDescription || "선택된 장소 이미지"}
                className="w-full h-full object-cover rounded-lg"
              />
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-lg pointer-events-none"
              />
              <input
                type="text"
                value={imageDescription}
                onChange={(e) => setImageDescription(e.target.value)}
                placeholder="이미지에 대한 설명을 입력하세요"
                className="absolute bottom-4 left-4 right-4 p-2 bg-white/90 rounded-lg text-sm"
                aria-label="이미지 설명 입력"
              />
            </motion.div>
          ) : isCameraActive ? (
            <motion.div
              key="camera-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="relative w-full h-full rounded-lg overflow-hidden"
            >
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover"
                aria-label="카메라 미리보기"
              />
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={captureImage}
                className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white p-4 rounded-full shadow-lg"
                aria-label="사진 촬영"
              >
                <CameraIcon className="w-6 h-6 text-gray-800" />
              </motion.button>
            </motion.div>
          ) : (
            <motion.div
              key="upload-options"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center w-full h-full border-2 border-dashed border-gray-300 rounded-lg"
            >
              <div className="flex space-x-4 mb-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={startCamera}
                  className="flex flex-col items-center p-4 bg-gray-100 rounded-lg hover:bg-gray-200"
                  aria-label="실시간 카메라 촬영"
                >
                  <CameraIcon className="w-8 h-8 text-gray-600 mb-2" />
                  <span className="text-sm text-gray-600">실시간 촬영</span>
                </motion.button>
                <label className="flex flex-col items-center p-4 bg-gray-100 rounded-lg hover:bg-gray-200 cursor-pointer">
                  <PhotoIcon className="w-8 h-8 text-gray-600 mb-2" />
                  <span className="text-sm text-gray-600">갤러리에서 선택</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                    aria-label="갤러리에서 이미지 선택"
                  />
                </label>
              </div>
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
              >
                <MagnifyingGlassIcon className="w-12 h-12 text-gray-400" />
              </motion.div>
              <span className="mt-2 text-sm text-gray-500">탐색하기</span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <div className="space-y-2">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleLocationClick}
          className="flex items-center justify-center w-full p-3 text-sm text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200"
          aria-label="현재 위치 가져오기"
        >
          <MapPinIcon className="w-5 h-5 mr-2" />
          현재 위치 가져오기
        </motion.button>
        {locationStatus && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-sm text-center text-gray-600"
            role="status"
            aria-live="polite"
          >
            {locationStatus}
          </motion.p>
        )}
      </div>
    </div>
  );
} 