FROM gitpod/workspace-full:latest

# Install postgres
USER root
RUN apt-get update && apt-get install -y \
        mongodb \
    && apt-get clean && rm -rf /var/cache/apt/* && rm -rf /var/lib/apt/lists/* && rm -rf /tmp/*

# Setup postgres server for user gitpod
USER gitpod

# Project specifics
# Set some environment variables
ENV DATABASE_URL=mongodb://127.0.0.1:27017
ENV ROCKET_ADDRESS=0.0.0.0
ENV ROCKET_PORT=27017

# Give back control
USER root
