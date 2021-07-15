import moment from 'moment';

import { PIPELINE_STATES } from 'config/pipelines';

export const createdAtSort = (dateA, dateB) => {
  if (!dateA || !dateB || !dateA.created_at || !dateB.created_at) return -1;

  return moment(dateA.created_at) - moment(dateB.created_at);
};

export const computePipelineRunMetaData = (pipelineRun) => {
  const { states } = pipelineRun;

  const run = { ...pipelineRun };

  let status = null;
  let startedAt = null;
  let completedAt = null;
  let momentStartedAt = null;
  let momentCompletedAt = null;
  let duration = null;

  if (states && states.length) {
    states.sort(createdAtSort);

    status = states[states.length - 1].state;
    startedAt = states.find((stateItem) => stateItem.state === PIPELINE_STATES.RUNNING);
    completedAt = states.find((stateItem) => (
      stateItem.state === PIPELINE_STATES.COMPLETED
        || stateItem.state === PIPELINE_STATES.FAILED
        || stateItem.state === PIPELINE_STATES.CANCELED
    ));

    startedAt = startedAt && startedAt.created_at;
    completedAt = completedAt && completedAt.created_at;

    momentStartedAt = startedAt && moment.utc(startedAt).local();
    momentCompletedAt = completedAt && moment.utc(completedAt).local();

    if (momentStartedAt && momentCompletedAt) {
      duration = moment.duration(momentStartedAt.diff(momentCompletedAt)).humanize();
    }

    run.status = status;
    run.startedAt = momentStartedAt;
    run.completedAt = momentCompletedAt;
    run.duration = duration;
  }

  return run;
};

export default null;
