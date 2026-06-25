FROM redis:7-alpine

# Set environment variables
ENV REDIS_PASSWORD=

# Expose Redis port
EXPOSE 6379

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD redis-cli ping || exit 1

# Start Redis server
CMD ["redis-server"]