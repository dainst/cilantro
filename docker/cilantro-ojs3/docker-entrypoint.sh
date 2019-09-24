#!/bin/bash

service mysql start

/usr/sbin/sshd

apachectl -DFOREGROUND
