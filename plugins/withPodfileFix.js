const { withDangerousMod } = require('@expo/config-plugins');
const fs = require('fs');
const path = require('path');

/**
 * Config plugin to fix the Podfile use_native_modules! issue
 * 
 * The default Expo SDK 52 Podfile template passes an array (config_command)
 * to use_native_modules! which causes "no implicit conversion of String into Integer"
 * error with certain versions of @react-native-community/cli-platform-ios.
 * 
 * This plugin modifies the Podfile after prebuild to use the simpler
 * use_native_modules! call without the config_command argument.
 */
const withPodfileFix = (config) => {
  return withDangerousMod(config, [
    'ios',
    async (config) => {
      const podfilePath = path.join(config.modRequest.platformProjectRoot, 'Podfile');
      
      if (fs.existsSync(podfilePath)) {
        let podfileContent = fs.readFileSync(podfilePath, 'utf-8');
        
        // Replace the problematic config_command pattern with simple use_native_modules!
        // Pattern 1: Multi-line config_command definition followed by use_native_modules!(config_command)
        const configCommandPattern = /if ENV\['EXPO_USE_COMMUNITY_AUTOLINKING'\] == '1'[\s\S]*?end\s*\n\s*config = use_native_modules!\(config_command\)/g;
        
        if (configCommandPattern.test(podfileContent)) {
          podfileContent = podfileContent.replace(
            configCommandPattern,
            'config = use_native_modules!'
          );
          console.log('[withPodfileFix] Fixed config_command pattern in Podfile');
        }
        
        // Pattern 2: Just the use_native_modules!(config_command) line
        const simplePattern = /config = use_native_modules!\(config_command\)/g;
        if (simplePattern.test(podfileContent)) {
          podfileContent = podfileContent.replace(
            simplePattern,
            'config = use_native_modules!'
          );
          console.log('[withPodfileFix] Fixed use_native_modules!(config_command) in Podfile');
        }
        
        fs.writeFileSync(podfilePath, podfileContent);
        console.log('[withPodfileFix] Podfile has been updated');
      } else {
        console.log('[withPodfileFix] Podfile not found at:', podfilePath);
      }
      
      return config;
    },
  ]);
};

module.exports = withPodfileFix;
