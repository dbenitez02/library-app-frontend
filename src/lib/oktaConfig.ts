export const oktaConfig = {
    clientId: 'client-id',
    issuer: "issuer",
    redirectUri: 'http://localhost:3000/login/callback',
    scopes: ['openid', 'profile', 'email'],
    pkce: true,
    disableHttpsCheck: true,
}