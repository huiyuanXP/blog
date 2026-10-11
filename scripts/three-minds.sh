#!/usr/bin/env bash
set -euo pipefail

project_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
runtime_root="${THREE_MINDS_ROOT:-$project_root/resources/three-minds/three-minds}"
entry="$runtime_root/dist/index.js"
config="$runtime_root/configs/blog-writing.json"
if [[ ! -f "$entry" || ! -f "$config" ]]; then
  printf '%s\n' 'Three Minds CLI: set THREE_MINDS_ROOT to a runtime containing dist/index.js and configs/blog-writing.json.' 'The sequential native-agent workflow is documented in TOOLS.md.' >&2
  exit 1
fi
[[ "${1:-}" == '--' ]] && shift
unset CLAUDECODE
exec node "$entry" --config "$config" --dir "$project_root" "$@"
