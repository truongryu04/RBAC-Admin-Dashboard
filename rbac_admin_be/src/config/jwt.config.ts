export const jwtConfig = {
  accessToken: {
    secret: process.env.JWT_ACCESS_SECRET || 'access_secret',
    expiresIn: '1h',
  },
  refreshToken: {
    secret: process.env.JWT_REFRESH_SECRET || 'refresh_secret',
    expiresIn: '7d',
  },
};
