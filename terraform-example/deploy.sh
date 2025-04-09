#!/bin/bash

set -e

LAMBDA_DIR="./lambda"
ZIP_FILE="lambda.zip"

echo "📦 Zipping Lambda function..."
if [ -f "$ZIP_FILE" ]; then
  rm "$ZIP_FILE"
fi
zip -j "$ZIP_FILE" "$LAMBDA_DIR"/index.js

echo "🔍 Planning changes..."
terraform plan -out=tfplan

echo "✅ Applying changes..."
terraform apply tfplan

echo "🎉 Deployment complete!"