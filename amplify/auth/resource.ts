import {defineAuth, secret} from '@aws-amplify/backend';

const environment = process.env.BUILD_ENV; // 환경 변수에서 환경 설정 읽기

// 초기 배열 값을 설정하여 타입 에러 방지
let callbackUrls: string[] = ['http://localhost:3000'];
let logoutUrls: string[] = ['http://localhost:3000'];

if (environment === 'prod') {
  callbackUrls = ['https://main.d1nwj521dwh1h1.amplifyapp.com'];
  logoutUrls = ['https://main.d1nwj521dwh1h1.amplifyapp.com'];
} else if (environment === 'dev') {
  callbackUrls = ['http://localhost:3000'];
  logoutUrls = ['http://localhost:3000'];
}

export const auth = defineAuth({
  loginWith: {
    email: true,
    externalProviders: {
      google: {
        clientId: secret('GOOGLE_CLIENT_ID'),
        clientSecret: secret('GOOGLE_CLIENT_SECRET'),
        scopes: ['email']
      },
      callbackUrls : callbackUrls,  // 사용자 인증 성공 후 리디렉션될 주소를 배열로 지정
      logoutUrls : logoutUrls,  // 로그아웃 후 리디렉션될 주소를 배열로 지정
    }
  }
});