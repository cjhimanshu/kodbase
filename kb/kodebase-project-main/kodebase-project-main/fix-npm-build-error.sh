#!/bin/bash

# Check if npm is executable
echo "Checking npm permissions..."
ls -la $(which npm)

# Fix npm executable permission
echo "Setting executable permission for npm..."
chmod +x $(which npm)

# Check if build script in package.json is executable
echo "Checking node_modules bin permissions..."
chmod -R +x ./node_modules/.bin

# Try running build with the node executable directly
echo "Running build with node directly..."
node ./node_modules/.bin/react-scripts build

echo "Build process completed"
