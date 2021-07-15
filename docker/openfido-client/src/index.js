import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Provider, useSelector, useDispatch } from 'react-redux';
import {
  BrowserRouter,
  Switch,
  Route,
  Redirect,
  useLocation,
} from 'react-router-dom';

import Login from 'containers/login';
import Logout from 'containers/login/logout';
import ResetPasswordRequest from 'containers/login/reset-password-request';
import ResetPassword from 'containers/login/reset-password';
import Users from 'containers/users';
import AcceptOrganizationInvitation from 'containers/login/accept-organization-invitation';
import CreateNewAccountInvitation from 'containers/login/create-new-account-invitation';
import App from 'containers/app';
import Pipelines from 'containers/pipelines';
import PipelineRuns from 'containers/pipelines/pipeline-runs';
import DataVisualization from 'containers/pipelines/pipeline-runs/data-visualization';
import ConsoleOutput from 'containers/pipelines/pipeline-runs/console-output';
import Settings from 'containers/settings';
import { refreshUserToken } from 'actions/user';
import store from 'config/store';
import {
  ROUTE_LOGIN,
  ROUTE_LOGOUT,
  ROUTE_RESET_PASSWORD,
  ROUTE_UPDATE_PASSWORD,
  ROUTE_PIPELINES,
  ROUTE_PIPELINE_RUNS,
  ROUTE_USERS,
  ROUTE_ACCEPT_ORGANIZATION_INVITATION,
  ROUTE_CREATE_NEW_ACCOUNT_INVITATION,
  ROUTE_SETTINGS,
  ROUTE_PIPELINE_RUNS_DATA_VISUALIZATION,
  ROUTE_PIPELINE_RUNS_CONSOLE_OUTPUT,
} from 'config/routes';
import { ROLE_ADMINISTRATOR } from 'config/roles';
import * as serviceWorker from './serviceWorker';
import 'antd/dist/antd.compact.min.css';
import 'index.css';

const AppSwitch = () => {
  const location = useLocation();

  const profile = useSelector((state) => state.user.profile);
  const organizations = useSelector((state) => state.user.organizations);
  const currentOrg = useSelector((state) => state.user.currentOrg);
  const hasProfile = profile !== null;
  const dispatch = useDispatch();

  const [checkedJWTRefresh, setCheckedJWTRefresh] = useState(false);

  useEffect(() => {
    if (checkedJWTRefresh) return;
    setCheckedJWTRefresh(true);

    if (profile === null) return;

    const { uuid: user_uuid } = profile;

    dispatch(refreshUserToken(user_uuid));
  }, [dispatch, profile, checkedJWTRefresh]);

  const hasProfileRedirectToPipelines = hasProfile && <Redirect to={ROUTE_PIPELINES} />;
  const noProfileRedirectToLogin = !hasProfile && <Redirect to={ROUTE_LOGIN} />;

  const isOrganizationAdmin = currentOrg && organizations && organizations.find((org) => org.uuid === currentOrg && org.role.code === ROLE_ADMINISTRATOR.code);

  return (
    <Switch key={location.key}>
      <Route exact path={ROUTE_LOGIN}>
        {hasProfileRedirectToPipelines}
        <Login />
      </Route>
      <Route exact path={ROUTE_LOGOUT}>
        {noProfileRedirectToLogin}
        {hasProfile && <Logout />}
      </Route>
      <Route exact path={ROUTE_RESET_PASSWORD}>
        <ResetPasswordRequest />
      </Route>
      <Route exact path={ROUTE_UPDATE_PASSWORD}>
        <ResetPassword />
      </Route>
      <Route exact path={ROUTE_ACCEPT_ORGANIZATION_INVITATION}>
        <AcceptOrganizationInvitation />
      </Route>
      <Route exact path={ROUTE_CREATE_NEW_ACCOUNT_INVITATION}>
        {hasProfileRedirectToPipelines}
        <CreateNewAccountInvitation />
      </Route>
      <Route exact path={ROUTE_PIPELINES}>
        {noProfileRedirectToLogin}
        {hasProfile && <App>{organizations && <Pipelines />}</App>}
      </Route>
      <Route exact path={ROUTE_PIPELINE_RUNS}>
        {noProfileRedirectToLogin}
        {hasProfile && <App>{organizations && <PipelineRuns />}</App>}
      </Route>
      <Route exact path={ROUTE_PIPELINE_RUNS_DATA_VISUALIZATION}>
        {noProfileRedirectToLogin}
        {hasProfile && <App>{organizations && <DataVisualization />}</App>}
      </Route>
      <Route exact path={ROUTE_PIPELINE_RUNS_CONSOLE_OUTPUT}>
        {noProfileRedirectToLogin}
        {hasProfile && <App>{organizations && <ConsoleOutput />}</App>}
      </Route>
      <Route exact path={ROUTE_USERS}>
        {noProfileRedirectToLogin}
        {hasProfile && (
          organizations && !isOrganizationAdmin ? (
            <Redirect to={ROUTE_PIPELINES} />
          ) : (
            <App>{organizations && <Users />}</App>
          )
        )}
      </Route>
      <Route exact path={ROUTE_SETTINGS}>
        {noProfileRedirectToLogin}
        {hasProfile && <App><Settings /></App>}
      </Route>
      {hasProfileRedirectToPipelines}
      {noProfileRedirectToLogin}
    </Switch>
  );
};

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <AppSwitch />
    </BrowserRouter>
  </Provider>,
  window.document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
