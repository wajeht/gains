#!/bin/bash

source .env

# caprover deploy --default # this only works if the project wasted deployed on current path

caprover deploy -h $CAPROVER_DOMAIN -p $CAPROVER_PASSWORD -b $CAPROVER_GIT_BRANCH_NAME -a $CAPROVER_APP_NAME
