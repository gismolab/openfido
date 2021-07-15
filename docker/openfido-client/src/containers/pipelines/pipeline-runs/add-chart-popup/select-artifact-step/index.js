import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { ALLOWABLE_ARTIFACT_FORMATS } from 'config/charts';
import { PopupButton } from 'styles/pipeline-runs';
import { StyledButton, StyledH4 } from 'styles/app';
import colors from 'styles/colors';

const ArtifactsList = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: 12px 0;
  margin: 0.75rem 0;
  overflow-y: overlay;
  max-height: max(242px, calc(50vh - 60px));
  li {
    background-color: ${colors.white};
    &:not(:last-child) {
      border-bottom: 1px solid ${colors.lightGray};
    }
    button.ant-btn {
      display: block;
      padding: 16px 22px;
      padding: 1rem 1.375rem;
      font-weight: 400;
      width: 100%;
      text-align: left;
      border-radius: 0;
      transition: none;
      &:active, &:focus, &.selected {
        border-left: 5px solid ${colors.blue};
        background-color: ${colors.lightActiveHover};
        padding-left: 17px;
        padding-left: 1.0625rem;
      }
    }
  }
`;

const NoArtifacts = styled.div`
  height: 242px;
  margin-top: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const SelectArtifactStep = ({
  artifacts, selectedArtifact, setSelectedArtifact, onNextClicked,
}) => {
  const onArtifactSelected = (e) => {
    e.preventDefault();
    onNextClicked();
  };

  const usableArtifacts = artifacts && artifacts.filter((artifact) => (
    artifact.name.match(ALLOWABLE_ARTIFACT_FORMATS)
  ));

  return (
    <form>
      <div>
        <StyledH4 color="darkText">Select an artifact</StyledH4>
        {usableArtifacts && !usableArtifacts.length && (
          <NoArtifacts>
            No usable artifacts found.
          </NoArtifacts>
        )}
        <ArtifactsList>
          {usableArtifacts && usableArtifacts.map((artifact) => (
            <li key={artifact.uuid}>
              <StyledButton
                type="text"
                size="large"
                textcolor="lightBlue"
                className={selectedArtifact === artifact ? 'selected' : ''}
                onClick={() => setSelectedArtifact(artifact)}
              >
                {artifact.name}
              </StyledButton>
            </li>
          ))}
        </ArtifactsList>
      </div>
      {usableArtifacts && !!usableArtifacts.length && (
        <PopupButton size="middle" color="blue" width={108} onClick={onArtifactSelected}>
          Next
        </PopupButton>
      )}
    </form>
  );
};

SelectArtifactStep.propTypes = {
  artifacts: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    uuid: PropTypes.string.isRequired,
  })).isRequired,
  selectedArtifact: PropTypes.shape({
    name: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    uuid: PropTypes.string.isRequired,
  }),
  setSelectedArtifact: PropTypes.func.isRequired,
  onNextClicked: PropTypes.func.isRequired,
};

SelectArtifactStep.defaultProps = {
  selectedArtifact: null,
};

export default SelectArtifactStep;
