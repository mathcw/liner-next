const withCss = require('@zeit/next-css');
const isProd = process.env.NODE_ENV === 'production'
const assetPrefix = isProd?'http://b2b.tongyeju.com/next':'';
const basePath = isProd?'/next':'';

if (typeof require !== undefined){
    require.extensions['.css'] = file => {
        
    }
}

module.exports = withCss({
    webpack: (config) => {
        return config
    },
    assetPrefix:assetPrefix,
    publicRuntimeConfig: {
        basePath
    },
})
