const path = require('path');
const { getDefaultConfig } = require('expo/metro-config');

/**
 * Metro configuration for Expo + pnpm
 * Fixes: "Unable to resolve module @babel/runtime/helpers/interopRequireDefault"
 * 
 * The issue: pnpm uses symlinks and virtual stores, but Metro's resolver
 * doesn't always follow them correctly. This config teaches Metro how to
 * properly resolve pnpm's symlinked dependencies.
 */
const defaultConfig = getDefaultConfig(__dirname);

const config = {
  resolver: {
    ...defaultConfig.resolver,
    // Enable symlink resolution for pnpm
    unstable_enableSymlinks: true,
    // Prefer the project's own node_modules
    extraNodeModules: new Proxy(
      {},
      {
        get: (_target, name) =>
          path.join(__dirname, 'node_modules', String(name)),
      }
    ),
  },
};

module.exports = config;
