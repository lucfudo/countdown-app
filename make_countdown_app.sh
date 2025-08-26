#!/usr/bin/env bash
# make_countdown_app.sh — crée uniquement l'arborescence

APP_DIR="."

# --- Dossiers ---
mkdir -p "$APP_DIR"/src/{components,screens,storage,utils}

# --- Fichiers à la racine ---
touch "$APP_DIR"/{app.json,package.json,tsconfig.json,babel.config.js,App.tsx}

# --- Fichiers src/ ---
touch "$APP_DIR"/src/{theme.ts,types.ts,notifications.ts}

# --- Fichiers sous-dossiers ---
touch "$APP_DIR"/src/storage/db.ts
touch "$APP_DIR"/src/utils/date.ts
touch "$APP_DIR"/src/components/{EventCard.tsx,FabMenu.tsx}
touch "$APP_DIR"/src/screens/{HomeScreen.tsx,EditScreen.tsx}

echo "✅ Arborescence créée dans: $APP_DIR"
