import { Amplify } from 'aws-amplify';
import { generateClient } from 'aws-amplify/api';
import { type Schema } from '@/amplify/data/resource';

console.log('Amplify 설정 로딩 시작...');
console.log('User Pool ID:', process.env.NEXT_PUBLIC_USER_POOL_ID);
console.log('User Pool Client ID:', process.env.NEXT_PUBLIC_USER_POOL_CLIENT_ID);
console.log('Identity Pool ID:', process.env.NEXT_PUBLIC_IDENTITY_POOL_ID);
console.log('OAuth Domain:', process.env.NEXT_PUBLIC_OAUTH_DOMAIN);
console.log('Redirect Sign In:', process.env.NEXT_PUBLIC_REDIRECT_SIGN_IN);
console.log('Redirect Sign Out:', process.env.NEXT_PUBLIC_REDIRECT_SIGN_OUT);
console.log('GraphQL Endpoint:', process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT);

const config = {
  Auth: {
    Cognito: {
      userPoolId: process.env.NEXT_PUBLIC_USER_POOL_ID!,
      userPoolClientId: process.env.NEXT_PUBLIC_USER_POOL_CLIENT_ID!,
      identityPoolId: process.env.NEXT_PUBLIC_IDENTITY_POOL_ID!,
      loginWith: {
        oauth: {
          domain: process.env.NEXT_PUBLIC_OAUTH_DOMAIN!,
          scopes: ['email', 'openid', 'profile'],
          redirectSignIn: [process.env.NEXT_PUBLIC_REDIRECT_SIGN_IN!],
          redirectSignOut: [process.env.NEXT_PUBLIC_REDIRECT_SIGN_OUT!],
          responseType: 'code' as const
        }
      }
    }
  },
  API: {
    GraphQL: {
      endpoint: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT!,
      region: 'ap-northeast-2',
      defaultAuthMode: 'userPool' as const,
    }
  }
};

console.log('Amplify 설정:', config);

Amplify.configure(config, {
  ssr: true
});

console.log('Amplify 설정 완료');

// ✅ GraphQL 클라이언트
export const client = generateClient<Schema>();