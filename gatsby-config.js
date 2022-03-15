require('dotenv').config({
  path: `.env.${process.env.NODE_ENV}`,
});

module.exports = {
  siteMetadata: {
    title: '',
    siteUrl: 'https://www.yourdomain.tld',
  },
  plugins: ['gatsby-plugin-styled-components'],
};
