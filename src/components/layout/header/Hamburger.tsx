import React, { useEffect } from 'react';
import { BiEdit } from 'react-icons/bi';
import { IoIosClose } from 'react-icons/io';
import { IoPeopleSharp } from 'react-icons/io5';
import { IoPersonSharp } from 'react-icons/io5';
import { BiWon } from 'react-icons/bi';
import { LuPalette } from 'react-icons/lu';
import { TbLogin, TbLogout } from 'react-icons/tb';
import { BsChatDotsFill } from 'react-icons/bs';
import { supabase } from '../../../api/supabase/supabaseClient';
import {
  useAppDispatch,
  useAppSelector
} from '../../../redux/reduxHooks/reduxBase';
import * as St from '../../../styles/headerStyle/HeaderStyle';
import {
  setSuccessLogin,
  setSuccessLogout
} from '../../../redux/modules/authSlice';
import {
  CloseHamburger,
  HamburgerModalContainer,
  HrStyle,
  Logout,
  NavToBoard,
  NavToChatRoom,
  NavToCommunity,
  NavToMypage,
  NavToProducts,
  UserInfo,
  UserMenu
} from './HamburgerStyle';

interface HamburgerMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => Promise<void>;
  user: boolean | User;
  setUser: (value: boolean | User) => void;
  avatarUrl?: string;
  handleNavigateToLogin: () => void;
}

interface User {
  username: string;
}
interface UserProfile {
  id: string;
  username: string;
  nickname: string;
  avatar_url: string;
  email: string;
}
const Hamburger: React.FC<HamburgerMenuProps> = ({
  isOpen,
  onClose,
  onLogout,
  user,
  setUser,
  avatarUrl,
  handleNavigateToLogin
}) => {
  const { isLogin } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  const handleLogOut = () => {
    onLogout();
    onClose();
  };
  const getUserInfo = async (id: string | null) => {
    const { data: profile } = await supabase
      .from('user')
      .select('*')
      .eq('id', id);
    return profile;
  };

  // 로그인 상태여부 확인
  const getSession = async () => {
    const { data, error } = await supabase.auth.getSession();
    if (data.session) {
      dispatch(setSuccessLogin());
    } else {
      dispatch(setSuccessLogout());
    }
  };

  useEffect(() => {
    getSession();
  }, []);

  return (
    <HamburgerModalContainer $isOpen={isOpen}>
      <CloseHamburger>
        <IoIosClose
          style={{
            color: 'var(--opc-100)',
            fontSize: '3rem',
            cursor: 'pointer'
          }}
          onClick={onClose}
        />
      </CloseHamburger>
      <UserInfo>
        {avatarUrl && <img src={avatarUrl} alt="Avatar" />}
        <p></p>
      </UserInfo>

      <NavToBoard>
        <NavToProducts to="/products" onClick={onClose}>
          <LuPalette />
          <p>중고거래</p>
        </NavToProducts>

        <NavToCommunity to="/community" onClick={onClose}>
          <IoPeopleSharp />
          <p>커뮤니티</p>
        </NavToCommunity>
      </NavToBoard>
      <HrStyle />
      <NavToBoard>
        <NavToProducts to="/productsposts" onClick={onClose}>
          <BiWon />
          <p>판매하기</p>
        </NavToProducts>

        <NavToCommunity to="/community_write" onClick={onClose}>
          <BiEdit />
          <p>소통하기</p>
        </NavToCommunity>
      </NavToBoard>
      <HrStyle />
      <UserMenu>
        <NavToMypage to="/mypage" onClick={onClose}>
          <IoPersonSharp />
          <p>마이페이지</p>
        </NavToMypage>

        <NavToChatRoom to="/chat" onClick={onClose}>
          <BsChatDotsFill />
          <p>채팅</p>
        </NavToChatRoom>
        {isLogin ? (
          <Logout onClick={onClose}>
            <TbLogout />
            <p onClick={handleLogOut}>로그아웃</p>
          </Logout>
        ) : (
          <Logout onClick={onClose}>
            <TbLogin />
            <p onClick={handleNavigateToLogin}>로그인</p>
          </Logout>
        )}
      </UserMenu>
    </HamburgerModalContainer>
  );
};

export default Hamburger;
