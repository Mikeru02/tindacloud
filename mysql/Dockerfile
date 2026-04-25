FROM mysql:8.0

COPY schema.sql /docker-entrypoint-initdb.d/

ENV MYSQL_DATABASE=tindacloud

# (Optional) Copy a custom config file
# COPY my.cnf /etc/mysql/conf.d/

# (Optional) Any .sql files in this directory are executed on container startup
# COPY ./init.sql /docker-entrypoint-initdb.d/

# Port 3306 is exposed by the base image automatically