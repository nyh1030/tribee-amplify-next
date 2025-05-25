'use client';

import { signInWithRedirect, getCurrentUser, signOut } from 'aws-amplify/auth';
import { useEffect, useState } from 'react';

export default function HomePage() {
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const checkUser = async () => {
            try {
                const currentUser = await getCurrentUser();
                setUser(currentUser);
            } catch (error) {
                console.log('로그인되지 않은 상태');
            }
        };
        checkUser();
    }, []);

    // const handleGoogleSignIn = async () => {
    //     try {
    //         await signInWithRedirect({ provider: 'Google' });
    //     } catch (error) {
    //         console.error('Google 로그인 에러:', error);
    //     }
    // };

    const handleSignOut = async () => {
        try {
            await signOut();
            setUser(null);
        } catch (error) {
            console.error('로그아웃 에러:', error);
        }
    };

    return (
        <div className="container">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center space-x-2">
                    <h1 className="text-2xl font-bold">picklet</h1>
                </div>
                {user && (
                    <div className="flex items-center gap-4">
                        <span className="text-gray-600">안녕하세요, {user.username}님</span>
                        <button
                            onClick={handleSignOut}
                            className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90"
                        >
                            로그아웃
                        </button>
                    </div>
                )}
            </div>
            
            {!user ? (
                <div className="flex flex-col items-center justify-center min-h-screen p-4">
                    <h1 className="text-3xl font-bold mb-8">picklet에 오신 것을 환영합니다</h1>
                    {/* <button
                        onClick={handleGoogleSignIn}
                        className="bg-white text-gray-700 px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-shadow flex items-center gap-2"
                    >
                        <img
                            src="https://www.google.com/favicon.ico"
                            alt="Google"
                            className="w-5 h-5"
                        />
                        Google로 로그인
                    </button> */}
                </div>
            ) : (
                <>
                    <section className="section">
                        <h2 className="section-title">전체 (시간 순)</h2>
                        {/* 전체 목록 컴포넌트 */}
                    </section>

                    <section className="section">
                        <h2 className="section-title">오늘의 추천 장소</h2>
                        {/* 추천 장소 컴포넌트 */}
                    </section>

                    <section className="section">
                        <h2 className="section-title">당신을 위한 장소</h2>
                        {/* 맞춤 추천 장소 컴포넌트 */}
                    </section>
                </>
            )}
        </div>
    );
} 