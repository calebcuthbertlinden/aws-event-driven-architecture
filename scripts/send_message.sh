#!/bin/bash

# Parse named parameters
while [[ "$#" -gt 0 ]]; do
  case $1 in
    --queue-url) QUEUE_URL="$2"; shift ;;
    *) echo "Unknown parameter: $1"; exit 1 ;;
  esac
  shift
done

# Validate that queue URL was provided
if [ -z "$QUEUE_URL" ]; then
  echo "Usage: $0 --queue-url <QUEUE_URL>"
  exit 1
fi

# Send the message
aws sqs send-message \
  --queue-url "$QUEUE_URL" \
  --message-body '{"event": "TFEvent", "data": {"foo": "bar"}}'
