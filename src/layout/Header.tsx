import React, { useEffect, useState } from 'react';
import * as St from '../styles/headerStyle/HeaderStyle';
import { useNavigate } from 'react-router';
import SearchBar from '../components/layout/header/SearchBar';
import { logOut } from '../api/supabase/auth';
import { supabase } from '../api/supabase/supabaseClient';
import { error } from 'console';
import { getUserProfile } from '../api/supabase/profile';
import { useQuery } from 'react-query';

interface User {
  username: string;
}

const getOut = async () => {
  let { error } = await supabase.auth.signOut();
  if (error) console.log(error);
};

const Header = () => {
  const [isLogin, setIsLogin] = useState<boolean>(false);
  const userId = localStorage.getItem('userId');
  const [user, setUser] = useState<User | boolean>(false);
  const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   const fetchUserData = async () => {
  //     try {
  //       const { data: userData, error: userError } =
  //         await supabase.auth.getUser();
  //       if (userError) {
  //         console.error('유저아이디 정보를 불러오지 못했습니다.', userError);
  //       }
  //       setUser(userData);
  //     } catch (error) {
  //       console.error(
  //         '수파베이스에서 로그인 정보를 불러오지 못했습니다.',
  //         error
  //       );
  //     }
  //   };
  // }, []);

  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate('/');
  };
  const handleSellbuttonClick = () => {
    navigate('/productsposts');
  };

  const handleProfileClick = async () => {
    navigate('/mypage');
  };

  // 로그아웃 버튼
  const handleLogOutClick = () => {
    logOut();
    navigate('/login');
  };

  // TODO: 여기서부터 현재 유저의 로그인 상태여부를 확인하는 함수인데 이거 나중에 전역 상태관리로 리팩토링해야 합니다.
  const getSession = async () => {
    const { data, error } = await supabase.auth.getSession();

    if (data.session) {
      setIsLogin(true);
    } else {
      setIsLogin(false);
    }
  };

  const { data: userData } = useQuery({
    queryKey: ['user'],
    queryFn: () => getUserProfile(userId)
  });

  useEffect(() => {
    getSession();
  }, []);

  return (
    <St.HeaderContainer>
      <St.HeaderSection>
        <St.Logo onClick={handleLogoClick}>작업자들</St.Logo>
        <St.ButtonContainer>
          <St.Button onClick={handleSellbuttonClick}>판매하기</St.Button>
          <St.Button>찜</St.Button>
          <St.Button>알림</St.Button>
          <St.UserIcon src="/assets/gonext.png" />
        </St.ButtonContainer>
      </St.HeaderSection>
      <St.NavSection>
        <St.NavBar>
          {/* <St.NavButton to="/introduce">서비스 소개</St.NavButton> */}
          <St.NavButton to="/products">중고거래</St.NavButton>
          <St.NavButton to="/community">커뮤니티</St.NavButton>
          <button onClick={handleLogOutClick}>로그아웃</button>
        </St.NavBar>
        <St.SearchBar>
          <SearchBar />
        </St.SearchBar>
      </St.NavSection>
    </St.HeaderContainer>
  );
};

export default Header;
