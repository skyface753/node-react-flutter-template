#!/usr/bin/env bash

echo --- Building my-envoy docker image ---
docker build -t my-envoy:1.0 . -f Dockerfile.macos


echo --- Running my-envoy docker image ---
docker run -p 8000:8000 my-envoy:1.0
