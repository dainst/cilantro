#!/bin/bash

if [ -z "$BACKEND_URI" ]; then
    echo "BACKEND_URI not set!"
    exit 1
fi
if [ -z "OJS_URI" ]; then
    echo "OJS_URI not set!"
    exit 1
fi
if [ -z "ZENON_URI" ]; then
    echo "ZENON_URI not set!"
    exit 1
fi

touch settings.json
read -d '' CONFIG <<- EOF
{
  "files_url":    "##BACKEND_URI##/staging/",
  "server_url":   "##BACKEND_URI##/",
  "ojs_url":      "##OJS_URI##/",
  "zenon_url":    "##ZENON_URI##/",
  "server_user":  "test_user",
  "server_pass":  "test_password"
}
EOF
echo "$CONFIG" >> settings.json
sed -i -e "s@##BACKEND_URI##@${BACKEND_URI}@g" settings.json
sed -i -e "s@##ZENON_URI##@${ZENON_URI}@g" settings.json
sed -i -e "s@##OJS_URI##@${OJS_URI}@g" settings.json