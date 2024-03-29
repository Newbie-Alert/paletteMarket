import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { useEffect } from 'react';
import { supabase } from '../../api/supabase/supabaseClient';
import {
  StLoginContainer,
  StLoginText,
  StLoginTitle
} from '../../styles/loginStyle/LoginStyle';

const Login = () => {
  const redirectTo = localStorage.getItem('prevUrl') || '/';

  return (
    <StLoginContainer>
      <StLoginTitle>로그인/회원가입</StLoginTitle>
      <StLoginText>SNS 계정으로 간편하게 로그인하세요</StLoginText>

      <Auth
        supabaseClient={supabase}
        appearance={{ theme: ThemeSupa }}
        providers={['google', 'facebook', 'kakao']}
        redirectTo={'/'}
        onlyThirdPartyProviders={true}
      />
    </StLoginContainer>
  );
};

export default Login;
