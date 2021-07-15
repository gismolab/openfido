from invoke import task


@task
def test(c, cov=False, cov_report=False, junit=False, enforce_percent=0):
    """ Run unit tests. """
    command = "pytest --disable-warnings"
    if cov_report:
        command += " --cov-report=html"
    if junit:
        command += " --junitxml=test-results/results.xml"
    if enforce_percent > 0:
        command += f" --cov-fail-under={enforce_percent}"
    if cov or cov_report or junit or enforce_percent:
        command += " --cov application_roles --cov blob_utils"
    else:
        command += " application_roles blob_utils tests"

    c.run(command)


@task
def style(c, fix=False):
    """ Run black checks against the codebase. """
    command = "black"
    if not fix:
        command += " --check"

    c.run(f"{command} application_roles blob_utils tests")


@task
def lint(c, fail_under=0):
    """ Run pylint checks against the codebase """
    command = "pylint --rcfile=.pylintrc"
    if fail_under > 0:
        command += f" --fail-under={fail_under}"

    c.run(f"{command} application_roles blob_utils")


@task
def precommit(c):
    test(c, junit=True, enforce_percent=51)
    style(c)
    lint(c, fail_under=8)


@task
def create_application_key(c, name, permission):
    """ SAMPLE Create an application api_key.

    name = name of the application
    permission = permission to support.
    """
    from YOURAPP import create_app
    from application_roles.services import create_application
    from YOURAPP import SystemPermissionEnum

    (app, db, _, _) = create_app()
    with app.app_context():
        application = create_application(name, SystemPermissionEnum[permission])
        db.session.commit()
        print(f"API_TOKEN={application.api_key}")
