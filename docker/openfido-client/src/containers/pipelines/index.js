import React, { useEffect, useState } from 'react';
import { generatePath } from 'react-router';
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import { Space, Spin } from 'antd';

import { ROUTE_PIPELINE_RUNS } from 'config/routes';
import { getPipelines } from 'actions/pipelines';
import LoadingFilled from 'icons/LoadingFilled';
import { StyledTitle, StyledButton } from 'styles/app';
import PipelineItem from './pipeline-item';
import CreatePipelinePopup from './get-started-popup';
import AddPipeline from './add-pipeline';
import EditPipeline from './edit-pipeline';

const PipelineItems = styled(Space)`
  padding: 28px 20px 28px 16px;
  padding: 1.75rem 1.25rem 1.75rem 1rem;
  text-align: center;
  .ant-spin .anticon {
    position: static;
    margin: 5rem auto;
  }
`;

const Pipelines = () => {
  const history = useHistory();

  const currentOrg = useSelector((state) => state.user.currentOrg);
  const pipelines = useSelector((state) => state.pipelines.pipelines);
  const getPipelinesInProgress = useSelector((state) => state.pipelines.messages.getPipelinesInProgress);
  const dispatch = useDispatch();

  const [showGetStartedPopup, setShowGetStartedPopup] = useState(false);
  const [showAddPipelines, setShowAddPipelines] = useState(false);
  const [pipelineInEdit, setPipelineInEdit] = useState(null);

  const pipelineItemInEdit = pipelines && pipelines.find((pipelineItem) => pipelineItem.uuid === pipelineInEdit);

  useEffect(() => {
    dispatch(getPipelines(currentOrg));
    setShowGetStartedPopup(false);
  }, [currentOrg, dispatch]);

  useEffect(() => {
    if (pipelines && !pipelines.length) {
      setShowGetStartedPopup(true);
    }
  }, [pipelines]);

  const openAddPipelines = () => {
    setShowGetStartedPopup(false);
    setShowAddPipelines(true);
  };

  const handleAddPipelineSuccess = () => {
    dispatch(getPipelines(currentOrg))
      .then(() => setShowAddPipelines(false));
  };

  const handleAddPipelineCancel = () => {
    setShowAddPipelines(false);

    if (pipelines && !pipelines.length) {
      setShowGetStartedPopup(true);
    }
  };

  const openPipelineEdit = (pipeline_uuid) => {
    setPipelineInEdit(pipeline_uuid);
  };

  const handleEditPipelineSuccess = () => {
    dispatch(getPipelines(currentOrg))
      .then(() => setPipelineInEdit(null));
  };

  const handleEditPipelineCancel = () => {
    setPipelineInEdit(null);
  };

  const viewPipelineRuns = (pipeline_uuid) => {
    history.push(generatePath(ROUTE_PIPELINE_RUNS, { pipeline_uuid }));
  };

  return (
    <>
      <StyledTitle aria-label="Pipelines page title">
        <div>
          <h1>
            Pipelines
            {(showGetStartedPopup || (!showAddPipelines && !pipelineInEdit)) && (
            <StyledButton
              aria-label="Add Pipeline button"
              size="small"
              onClick={openAddPipelines}
            >
              + Add Pipeline
            </StyledButton>
            )}
          </h1>
        </div>
      </StyledTitle>
      {showGetStartedPopup && (
        <CreatePipelinePopup handleOk={openAddPipelines} />
      )}
      {showAddPipelines && (
      <AddPipeline
        handleSuccess={handleAddPipelineSuccess}
        handleCancel={handleAddPipelineCancel}
      />
      )}
      {!showAddPipelines && pipelineInEdit && (
        <EditPipeline
          handleSuccess={handleEditPipelineSuccess}
          handleCancel={handleEditPipelineCancel}
          pipelineItem={pipelineItemInEdit}
        />
      )}
      <PipelineItems direction="vertical" size={26}>
        {getPipelinesInProgress && (
          <Spin indicator={<LoadingFilled spin />} />
        )}
        {!getPipelinesInProgress && !showAddPipelines && !pipelineInEdit && pipelines && pipelines.map(({
          uuid, name, last_pipeline_run,
        }) => (
          <PipelineItem
            key={uuid}
            uuid={uuid}
            name={name}
            last_pipeline_run={last_pipeline_run}
            openPipelineEdit={openPipelineEdit}
            viewPipelineRuns={viewPipelineRuns}
          />
        ))}
      </PipelineItems>
    </>
  );
};

export default Pipelines;
