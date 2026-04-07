#!/usr/bin/env bash
# Creates ml-pipelines/.venv (if needed), installs requirements + ipykernel, and
# registers a Jupyter kernel so Cursor/VS Code can run notebooks with that env
# (fixes "requires the ipykernel package" when the notebook used Homebrew Python).

set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
VENV="$ROOT/.venv"

if [[ ! -d "$VENV" ]]; then
  echo "Creating venv at $VENV"
  python3 -m venv "$VENV"
fi

"$VENV/bin/pip" install -U pip
"$VENV/bin/pip" install -r "$ROOT/requirements.txt"

# Register for Jupyter / VS Code / Cursor kernel picker
"$VENV/bin/python" -m ipykernel install --user \
  --name=keeper-ml-pipelines \
  --display-name="Python (keeper ml-pipelines .venv)" \
  --force

echo ""
echo "Done. In the notebook: click the kernel name (top-right) → choose"
echo "  Python (keeper ml-pipelines .venv)"
echo "If you still see errors, the selected kernel was NOT this one — pick it explicitly."
