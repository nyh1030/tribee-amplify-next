'use client';

import { useEffect } from 'react';

export default function AmplifyConfig() {
  useEffect(() => {
    console.log('Amplify 설정 확인 시작...');
    console.log('User Pool ID:', process.env.NEXT_PUBLIC_USER_POOL_ID);
    console.log('User Pool Client ID:', process.env.NEXT_PUBLIC_USER_POOL_CLIENT_ID);
    console.log('Identity Pool ID:', process.env.NEXT_PUBLIC_IDENTITY_POOL_ID);
    console.log('OAuth Domain:', process.env.NEXT_PUBLIC_OAUTH_DOMAIN);
    console.log('Redirect Sign In:', process.env.NEXT_PUBLIC_REDIRECT_SIGN_IN);
    console.log('Redirect Sign Out:', process.env.NEXT_PUBLIC_REDIRECT_SIGN_OUT);
    console.log('GraphQL Endpoint:', process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT);
  }, []);

  return null;
} 