#!/bin/bash
cd /salvia

if [ "$TEST" = "skip" ]; then
    echo "Frontend tests skipped"
    exit 0
fi

cd /salvia/config
chmod a+x create_settings_from_env.sh
./create_settings_from_env.sh
cd /salvia

# the selenium tries to find the driver in a path from the other container...
mkdir /usr/share/nginx
mkdir /usr/share/nginx/html
mkdir /usr/share/nginx/html/node_modules
mkdir /usr/share/nginx/html/node_modules/webdriver-manager
ln -s /salvia/node_modules/webdriver-manager/selenium /usr/share/nginx/html/node_modules/webdriver-manager/selenium

if [ "$TEST" = "mock" ]; then
    echo "Running Frontend tests against mock-backend"
    npm run e2e-mock-backend & npm run e2e-server & xvfb-run -a -e /dev/stdout -s "-screen 0 2920x2580x24" npm run e2e-test
fi

if [ "$TEST" = "default" ]; then
    echo "Running Frontend tests against current docker-compose configuation:"
    cat /salvia/config/settings.json
    npm run server-nosync & xvfb-run -a -e /dev/stdout -s "-screen 0 2920x2580x24" npm run e2e-test
fi

echo "TEST Finished. Look for results at http://localhost:7777/test/e2e/screenshots/my-report.html"