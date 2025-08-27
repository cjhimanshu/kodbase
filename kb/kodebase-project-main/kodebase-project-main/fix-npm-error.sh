#!/bin/bash

# Fix permissions on the npm directory
chmod -R 755 node_modules
chmod -R 755 ~/.npm

# Make sure npm is executable
chmod +x $(which npm)

# Try running your commands with explicit node path
node $(which npm) install --legacy-peer-deps
node $(which npm) run build

echo "Permissions fixed and npm commands executed"
