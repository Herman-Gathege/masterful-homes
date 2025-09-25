import pytest
from sqlalchemy import text

@pytest.mark.usefixtures("db")
def test_indexes_exist(db):
    """Ensure critical composite indexes exist in Postgres DB."""

    dialect = db.session.bind.dialect.name
    if dialect != "postgresql":
        pytest.skip("Skipping index check: not running on Postgres")

    # Query pg_indexes for tasks
    tasks_idx = db.session.execute(
        text("SELECT indexname FROM pg_indexes WHERE tablename='tasks'")
    ).fetchall()
    task_index_names = {row[0] for row in tasks_idx}
    assert "idx_task_tenant_status" in task_index_names, \
        "Missing idx_task_tenant_status on tasks"

    # Query pg_indexes for time_entries
    te_idx = db.session.execute(
        text("SELECT indexname FROM pg_indexes WHERE tablename='time_entries'")
    ).fetchall()
    te_index_names = {row[0] for row in te_idx}
    assert "idx_timeentry_tenant_user" in te_index_names, \
        "Missing idx_timeentry_tenant_user on time_entries"
