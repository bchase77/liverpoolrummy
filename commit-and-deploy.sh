#!/bin/bash
# Combined git commit and BGA deploy - ultra quiet version

[ -z "$BGA_USERNAME" ] || [ -z "$BGA_PASSWORD" ] && echo "❌ Credentials missing" && exit 1
[ -z "$1" ] && echo "❌ Message required" && exit 1

git add -A >/dev/null 2>&1
git commit -q -m "$1" >/dev/null 2>&1
git push origin main >/dev/null 2>&1
lftp sftp://$BGA_USERNAME:$BGA_PASSWORD@1.studio.boardgamearena.com:2022/ -e "set net:max-retries 1; mirror --reverse --parallel=10 --delete --exclude-glob='.git*' --exclude-glob='*.md' --exclude-glob='deploy.sh' --exclude-glob='commit-and-deploy.sh' --exclude-glob='node_modules' --exclude-glob='.DS_Store' --exclude-glob='.github*' --exclude-glob='.cline*' --exclude-glob='.claude*' --exclude-glob='TODO.txt' /Users/bmc/Documents/bga/liverpoolrummy/ liverpoolrummy/; exit" >/dev/null 2>&1

echo "✅"
