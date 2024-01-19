import { supabase } from '../../api/supabase/supabaseClient';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import {
  StLoginContainer,
  StLoginText,
  StLoginTitle
} from '../../styles/loginStyle/LoginStyle';

const Login = () => {
  return (
    <StLoginContainer>
      <StLoginTitle>로그인/회원가입</StLoginTitle>
      <StLoginText>SNS 계정으로 간편하게 로그인하세요</StLoginText>

      <Auth
        supabaseClient={supabase}
        appearance={{ theme: ThemeSupa }}
        providers={['google', 'facebook', 'kakao']}
        onlyThirdPartyProviders={true}
      />
    </StLoginContainer>
  );
};

export default Login;
