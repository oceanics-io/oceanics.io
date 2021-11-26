## Quick start

These are Netlify functions, which are automatically deployed to AWS alongside the web application. Not all of them are actively in use or supported. 


## Quick start

Python wraps a native Rust implementation using `pyO3` and `maturin`. This needs to be setup before attempting to run the API for required binaries to exist. You can install the Rust tools and compilers on Mac or on Linux with: 
```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```
You may need to [do a custom install of M1 macs](`https://stackoverflow.com/questions/28124221/error-linking-with-cc-failed-exit-code-1`). 

Use `poetry` to [manage Python dependencies](https://github.com/python-poetry/poetry) following the pattern enabled by [PEP 517](https://www.python.org/dev/peps/pep-0517/) and [PEP 518](https://www.python.org/dev/peps/pep-0518/). Once system dependencies are installed you will be able to enter a new shell, and install the project.

Build the library with `poetry run maturin build` (or replace `build` with `develop`). 



### Docs

Python developer documentation is generated from the code using `pdoc3`:

``` bash
pdoc --html --output-dir openapi/docs bathysphere
```



### Variables

There must also be several environment variables active for things to work. We recommend using `direnv` to manage these in `.envrc`.

The environment variables we pick up are:

- `NEO4J_ACCESS_KEY` is the password for Neo4j instance
- `POSTGRES_SECRETS` is comma separated strings `<username>,<password>,<cloudsqlInstance>`
- `OBJECT_STORAGE_SECRETS` is comma separated strings `<accessKey>,<secretKey>`
- `DARKSKY_API_KEY` is the API key for an optional weather service that will be deprecated
- `SPACES_ACCESS_KEY`: for accessing storage
- `SPACES_SECRET_KEY`: for accessing storage
- `STORAGE_ENDPOINT`: the region and host for cloud storage
- `BUCKET_NAME`: the prefix to the storage endpoint
- `SERVICE_NAME`: grouping of data in storage
- `PORT`: used locally and by Google Cloud Run

### CLI

The Python application provides configurations and management tools through `click`.

The commands are:

- `test`, run developer tests
- `start`, Start the API server in the local environment

Some of these will execute a subroutine, for example reading the contents of a remote S3 bucket. Commands with potential side effects simply print the command to the terminal. This allows you to see the generated command without running it. The evaluate it instead, wrap with `$()`.

## Deploy

Build the necessary containers with `$(bathysphere build)`.

The development environment is deployed locally with `$(bathysphere up)`.

| Service             | Port   | Description                                 |
| ------------------- | ------ | ------------------------------------------- |
| `bathysphere`       | `5000` | Graph API gateway                           |
| `neo4j`             | `7687` | Graph database `bolt` protocol access       |
| `neo4j`             | `7474` | Graph database built-in browser and console |

## Test

Deploy just the graph database backend with `docker-compose up neo4j`. This should work! Follow the local link printed to the terminal, and follow the instructions below to familiarize yourself with Neo4j.

The `bathysphere/tests` directory contains unit and integration test code. This uses `pytest` for the testing framework. Tests can be run though the command line interface, once the package has been installed locally.

We use markers, keywords, and dependencies to filter for tests. Custom markers are described in `pytest.ini`. The setup and utility functions for `pytest` are in `bathysphere/test/conftest.py`.

Run `$(bathysphere test --kw=test_graph)` to test the graph database layer. This contains the core features and authentication capabilities of the API. All of the tests should pass.

Running tests this way will produce a temporary directory `htmlcov` which contains static HTML pages with test coverage statistics.

If you get permission errors, `pytest` is probably crawling a directory in use by Neo4j. This directory should be ignored by default in the commands generated by the CLI.

## Populating database

Testing populates the connected database with the information described in `config/bathysphere.yml`. The default entities are semi-fictitious and won't suit your needs. Use them as examples to make your own.

Find an entry like this and make a copy, replacing it with your own information:

```yaml
kind: Providers
metadata:
  owner: true
spec:
  name: Oceanicsdotio
  description: Research and development
  domain: oceanics.io
```

Then delete the `owner: true` from the Oceanicsdotio entry. Delete any default Providers that you don't want populated in the graph. These each have an API registration key created, so are not granted access rights by default and are safe to keep.  