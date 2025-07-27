#!/bin/bash

echo "🤖 Maya AI DevOps (Full Mode): Scanning, Healing & Generating..."
echo "────────────────────────────────────────────────────────────"

# Step 1: Check for Node.js
echo "🔍 Checking Node & npm:"
NODE_VERSION=$(which node)
if [ -x "$NODE_VERSION" ]; then
  echo "✅ Node found at: $NODE_VERSION"
  echo "🔢 Node Version: $(node -v)"
  echo "🔢 NPM Version: $(npm -v)"
else
  echo "❌ Node.js not found. Please install Node.js and npm first."
  exit 1
fi

# Step 2: Dependency Installation
echo "📦 Installing npm packages (with legacy support if needed)..."
npm install --legacy-peer-deps || {
  echo "⚠️ npm install failed. Attempting normal install..."
  npm install
}

# Step 3: Run ESLint fix if available
if [ -f ".eslintrc.js" ] || [ -f ".eslintrc.json" ]; then
  echo "🧹 Running ESLint auto-fix..."
  npx eslint . --fix || echo "⚠️ ESLint issues found."
else
  echo "ℹ️ No ESLint config found, skipping linting."
fi

# Step 4: TypeScript Check
if [ -f "tsconfig.json" ]; then
  echo "🧠 Running TypeScript type check..."
  npx tsc --noEmit || echo "⚠️ TypeScript errors detected."
else
  echo "ℹ️ No TypeScript config found, skipping TS check."
fi

# Step 5: Auto-detection of package anomalies
echo "🔎 Checking for broken/missing packages..."
npx check-dependencies || echo "⚠️ Some dependencies may be misaligned."

# Step 6: Git diff and AI code suggestions placeholder
echo "💡 Maya GPT Code Suggestion module (next-gen AI) coming soon..."

echo "✅ Maya DevOps Scan Complete — All systems checked."
