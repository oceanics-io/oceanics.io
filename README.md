# Oceanics.io

## Contents

- [Oceanics.io](#oceanicsio)
  - [Contents](#contents)
  - [About](#about)
  - [Getting started](#getting-started)
  - [Environment](#environment)
  - [Logging](#logging)

## About

This document is for developers of [https://www.oceanics.io](https://www.oceanics.io), a web application for high-performance computing and visualization. 

Software is provided by Oceanicsdotio LLC under the [MIT license](https://github.com/oceanics-io/oceanics.io/blob/main/LICENSE) as is, with no warranty or guarantee. 

## Getting started

The top-level directory also contains this `README.md` along with configuration files and scripts for linting, compiling, bundling, and deploying. The complete build and test processes are defined in `makefile`. 

The site is hosted on Netlify. The build process is setup in `netlify.toml` and `makefile`. When updates are pushed to Github, the site is rebuilt and deployed automatically. Local testing requires the Netlify CLI, which is installed from the parent module.

We use `yarn` to manage code. The environment configuration lives in `.yarnrc.yml`, and version controlled plugins in `.yarn`. Shared dependencies are defined in `package.json`.

The `app` directory contains our NextJS web page. Client interaction is through React Hooks and browser APIs.

Netlify serverless `functions` provide our backend. These are single purpose endpoints that support secure data access and processing.

You can run the Neo4j database manager in a [Neo4j container image](https://hub.docker.com/_/neo4j/), or use a managed service that supports [cypher](https://neo4j.com/docs/cypher-refcard/current/). 

Running `make test` populates the connected database with the examples described in `specification.yaml`.

## Environment

These environment variables must be present for things to work:

- `NEO4J_HOSTNAME`: the hostname for Neo4j instance
- `NEO4J_ACCESS_KEY`: the password for Neo4j instance
- `SPACES_ACCESS_KEY`: for accessing storage
- `SPACES_SECRET_KEY`: for accessing storage
- `STORAGE_ENDPOINT`: the region and host for cloud storage
- `BUCKET_NAME`: the prefix to the storage endpoint
- `SERVICE_PROVIDER_API_KEY`: Provider API key for registering accounts
- `JWT_SIGNING_KEY`: A signing ket for producing JWT in-application
- `SERVICE_ACCOUNT_USERNAME`: email for service account
- `SERVICE_ACCOUNT_PASSWORD`: password for service account
- `SERVICE_ACCOUNT_SECRET`: string for salting service key password
- `NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN`: mapbox access token for map interface

## Logging

Logging is [through Logtail for JavaScript](https://docs.logtail.com/integrations/javascript). If you want to get performance metrics from the log database, you can use a query like:
```sql
SELECT
  substring(context.runtime.file, 35) as file,
  httpmethod AS method,
  avg(cast(elapsedtime AS INT)) AS time,
  avg(cast(arraybuffers AS INT))/1000 AS arraybuffers_kb,
  avg(cast(heaptotal AS INT))/1000 AS heaptotal_kb,
  avg(cast(heapused AS INT))/1000 AS heapused_kb,
  avg(cast(external AS INT))/1000 AS external_kb,
  count(*) as requests
FROM $table
WHERE
  elapsedtime IS NOT NULL AND
  heaptotal IS NOT NULL AND
  heapused IS NOT NULL AND
  external IS NOT NULL AND
  arraybuffers IS NOT NULL
GROUP BY 
  file,
  method
```
