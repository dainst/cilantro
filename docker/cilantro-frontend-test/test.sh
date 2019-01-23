#!/bin/bash
cd /frontend

if [ "$TEST" = "skip" ]; then
    echo "Frontend tests skipped"
    exit 0
fi

cd /
chmod a+x create_settings_from_env.sh
./create_settings_from_env.sh
cd /frontend

if [ "$TEST" = "default" ]; then
    echo "Running Frontend tests against current docker-compose configuation:"
    cat /config/settings.json
    npm run server-nosync &
    xvfb-run -a -e /dev/stdout -s "-screen 0 2920x2580x24" npm run e2e-test
fi
test_res=$?
echo "TEST Finished. Look for results at http://localhost:7777/test/e2e/screenshots/my-report.html"

exit ${test_res}
