export const CONFIG = {
  PORT: +(process.env.PORT || 3001),
  MONGO_URL: process.env.MONGO_URL,
  REQUESTER_SESSION_ID: process.env.REQUESTER_SESSION_ID,
  FLARESOLVERR_HOST: process.env.FLARESOLVERR_HOST || 'localhost',
  FLARESOLVERR_PORT: process.env.FLARESOLVERR_PORT || '8191',
};

Object.entries(CONFIG).forEach(([k, v]) => {
  if (v === undefined) {
    throw new Error(`Missing config: ${k}`);
  }
});
