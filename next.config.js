const urlPrefix = process.env.URL_PREFIX ? '/' + process.env.URL_PREFIX : ''
module.exports = {
  basePath: urlPrefix,
  assetPrefix: urlPrefix,
  trailingSlash: true,
};
