import ApiClient from 'util/api-client';
import config from 'config';
import mime from 'mime';

const { baseUrl, appToken } = config.api;

export const requestCreateUser = (email, first_name, last_name, password, invitation_token) => (
  ApiClient.post(`${baseUrl.auth}/users`, {
    email,
    first_name,
    last_name,
    password,
    invitation_token,
  })
);

export const requestLoginUser = (email, password) => ApiClient.post(`${baseUrl.auth}/users/auth`, {
  email,
  password,
});

export const requestRefreshJWT = () => ApiClient.post(`${baseUrl.auth}/users/auth/refresh`, {});

export const requestPasswordReset = (email) => ApiClient.post(`${baseUrl.auth}/users/request_password_reset`, {
  email,
});

export const requestUpdatePassword = (reset_token, password) => (
  ApiClient.put(`${baseUrl.auth}/users/reset_password`, {
    reset_token,
    password,
  })
);

export const requestChangePassword = (old_password, new_password) => (
  ApiClient.put(`${baseUrl.auth}/users/password`, {
    old_password,
    new_password,
  })
);

export const requestUserProfile = (user_uuid) => ApiClient.get(`${baseUrl.auth}/users/${user_uuid}/profile`);

export const requestUserOrganizations = (user_uuid) => ApiClient.get(`${baseUrl.auth}/users/${user_uuid}/organizations`);

export const requestUpdateUserProfile = (user_uuid, email, first_name, last_name) => (
  ApiClient.put(`${baseUrl.auth}/users/${user_uuid}/profile`, {
    email,
    first_name,
    last_name,
  })
);

export const requestUserAvatar = (user_uuid) => (
  ApiClient.get(`${baseUrl.auth}/users/${user_uuid}/avatar`)
);

export const requestUpdateUserAvatar = (user_uuid, image_content) => (
  ApiClient.put(`${baseUrl.auth}/users/${user_uuid}/avatar`, image_content)
);

export const requestOrganizationMembers = (organization_uuid) => (
  ApiClient.get(`${baseUrl.auth}/organizations/${organization_uuid}/members`)
);

export const requestRemoveOrganizationMember = (organization_uuid, user_uuid) => (
  ApiClient.delete(`${baseUrl.auth}/organizations/${organization_uuid}/members/${user_uuid}`)
);

export const requestChangeOrganizationMemberRole = (organization_uuid, user_uuid, role) => (
  ApiClient.put(`${baseUrl.auth}/organizations/${organization_uuid}/members/${user_uuid}/role`, { role })
);

export const requestInviteOrganizationMember = (organization_uuid, email) => (
  ApiClient.post(`${baseUrl.auth}/organizations/${organization_uuid}/invitations`, { email })
);

export const requestAcceptOrganizationInvitation = (invitation_token) => (
  ApiClient.post(`${baseUrl.auth}/organizations/invitations/accept`, { invitation_token })
);

export const requestCancelOrganizationInvitation = (invitation_uuid) => (
  ApiClient.post(`${baseUrl.auth}/organizations/invitations/cancel`, { invitation_uuid })
);

export const requestOrganizationInvitations = (organization_uuid) => (
  ApiClient.get(`${baseUrl.auth}/organizations/${organization_uuid}/invitations`)
);

export const requestCreateOrganization = (organization_name) => (
  ApiClient.post(`${baseUrl.auth}/organizations`, { name: organization_name })
);

export const requestUpdateOrganization = (organization_uuid, organization_name) => (
  ApiClient.put(`${baseUrl.auth}/organizations/${organization_uuid}/profile`, { name: organization_name })
);

export const requestDeleteOrganization = (organization_uuid) => (
  ApiClient.delete(`${baseUrl.auth}/organizations/${organization_uuid}`)
);

export const requestGetPipelines = (organization_uuid) => (
  ApiClient.get(`${baseUrl.app}/organizations/${organization_uuid}/pipelines`, appToken)
);

export const requestCreatePipeline = (organization_uuid, body) => (
  ApiClient.post(`${baseUrl.app}/organizations/${organization_uuid}/pipelines`, body, appToken)
);

export const requestUpdatePipeline = (organization_uuid, pipeline_uuid, body) => (
  ApiClient.put(`${baseUrl.app}/organizations/${organization_uuid}/pipelines/${pipeline_uuid}`, body, appToken)
);

export const requestDeletePipeline = (organization_uuid, pipeline_uuid) => (
  ApiClient.delete(`${baseUrl.app}/organizations/${organization_uuid}/pipelines/${pipeline_uuid}`, appToken)
);

export const requestUploadInputFile = (organization_uuid, pipeline_uuid, file_name, file_content) => (
  ApiClient.post(
    `${baseUrl.app}/organizations/${organization_uuid}/pipelines/${pipeline_uuid}/input_files?name=${file_name}`,
    file_content,
    appToken,
    mime.getType(file_name),
  )
);

export const requestStartPipelineRun = (organization_uuid, pipeline_uuid, inputs) => (
  ApiClient.post(`${baseUrl.app}/organizations/${organization_uuid}/pipelines/${pipeline_uuid}/runs`, { inputs }, appToken)
);

export const requestGetPipelineRuns = (organization_uuid, pipeline_uuid) => (
  ApiClient.get(`${baseUrl.app}/organizations/${organization_uuid}/pipelines/${pipeline_uuid}/runs`, appToken)
);

export const requestPipelineRunConsoleOutput = (organization_uuid, pipeline_uuid, pipeline_run_uuid) => (
  ApiClient.get(`${baseUrl.app}/organizations/${organization_uuid}/pipelines/${pipeline_uuid}/runs/${pipeline_run_uuid}/console`, appToken)
);

export const requestGetPipelineRun = (organization_uuid, pipeline_uuid, pipeline_run_uuid) => (
  ApiClient.get(`${baseUrl.app}/organizations/${organization_uuid}/pipelines/${pipeline_uuid}/runs/${pipeline_run_uuid}`, appToken)
);

export const requestCreatePipelineRunArtifact = (organization_uuid, pipeline_uuid, pipeline_run_uuid, title, artifact_uuid, chart_type_code, chart_config) => (
  ApiClient.post(`${baseUrl.app}/organizations/${organization_uuid}/pipelines/${pipeline_uuid}/runs/${pipeline_run_uuid}/charts`, {
    name: title,
    artifact_uuid,
    chart_type_code,
    chart_config,
  }, appToken)
);

export const requestPipelineRunCharts = (organization_uuid, pipeline_uuid, pipeline_run_uuid) => (
  ApiClient.get(`${baseUrl.app}/organizations/${organization_uuid}/pipelines/${pipeline_uuid}/runs/${pipeline_run_uuid}/charts`, appToken)
);

export const requestUpdatePipelineRunChart = (organizationUuid, pipelineUuid, pipelineRunUuid, artifactUuid, chartUpdates) => (
  ApiClient.put(`${baseUrl.app}/organizations/${organizationUuid}/pipelines/${pipelineUuid}/runs/${pipelineRunUuid}/charts/${artifactUuid}`, chartUpdates, appToken)
);

export const requestDeletePipelineRunChart = (organizationUuid, pipelineUuid, pipelineRunUuid, artifactUuid) => (
  ApiClient.delete(`${baseUrl.app}/organizations/${organizationUuid}/pipelines/${pipelineUuid}/runs/${pipelineRunUuid}/charts/${artifactUuid}`, appToken)
);

export const requestArtifact = ({ url }) => (
  window.fetch(url)
);
