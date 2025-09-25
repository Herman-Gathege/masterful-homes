import seed
from core.models import User, Task

def test_seed_runs(app, db):
    with app.app_context():
        seed.seed_users()
        seed.seed_tasks(5)

        assert User.query.count() > 0
        assert Task.query.count() >= 5
