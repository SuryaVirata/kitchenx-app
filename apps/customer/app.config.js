const appJson = require('./app.json');

module.exports = () => {
  const expo = {
    ...appJson.expo,
    web: {
      ...appJson.expo.web,
      output: 'single',
    },
  };
  const baseUrl = process.env.KX_PAGES_BASE;
  if (baseUrl) {
    expo.experiments = { ...(expo.experiments ?? {}), baseUrl };
  }
  return { expo };
};
