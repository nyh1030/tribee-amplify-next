'use client';

import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { useEffect } from 'react';
import { getCurrentUser } from 'aws-amplify/auth';
import { ReactElement } from 'react';

export default function AuthProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    // useEffect(() => {
    //     // 인증 상태 확인
    //     const checkAuth = async () => {
    //         try {
    //             const user = await getCurrentUser();
    //             console.log('현재 로그인된 사용자:', user);
    //         } catch (error) {
    //             console.log('로그인되지 않은 상태');
    //         }
    //     };
    //     checkAuth();
    // }, []);

    // return (
    //     <Authenticator
    //         loginMechanisms={['email']}
    //         signUpAttributes={['email', 'name']}
    //         // socialProviders={['google']}
    //     >
    //         {({ signOut, user }) => {
    //             console.log('Authenticator 상태:', { user, signOut });
    //             return children as ReactElement;
    //         }}
    //     </Authenticator>
    // );
    return <>{children}</>;
} 