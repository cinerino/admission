# smart-theater-tvm

# Usage

## Environment variables

| Name                                | Required | Value                         | Purpose                                 |
|-------------------------------------|----------|-------------------------------|-----------------------------------------|
| `APP_ENV`                           | true     | development, test, production | environment name                        |
| `REDIS_HOST`                        | true     |                               | redis host                              |
| `REDIS_TLS_SERVERNAME`              | true     |                               | redis tls servername                    |
| `REDIS_PORT`                        | true     |                               | redis port                              |
| `REDIS_KEY`                         | true     |                               | redis key                               |
| `STORAGE_URL`                       | true     |                               | storage url                             |
| `API_ENDPOINT`                      | true     |                               | api endpoint                            |
| `AUTHORIZATION_CODE_CLIENT_ID`      | true     |                               | client id oauth2                        |
| `AUTHORIZATION_CODE_CLIENT_SECRET`  | true     |                               | client secret oauth2                    |
| `AUTHORIZATION_CODE_DOMAIN`         | true     |                               | oauth2 server domain                    |
| `WAITER_SERVER_URL`                 | true     |                               | waiter server url                       |
| `APP_PASSWORD`                      | true     |                               | app password                            |
| `DEBUG`                             | false    |                               | debug                                   |