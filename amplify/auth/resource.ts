import {defineAuth, secret} from '@aws-amplify/backend';

export const auth = defineAuth({
  loginWith: {
    email: true,
    externalProviders: {
      google: {
        clientId: secret('GOOGLE_CLIENT_ID'),
        clientSecret: secret('GOOGLE_CLIENT_SECRET')
      },
      callbackUrls: [
        'http://localhost:3000/oauth2/idpresponse',
        'https://mywebsite.com/oauth2/idpresponse'
      ],
      logoutUrls: ['http://localhost:3000/', 'https://mywebsite.com'],
    }
  }
});