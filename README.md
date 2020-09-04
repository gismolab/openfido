# Workflow Service

Summary: A [Flask](https://flask.palletsprojects.com/en/1.1.x/) API server that
offers an ability to execute GridLabD jobs and store the resulting artifacts on
a file server.

## Vocabulary

 * Pipeline = a GridLabD job.
 * Application = an HTTP client that is authorized to access a REST endpoint.
 * Application System Permission = an assignment of an Application to a specific System Permission.
 * System Permission = a specific operation that an application is allowed to perform.

## Architectural Decision Records

 * [1. Record architecture decisions](docs/adr/0001-record-architecture-decisions.md)
 * [2. Pipelines](docs/adr/0002-pipelines.md)
 * [3. Authentication](docs/adr/0003-authentication.md)

## Development

The local development environment has been set up with docker compose. Once you
have [docker](https://docs.docker.com/get-docker/) and [docker-compose](https://docs.docker.com/compose/install/) execute the following commands to setup your local development environment:

    # Login to an docker instance of the flask app:
    docker-compose run --rm api bash

    # Run database migrations
    flask db upgrade

    # exit the docker instance
    exit

To start the server locally:

    # start both the postgres database, and the flask app:
    docker-compose up

    # visit the app:
    http://localhost:5000/

To run tests, use [invoke](https://pyinvoke.org):

    # Run within the preconfigured docker instance:
    docker-compose run --rm api invoke test

    # with code coverage
    docker-compose run --rm api invoke --cov-report test

    # Or if you'd rather run locally
    pipenv install
    pipenv run invoke test

Other tasks are available, in particular the `precommit` task, which mirrors the
tests performed by CircleCI.

Endpoints have been documented with [swagger](https://swagger.io/blog/news/whats-new-in-openapi-3-0/), which is configured to be easily explored in the default `run.py` configuration. When the flask server is running visit http://localhost:5000/apidocs to see documentation and interact with the API directly.

## Authentication Roles

This package includes a subset of libraries for role-based application
authentication. To use it, simply include this library in your project's
dependencies:

Configure your application to use your application's specific roles:

    from enum import IntEnum, unique

    @unique
    class ExamplePermissions(IntEnum):
        """ Permissions used for Flask endpoints """

        ROLE_1 = 1
        ROLE_2 = 2

Make sure that your application's [Flask Migrate](https://flask-migrate.readthedocs.io/en/latest/) configuration includes the tables used to manage these roles.

    # file that sets up 'db':
    from roles.models import db as roles_db

    # import your own models
    from .models import db

Finally, make a decorator to enforce these permissions in your views:

    from roles.decorators import make_permission_decorator

    permissions_required = make_permission_decorator(ExamplePermissions)

    @permissions_required([ExamplePermissions.ROLE_1])
    @route("/protected_route")
    def protected_route():
        return 'private info'


HTTP clients must then pass a `Workflow-API-Key` header with their api_key. Keys can
be created using the sample code in tasks.py:

    # Create a new Application database record with PIPELINES_CLIENT role.
    invoke create-application-key -n "new app" -p PIPELINES_CLIENT


## Configuration

Several environmental variables allow this server to be configured.

 * **SECRET_KEY** = See [Flask documentation](https://flask.palletsprojects.com/en/1.1.x/config/#SECRET_KEY).
 * **SQLALCHEMY_DATABASE_URI** = Database connection string.
 * **CELERY_RESULT_BACKEND** = Location of a [result backend](https://docs.celeryproject.org/en/stable/userguide/configuration.html#result-backend).
 * **CELERY_BROKER_URL** = Location of the [celery broker](https://docs.celeryproject.org/en/stable/userguide/configuration.html#broker-settings).
 * **CELERY_ALWAYS_EAGER** = When True, [execute celery jobs locally](https://docs.celeryproject.org/en/stable/userguide/configuration.html#std:setting-task_always_eager). Useful for development/testing purposes.
 * **BLOB_API_SERVER** = When provided the 'upload artifact' endpoint will store
     artifacts via this server. Otherwise files are stored locally (only useful
     for local development and testing).
 * **BLOB_API_TOKEN** = api_token required for calls to `BLOB_API_SERVER`.
 * **MAX_CONTENT_LENGTH** = Configures [maximum upload file byte size](https://flask.palletsprojects.com/en/1.1.x/config/#MAX_CONTENT_LENGTH).

## Deployment

**TODO**

## Provisioning

**TODO**
