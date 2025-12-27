const { withDangerousMod, withPlugins } = require("expo/config-plugins");
const fs = require("fs");
const path = require("path");

/**
 * Config plugin to fix Folly coroutine header issue with Xcode 26
 * This modifies the Podfile to add a post_install hook that patches Folly
 */
function withFollyFix(config) {
  return withDangerousMod(config, [
    "ios",
    async (config) => {
      const podfilePath = path.join(config.modRequest.platformProjectRoot, "Podfile");
      
      if (fs.existsSync(podfilePath)) {
        let podfileContent = fs.readFileSync(podfilePath, "utf8");
        
        // Check if the fix is already applied
        if (!podfileContent.includes("# Folly coroutine fix")) {
          // Find the post_install block and add our fix at the beginning
          const postInstallRegex = /(post_install do \|installer\|)/;
          
          if (postInstallRegex.test(podfileContent)) {
            const follyFix = `$1
    # Folly coroutine fix for Xcode 26
    # Patch Expected.h to not include coroutine headers
    installer.pods_project.targets.each do |target|
      target.build_configurations.each do |config|
        # Add preprocessor definitions to disable coroutines
        existing_defs = config.build_settings['GCC_PREPROCESSOR_DEFINITIONS'] || ['$(inherited)']
        existing_defs = [existing_defs] if existing_defs.is_a?(String)
        existing_defs << 'FOLLY_CFG_NO_COROUTINES=1' unless existing_defs.include?('FOLLY_CFG_NO_COROUTINES=1')
        config.build_settings['GCC_PREPROCESSOR_DEFINITIONS'] = existing_defs
      end
    end
`;
            podfileContent = podfileContent.replace(postInstallRegex, follyFix);
            fs.writeFileSync(podfilePath, podfileContent);
          }
        }
      }
      
      return config;
    },
  ]);
}

module.exports = withFollyFix;
