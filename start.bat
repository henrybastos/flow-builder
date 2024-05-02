@echo off
git pull origin main
git submodule update
pnpm install
pnpm dev