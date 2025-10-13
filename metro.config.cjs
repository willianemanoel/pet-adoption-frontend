// metro.config.cjs
const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Configuração básica do transformer
config.transformer = {
  ...config.transformer,
};

// Configuração básica do resolver
config.resolver = {
  ...config.resolver,
  assetExts: [...config.resolver.assetExts],
  sourceExts: [...config.resolver.sourceExts],
};

// Configuração de minificação
config.transformer.minifierPath = require.resolve('metro-minify-terser');

module.exports = config;
