#!/bin/bash

# Output file
OUTPUT_FILE="merged_output.txt"

# Start fresh
> $OUTPUT_FILE

# Find and process all files inside the api folder, excluding specified files/dirs
echo "Merging all files from the api folder into $OUTPUT_FILE..."
find ./ -type f \
    -not -path "*/\.*" \
    -not -name "package-lock.json" \
    -not -path "*/artifacts/*" \
    -not -path "*/cache/*" \
    -not -path "*/app/favicon.ico" \
    -not -path "*node_modules*" \
    -not -path "*public*" \
    -not -name "$OUTPUT_FILE" | while read -r file; do
    # Add the file name as a separator
    echo "========== $file ==========" >> $OUTPUT_FILE
    # Append the file content
    cat "$file" >> $OUTPUT_FILE
    # Add a blank line for separation
    echo -e "\n" >> $OUTPUT_FILE
done

echo "All files from the api folder have been merged into $OUTPUT_FILE!"