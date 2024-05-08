import {defineAuth, secret} from '@aws-amplify/backend';

export const auth = defineAuth({
  loginWith: {
    email: true,
    externalProviders: {
      google: {
        clientId: secret('GOOGLE_CLIENT_ID'),
        clientSecret: secret('GOOGLE_CLIENT_SECRET'),
        scopes: ['email']
      },
      callbackUrls: [
        'http://localhost:3000'  // 사용자 인증 성공 후 리디렉션될 주소
      ],
      logoutUrls: ['http://localhost:3000/'],  // 로그아웃 후 리디렉션될 주소
    }
  }
});