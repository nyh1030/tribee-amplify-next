'use client';

import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

export default function Auth() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <Authenticator
          loginMechanisms={['email']}
          signUpAttributes={['email', 'name']}
        >
          {({ signOut, user }) => (
            <div className="text-center">
              <h1 className="text-2xl font-bold mb-4">환영합니다, {user?.username}님!</h1>
              <button
                onClick={signOut}
                className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90"
              >
                로그아웃
              </button>
            </div>
          )}
        </Authenticator>
      </div>
    </div>
  );
} 