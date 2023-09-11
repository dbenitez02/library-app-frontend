export const oktaConfig = {
    clientId: '0oab6nfhlmCz6L12B5d7',
    issuer: "https://dev-48810062.okta.com/oauth2/default",
    redirectUri: 'http://localhost:3000/login/callback',
    scopes: ['openid', 'profile', 'email'],
    pkce: true,
    disableHttpsCheck: true,
}