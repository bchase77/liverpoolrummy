#!/bin/bash
# One-shot sync to BGA Studio using environment variables

# Check if environment variables are set
if [ -z "$BGA_USERNAME" ]; then
    echo "❌ Error: BGA_USERNAME environment variable not set"
    echo "Please set it with: export BGA_USERNAME='your_username'"
    exit 1
fi

if [ -z "$BGA_PASSWORD" ]; then
    echo "❌ Error: BGA_PASSWORD environment variable not set"
    echo "Please set it with: export BGA_PASSWORD='your_password'"
    exit 1
fi

echo "🚀 Deploying to BGA Studio as user: $BGA_USERNAME"

# Write deploy timestamp as version string (Pacific time)
DEPLOY_VERSION=$(TZ=America/Los_Angeles date '+%Y-%m-%d %H:%M %Z')
cat > version.inc.php << EOF
<?php
\$gameVersion = "$DEPLOY_VERSION";
EOF
echo "📅 Version stamped: $DEPLOY_VERSION"

# Deploy using environment variables (quietly) - exclude git, test files, and other dev files
lftp sftp://$BGA_USERNAME:$BGA_PASSWORD@1.studio.boardgamearena.com:2022/ -e "set net:max-retries 1; mirror --reverse --parallel=10 --delete --exclude-glob='.git*' --exclude-glob='*.md' --exclude-glob='deploy.sh' --exclude-glob='commit-and-deploy.sh' --exclude-glob='node_modules' --exclude-glob='tests' --exclude-glob='package*.json' --exclude-glob='.DS_Store' --exclude-glob='TODO.txt' . liverpoolrummy/; exit" > /dev/null 2>&1

if [ $? -eq 0 ]; then
    echo "✅ Deployment to BGA Studio completed successfully!"
else
    echo "❌ Deployment failed!"
    exit 1
fi
