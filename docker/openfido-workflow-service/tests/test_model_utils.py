import pytest

from app.model_utils import RunStateEnum


def test_run_state_is_valid_transition(app):
    assert not RunStateEnum.QUEUED.is_valid_transition(RunStateEnum.QUEUED)
    assert RunStateEnum.QUEUED.is_valid_transition(RunStateEnum.NOT_STARTED)
    assert not RunStateEnum.QUEUED.is_valid_transition(RunStateEnum.RUNNING)
    assert not RunStateEnum.QUEUED.is_valid_transition(RunStateEnum.FAILED)
    assert not RunStateEnum.QUEUED.is_valid_transition(RunStateEnum.COMPLETED)
    assert RunStateEnum.QUEUED.is_valid_transition(RunStateEnum.CANCELLED)

    assert not RunStateEnum.NOT_STARTED.is_valid_transition(RunStateEnum.NOT_STARTED)
    assert RunStateEnum.NOT_STARTED.is_valid_transition(RunStateEnum.RUNNING)
    assert not RunStateEnum.NOT_STARTED.is_valid_transition(RunStateEnum.QUEUED)
    assert not RunStateEnum.NOT_STARTED.is_valid_transition(RunStateEnum.COMPLETED)
    assert not RunStateEnum.NOT_STARTED.is_valid_transition(RunStateEnum.FAILED)
    assert RunStateEnum.NOT_STARTED.is_valid_transition(RunStateEnum.CANCELLED)

    assert not RunStateEnum.RUNNING.is_valid_transition(RunStateEnum.RUNNING)
    assert not RunStateEnum.RUNNING.is_valid_transition(RunStateEnum.NOT_STARTED)
    assert RunStateEnum.RUNNING.is_valid_transition(RunStateEnum.FAILED)
    assert RunStateEnum.RUNNING.is_valid_transition(RunStateEnum.COMPLETED)
    assert not RunStateEnum.RUNNING.is_valid_transition(RunStateEnum.QUEUED)
    assert RunStateEnum.RUNNING.is_valid_transition(RunStateEnum.CANCELLED)

    assert not RunStateEnum.FAILED.is_valid_transition(RunStateEnum.NOT_STARTED)
    assert not RunStateEnum.FAILED.is_valid_transition(RunStateEnum.RUNNING)
    assert not RunStateEnum.FAILED.is_valid_transition(RunStateEnum.FAILED)
    assert not RunStateEnum.FAILED.is_valid_transition(RunStateEnum.COMPLETED)
    assert not RunStateEnum.FAILED.is_valid_transition(RunStateEnum.QUEUED)
    assert not RunStateEnum.FAILED.is_valid_transition(RunStateEnum.CANCELLED)

    assert not RunStateEnum.COMPLETED.is_valid_transition(RunStateEnum.NOT_STARTED)
    assert not RunStateEnum.COMPLETED.is_valid_transition(RunStateEnum.RUNNING)
    assert not RunStateEnum.COMPLETED.is_valid_transition(RunStateEnum.FAILED)
    assert not RunStateEnum.COMPLETED.is_valid_transition(RunStateEnum.COMPLETED)
    assert not RunStateEnum.COMPLETED.is_valid_transition(RunStateEnum.QUEUED)
    assert not RunStateEnum.COMPLETED.is_valid_transition(RunStateEnum.CANCELLED)

    assert not RunStateEnum.CANCELLED.is_valid_transition(RunStateEnum.NOT_STARTED)
    assert not RunStateEnum.CANCELLED.is_valid_transition(RunStateEnum.RUNNING)
    assert not RunStateEnum.CANCELLED.is_valid_transition(RunStateEnum.QUEUED)
    assert not RunStateEnum.CANCELLED.is_valid_transition(RunStateEnum.FAILED)
    assert not RunStateEnum.CANCELLED.is_valid_transition(RunStateEnum.COMPLETED)
    assert not RunStateEnum.CANCELLED.is_valid_transition(RunStateEnum.CANCELLED)


def test_run_state_in_final_state(app):
    assert not RunStateEnum.QUEUED.in_final_state()
    assert not RunStateEnum.NOT_STARTED.in_final_state()
    assert not RunStateEnum.RUNNING.in_final_state()
    assert RunStateEnum.FAILED.in_final_state()
    assert RunStateEnum.COMPLETED.in_final_state()
    assert RunStateEnum.CANCELLED.in_final_state()
