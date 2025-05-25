'use client';

import { useState, useRef } from 'react';
import { client } from '@/app/utils/amplify';
import Image from 'next/image';

export default function PlaceForm() {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    address: '',
    latitude: '',
    longitude: '',
    category: '',
    tags: '',
    images: [] as string[],
  });

  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newPreviewImages: string[] = [];
    const newImages: string[] = [];

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        newPreviewImages.push(result);
        newImages.push(result);
        setPreviewImages([...previewImages, ...newPreviewImages]);
        setFormData(prev => ({
          ...prev,
          images: [...prev.images, ...newImages]
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setPreviewImages(prev => prev.filter((_, i) => i !== index));
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log('제출할 데이터:', formData);
      const place = {
        ...formData,
        latitude: parseFloat(formData.latitude),
        longitude: parseFloat(formData.longitude),
        tags: formData.tags.split(',').map(tag => tag.trim()),
      };
      console.log('변환된 데이터:', place);
      const result = await client.models.Place.create(place);
      console.log('등록 결과:', result);
      alert('장소가 성공적으로 등록되었습니다!');
      setFormData({
        name: '',
        description: '',
        address: '',
        latitude: '',
        longitude: '',
        category: '',
        tags: '',
        images: [],
      });
      setPreviewImages([]);
    } catch (error) {
      console.error('장소 등록 에러 상세:', error);
      if (error instanceof Error) {
        alert(`장소 등록에 실패했습니다: ${error.message}`);
      } else {
        alert('장소 등록에 실패했습니다. 콘솔을 확인해주세요.');
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-3xl shadow-xl border-2 border-pink-100">
      <div className="space-y-6">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-pink-600 mb-2">새로운 장소 등록하기</h2>
          <p className="text-gray-500">당신만의 특별한 장소를 공유해보세요!</p>
        </div>

        <div>
          <label htmlFor="name" className="block text-sm font-medium text-pink-600 mb-2">장소 이름</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-xl border-2 border-pink-100 shadow-sm focus:border-pink-300 focus:ring-pink-300 transition-all duration-300 ease-in-out"
            placeholder="장소 이름을 입력해주세요"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-pink-600 mb-2">설명</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="mt-1 block w-full rounded-xl border-2 border-pink-100 shadow-sm focus:border-pink-300 focus:ring-pink-300 transition-all duration-300 ease-in-out"
            placeholder="장소에 대한 설명을 입력해주세요"
            rows={4}
          />
        </div>

        <div>
          <label htmlFor="address" className="block text-sm font-medium text-pink-600 mb-2">주소</label>
          <input
            type="text"
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-xl border-2 border-pink-100 shadow-sm focus:border-pink-300 focus:ring-pink-300 transition-all duration-300 ease-in-out"
            placeholder="주소를 입력해주세요"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="latitude" className="block text-sm font-medium text-pink-600 mb-2">위도</label>
            <input
              type="number"
              id="latitude"
              name="latitude"
              value={formData.latitude}
              onChange={handleChange}
              required
              step="any"
              className="mt-1 block w-full rounded-xl border-2 border-pink-100 shadow-sm focus:border-pink-300 focus:ring-pink-300 transition-all duration-300 ease-in-out"
              placeholder="위도를 입력해주세요"
            />
          </div>

          <div>
            <label htmlFor="longitude" className="block text-sm font-medium text-pink-600 mb-2">경도</label>
            <input
              type="number"
              id="longitude"
              name="longitude"
              value={formData.longitude}
              onChange={handleChange}
              required
              step="any"
              className="mt-1 block w-full rounded-xl border-2 border-pink-100 shadow-sm focus:border-pink-300 focus:ring-pink-300 transition-all duration-300 ease-in-out"
              placeholder="경도를 입력해주세요"
            />
          </div>
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium text-pink-600 mb-2">카테고리</label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-xl border-2 border-pink-100 shadow-sm focus:border-pink-300 focus:ring-pink-300 transition-all duration-300 ease-in-out"
          >
            <option value="">카테고리 선택</option>
            <option value="카페">카페</option>
            <option value="식당">식당</option>
            <option value="공원">공원</option>
            <option value="전시">전시</option>
            <option value="기타">기타</option>
          </select>
        </div>

        <div>
          <label htmlFor="tags" className="block text-sm font-medium text-pink-600 mb-2">태그 (쉼표로 구분)</label>
          <input
            type="text"
            id="tags"
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            className="mt-1 block w-full rounded-xl border-2 border-pink-100 shadow-sm focus:border-pink-300 focus:ring-pink-300 transition-all duration-300 ease-in-out"
            placeholder="태그를 쉼표로 구분하여 입력해주세요"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-pink-600 mb-2">이미지</label>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-pink-100 border-dashed rounded-xl hover:border-pink-300 transition-all duration-300 ease-in-out bg-pink-50">
            <div className="space-y-2 text-center">
              <svg
                className="mx-auto h-12 w-12 text-pink-400"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
                aria-hidden="true"
              >
                <path
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <div className="flex text-sm text-pink-600">
                <label
                  htmlFor="file-upload"
                  className="relative cursor-pointer bg-white rounded-md font-medium text-pink-600 hover:text-pink-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-pink-500"
                >
                  <span>이미지 업로드</span>
                  <input
                    id="file-upload"
                    name="file-upload"
                    type="file"
                    className="sr-only"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    ref={fileInputRef}
                  />
                </label>
                <p className="pl-1">또는 드래그 앤 드롭</p>
              </div>
              <p className="text-xs text-pink-400">PNG, JPG, GIF up to 10MB</p>
            </div>
          </div>
        </div>

        {previewImages.length > 0 && (
          <div className="grid grid-cols-3 gap-4 mt-4">
            {previewImages.map((image, index) => (
              <div key={index} className="relative group">
                <Image
                  src={image}
                  alt={`Preview ${index + 1}`}
                  width={200}
                  height={200}
                  className="rounded-xl object-cover w-full h-32 shadow-md hover:shadow-lg transition-all duration-300 ease-in-out"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-2 right-2 bg-pink-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-all duration-300 ease-in-out hover:bg-pink-600"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <button
        type="submit"
        className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white py-3 px-4 rounded-xl hover:from-pink-600 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 transition-all duration-300 ease-in-out font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
      >
        장소 등록하기
      </button>
    </form>
  );
} 