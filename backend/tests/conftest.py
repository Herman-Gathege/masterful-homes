import pytest
from sqlalchemy.orm import sessionmaker, scoped_session
from main import create_app
from extensions import db as _db


@pytest.fixture(scope="session")
def app():
    app = create_app({
        "TESTING": True,
        "SQLALCHEMY_DATABASE_URI": "sqlite:///:memory:",
        "SQLALCHEMY_TRACK_MODIFICATIONS": False,
    })
    with app.app_context():
        yield app


@pytest.fixture(scope="session")
def db(app):
    _db.app = app
    _db.create_all()
    yield _db
    _db.drop_all()


@pytest.fixture(scope="function", autouse=True)
def session(db):
    """Roll back DB after each test for isolation."""
    connection = db.engine.connect()
    transaction = connection.begin()

    # ✅ scoped_session to mimic Flask-SQLAlchemy behavior
    Session = scoped_session(sessionmaker(bind=connection))
    db.session = Session

    yield db.session

    transaction.rollback()
    connection.close()
    Session.remove()  # ✅ now this works
