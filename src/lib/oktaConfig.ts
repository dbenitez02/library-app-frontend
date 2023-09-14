export const oktaConfig = {
    clientId: 'clientId',
    issuer: "Issuer",
    redirectUri: 'http://localhost:3000/login/callback',
    scopes: ['openid', 'profile', 'email'],
    pkce: true,
    disableHttpsCheck: true,
}