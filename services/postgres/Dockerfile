FROM postgres:16-alpine

# Set environment variables
ENV POSTGRES_USER=tindacloud_user
ENV POSTGRES_PASSWORD=postgres
ENV POSTGRES_DB=tindacloud

# Copy initialization scripts
COPY init.sql /docker-entrypoint-initdb.d/01-init.sql
COPY seeds.sql /docker-entrypoint-initdb.d/02-seeds.sql

# Expose PostgreSQL port
EXPOSE 5432

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD pg_isready -U postgres || exit 1

# Start PostgreSQL
CMD ["postgres"]