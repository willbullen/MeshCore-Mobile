const { withDangerousMod } = require("expo/config-plugins");
const fs = require("fs");
const path = require("path");

/**
 * Config plugin to fix Folly coroutine header issue with Xcode 26
 * This adds a post_install hook to disable coroutines in Folly
 */
function withFollyFix(config) {
  return withDangerousMod(config, [
    "ios",
    async (config) => {
      const podfilePath = path.join(config.modRequest.platformProjectRoot, "Podfile");
      
      if (fs.existsSync(podfilePath)) {
        let podfileContent = fs.readFileSync(podfilePath, "utf8");
        
        // Check if the fix is already applied
        if (!podfileContent.includes("FOLLY_NO_COROUTINES")) {
          // Add the post_install hook to disable Folly coroutines
          const postInstallFix = `
  # Fix for Folly coroutine header issue with Xcode 26
  post_install do |installer|
    installer.pods_project.targets.each do |target|
      target.build_configurations.each do |config|
        # Disable Folly coroutines to fix 'folly/coro/Coroutine.h' not found error
        config.build_settings['GCC_PREPROCESSOR_DEFINITIONS'] ||= ['$(inherited)']
        config.build_settings['GCC_PREPROCESSOR_DEFINITIONS'] << 'FOLLY_NO_COROUTINES=1'
        config.build_settings['GCC_PREPROCESSOR_DEFINITIONS'] << 'FOLLY_CFG_NO_COROUTINES=1'
      end
    end
    
    # Call the original post_install if it exists
    react_native_post_install(installer)
  end
`;
          
          // Find the existing post_install block and modify it, or add new one
          if (podfileContent.includes("post_install do |installer|")) {
            // Modify existing post_install to add the fix
            podfileContent = podfileContent.replace(
              /post_install do \|installer\|/,
              `post_install do |installer|
    # Fix for Folly coroutine header issue with Xcode 26
    installer.pods_project.targets.each do |target|
      target.build_configurations.each do |config|
        config.build_settings['GCC_PREPROCESSOR_DEFINITIONS'] ||= ['$(inherited)']
        config.build_settings['GCC_PREPROCESSOR_DEFINITIONS'] << 'FOLLY_NO_COROUTINES=1'
        config.build_settings['GCC_PREPROCESSOR_DEFINITIONS'] << 'FOLLY_CFG_NO_COROUTINES=1'
      end
    end
`
            );
          }
          
          fs.writeFileSync(podfilePath, podfileContent);
        }
      }
      
      return config;
    },
  ]);
}

module.exports = withFollyFix;
