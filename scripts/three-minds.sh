#!/bin/bash
# Three Minds wrapper for blog writing
# Usage: ./scripts/three-minds.sh "任务描述"

# Allow nested claude CLI calls when running inside Claude Code
unset CLAUDECODE

node /home/nanoclaw/blog/resources/three-minds/three-minds/dist/index.js \
  --config /home/nanoclaw/blog/resources/three-minds/three-minds/configs/blog-writing.json \
  --dir /home/nanoclaw/blog \
  "$@"
