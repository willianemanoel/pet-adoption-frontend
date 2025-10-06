const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Configuração simples sem transformers externos
config.transformer = {
  ...config.transformer,
  // Remove a linha problemática do babelTransformerPath
};

config.resolver = {
  ...config.resolver,
  // Configuração básica de resolução
  assetExts: [...config.resolver.assetExts],
  sourceExts: [...config.resolver.sourceExts],
};

// Desativa experimental features que podem causar problemas
config.transformer.minifierPath = require.resolve('metro-minify-terser');
config.transformer.optimization = {
  ...config.transformer.optimization,
  // Configurações de otimização básicas
};

module.exports = config;