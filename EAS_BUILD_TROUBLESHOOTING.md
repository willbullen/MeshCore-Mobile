# EAS Build Troubleshooting

## Permission Error in Temp Directory

If you're getting `EPERM: operation not permitted` errors when building with EAS, try these solutions:

### Solution 1: Run as Administrator (Quick Fix)

1. Close your current terminal
2. Right-click PowerShell/Command Prompt
3. Select "Run as Administrator"
4. Navigate to your project and try the build again:
   ```powershell
   cd "C:\Users\Natasha\OneDrive - enviroscanmedia.com\Documents\GitHub\MeshCore-Mobile"
   eas build --profile development --platform ios
   ```

### Solution 2: Clear Temp Files

1. Press `Win + R`
2. Type `%TEMP%` and press Enter
3. Delete or move old files (be careful not to delete files in use)
4. Try the build again

### Solution 3: Set Custom Temp Directory

Set a custom temp directory that's not in OneDrive:

```powershell
# Set environment variable for this session
$env:TMP = "C:\Temp"
$env:TEMP = "C:\Temp"

# Create the directory if it doesn't exist
New-Item -ItemType Directory -Force -Path "C:\Temp"

# Then run your build
eas build --profile development --platform ios
```

Or set it permanently:
1. Search "Environment Variables" in Windows
2. Edit User variables
3. Change `TMP` and `TEMP` to `C:\Temp` (create this folder first)

### Solution 4: Check Antivirus

Your antivirus might be blocking temp file creation:

1. Temporarily disable real-time protection
2. Try the build
3. If it works, add an exception for:
   - `C:\Users\Natasha\AppData\Local\Temp`
   - Your project folder
   - EAS CLI executable

### Solution 5: Use Local Build (Alternative)

If cloud builds keep failing, try a local build:

```powershell
# For iOS (requires macOS)
eas build --profile development --platform ios --local

# For Android (works on Windows)
eas build --profile development --platform android --local
```

Note: iOS local builds require macOS. Android local builds work on Windows but need Android Studio.

### Solution 6: Check Disk Space

Ensure you have enough free disk space:
- EAS builds need several GB of free space
- Check with: `Get-PSDrive C`

### Solution 7: Update EAS CLI

Make sure you're using the latest version:

```powershell
npm install -g eas-cli@latest
eas --version
```

## Additional Tips

- **Close OneDrive sync** temporarily during builds (if possible)
- **Close other applications** that might lock files
- **Run builds during off-peak hours** if OneDrive sync is heavy
- **Consider moving project** outside OneDrive for better performance

## Still Having Issues?

If none of these work, try:
1. Check Windows Event Viewer for detailed error messages
2. Try building from a different location (copy project to `C:\Projects`)
3. Contact EAS support with the full error log
