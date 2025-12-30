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
  ...defaultConfig,
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
    // Fix for missing-asset-registry-path on web
    resolveRequest: (context, moduleName, platform) => {
      if (moduleName === 'missing-asset-registry-path') {
        return {
          type: 'empty',
        };
      }
      // Use default resolution for everything else
      // @ts-ignore - Metro resolver type
      return defaultConfig.resolver.resolveRequest?.(context, moduleName, platform) || context.resolveRequest(context, moduleName, platform);
    },
  },
};

module.exports = config;
