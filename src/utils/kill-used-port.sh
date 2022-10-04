#!/bin/sh

export $(xargs < .env)

sudo kill -9 $(lsof -t -i:$PORT)
