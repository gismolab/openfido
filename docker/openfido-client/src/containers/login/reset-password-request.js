import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import { requestPasswordReset } from 'services';
import 'actions/user';
import CloseOutlined from 'icons/CloseOutlined';
import {
  Root,
  StyledH1,
  StyledH2,
  FormWrapper,
  StyledForm,
  StyledInput,
  FormMessage,
} from 'styles/login';
import { StyledButton, StyledText } from 'styles/app';
import styled from 'styled-components';

const HeaderText = styled(StyledH2)`
  height: 32px;
  height: 2rem;
`;

const ResetPasswordText = styled(StyledText)`
  margin-bottom: 44px;
  margin-bottom: 2.75rem;
  display: inline-block;
`;

const ThankYouText = styled(StyledText)`
  margin-top: 24px;
  margin-top: 1.5rem;
  display: inline-block;
`;

const SubmitButton = styled(StyledButton)`
  margin-top: -16px;
  margin-top: -1rem;
`;

const ResetPasswordRequest = () => {
  const [email, setEmail] = useState('');
  const [thanks, setThanks] = useState(false);
  const [loading, setLoading] = useState(false);
  // const [error, setError] = useState();

  const onEmailChanged = (e) => {
    setEmail(e.target.value);
  };

  const onResetClicked = (e) => {
    e.preventDefault();

    if (!loading) {
      setLoading(true);

      requestPasswordReset(email)
        .then(() => {
          setThanks(true);
        })
        .catch(() => {
          // setError(true);
          setLoading(false);
        });
    }
  };

  return (
    <Root>
      <StyledH1>
        Welcome to
        <br />
        OpenFIDO
      </StyledH1>
      <FormWrapper>
        <StyledForm className={thanks ? 'thanks' : ''} onSubmit={onResetClicked}>
          {!thanks ? (
            <>
              <HeaderText>RESET YOUR PASSWORD</HeaderText>
              <ResetPasswordText
                size="large"
                color="gray"
              >
                Enter your email address and we will
                <br />
                send you a link to reset your password
              </ResetPasswordText>
              <StyledInput placeholder="email" onChange={onEmailChanged} />
              <FormMessage size="large" />
              <SubmitButton
                htmlType="submit"
                size="middle"
                color="blue"
                width={144}
                role="button"
                tabIndex={0}
                onClick={onResetClicked}
              >
                Submit
              </SubmitButton>
            </>
          ) : (
            <>
              <Link to="/login"><CloseOutlined color="gray" /></Link>
              <StyledH2>HELP IS ON THE WAY</StyledH2>
              <ThankYouText
                size="large"
                color="gray"
              >
                Please check your email to reset your password.
              </ThankYouText>
            </>
          )}
        </StyledForm>
      </FormWrapper>
    </Root>
  );
};

export default ResetPasswordRequest;
