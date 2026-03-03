#!/bin/bash
# Usage: ./update_version.sh [new_version]
# FORMAT IS <0.0.0>
# If no version provided, reads from root package.json (for postversion hook)

VERSION="${1:-$(node -p "require('./package.json').version")}"

if [[ "$VERSION" =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
  find . -name 'package.json' -not -path '*/node_modules/*' -exec bash -c '
    current_version=$(grep -o "\"version\": \"[^\"]*" "$0" | cut -d"\"" -f4)
    perl -i -pe"s/$current_version/'"$VERSION"'/" "$0"
  '  {} \;

  echo "Updated versions to $VERSION";
else
  echo "Version format <$VERSION> isn't correct, proper format is <0.0.0>";
fi
