# Troubleshooting npm Error 126

Exit code 126 typically indicates permission issues or that the script is not executable. Here are steps to resolve this:

## Solutions to try:

1. **Fix permissions**:
   ```bash
   chmod -R 755 node_modules
   chmod -R 755 ~/.npm
   ```

2. **Use explicit node path**:
   ```bash
   node $(which npm) install --legacy-peer-deps
   node $(which npm) run build
   ```

3. **Check npm executable**:
   ```bash
   which npm
   chmod +x $(which npm)
   ```

4. **Try running with sudo** (if on Linux/Mac):
   ```bash
   sudo npm install --legacy-peer-deps && sudo npm run build
   ```

5. **Check for disk space issues**:
   ```bash
   df -h
   ```

6. **Clear npm cache**:
   ```bash
   npm cache clean --force
   ```

7. **Ensure you're in the correct directory** with the package.json file.

8. **Verify node and npm versions**:
   ```bash
   node -v
   npm -v
   ```

If the issue persists, check your system's permissions and consider reinstalling Node.js.
