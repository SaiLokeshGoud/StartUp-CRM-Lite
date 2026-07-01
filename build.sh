#!/usr/bin/env bash
set -euo pipefail
cd frontend
npm install --include=dev
npm run build
