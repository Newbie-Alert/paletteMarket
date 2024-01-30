import React, { useEffect, useState } from 'react';
import Header from './Header';
import Footer from './Footer';
import { Outlet, useLocation, useNavigate } from 'react-router';
import ScrollTopButton from './ScrollTopButton';
import { supabase } from '../api/supabase/supabaseClient';

import styled from 'styled-components';
import { IoIosClose } from 'react-icons/io';
const userId = localStorage.getItem('userId');

const StModalContainer = styled.div`
  width: 300px;
  height: 250px;
  padding: 1.5rem;
  position: fixed;
  top: 5%;
  left: 5%;
  z-index: 3;
  transform: translateX(-10%);
  background-color: var(--3-gray);
  border-radius: 1.2rem;
  overflow-y: scroll;

  @media screen and (max-width: 768px) {
    width: 220px;
    height: 200px;
    overflow-y: scroll;
  }
`;

const StAlertBox = styled.div`
  width: 100%;
  font-size: 1.4rem;
  height: 36px;
  line-height: 2.2;
  color: var(--opc-100);
  border-bottom: 0.1rem solid var(--6-gray);

  :hover {
    background-color: var(--opc-100);
    color: var(--3-gray);
    cursor: pointer;
  }
`;

const StAlertCloseBtn = styled(IoIosClose)`
  font-size: 2rem;
  width: fit-content;
  display: block;
  margin-left: auto;
  cursor: pointer;
`;

// TODO:
const useScrollTopBtn = () => {
  const location = useLocation();
  const [showTopbutton, setShowTopButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollPercentage =
        (scrollY / (documentHeight - windowHeight)) * 100;

      if (
        (['/', '/community_write', '/productsposts'].includes(
          location.pathname
        ) &&
          scrollPercentage >= 50) ||
        (['/mypage', '/products', '/community', '/search-results'].includes(
          location.pathname
        ) &&
          scrollY >= 300)
      ) {
        setShowTopButton(true);
      } else {
        setShowTopButton(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [location.pathname]);

  return { showTopbutton }
}
const Layout = () => {
  const location = useLocation();
  // const [showTopbutton, setShowTopButton] = useState(false);
  const { showTopbutton } = useScrollTopBtn();

  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [newAlert, setAlert] = useState<any[]>([]);
  const [userChatRooms, setUserChatRoom] = useState<string[]>([]);
  const navi = useNavigate();

  // push알림
  const [notifications, setNotifications] = useState<any[]>([]);

  const handleHideAlert = () => {
    setShowAlert(false);
  };

  const handleClickAlert = () => {
    navi('/chat');
    handleHideAlert();
    setAlert([]);
  };

  // useEffect(() => {
  //   const handleScroll = () => {
  //     const scrollY = window.scrollY;
  //     const windowHeight = window.innerHeight;
  //     const documentHeight = document.documentElement.scrollHeight;
  //     const scrollPercentage =
  //       (scrollY / (documentHeight - windowHeight)) * 100;

  //     if (
  //       (['/', '/community_write', '/productsposts'].includes(
  //         location.pathname
  //       ) &&
  //         scrollPercentage >= 50) ||
  //       (['/mypage', '/products', '/community', '/search-results'].includes(
  //         location.pathname
  //       ) &&
  //         scrollY >= 300)
  //     ) {
  //       setShowTopButton(true);
  //     } else {
  //       setShowTopButton(false);
  //     }
  //   };
  //   window.addEventListener('scroll', handleScroll);
  //   return () => {
  //     window.removeEventListener('scroll', handleScroll);
  //   };
  // }, [location.pathname]);

  // 메세지 실시간 알림 받기
  useEffect(() => {
    if (userId) {
      const getUserChatRoom = async () => {
        const { data: chatRooms, error } = await supabase
          .from('user')
          .select('*')
          .eq('uid', userId);
        if (chatRooms) {
          setUserChatRoom(chatRooms[0]?.chat_rooms);
        }
        if (error) {
          console.log('no chatRooms', error);
        }
      };

      getUserChatRoom();

      const chatMessages = supabase
        .channel('custom-all-channel')
        .on(
          'postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'chat_messages' },
          (payload: any) => {
            if (
              userChatRooms.includes(payload.new.chat_room_id) &&
              payload.new.sender_id !== userId
            ) {
              console.log('Change received!', payload.new);
              // handlePushNotification(payload.new);
              setShowAlert(true);
              setAlert((prev: any) => [payload.new, ...prev]);
            }
          }
        )
        .subscribe();

      return () => {
        chatMessages.unsubscribe();
      };
    }
  }, [location]);

  return (
    <Wrapper>
      {newAlert.length > 0 && showAlert && (
        <StModalContainer>
          <StAlertCloseBtn onClick={handleHideAlert} />
          {newAlert.map((alert) => {
            return (
              <StAlertBox onClick={handleClickAlert} key={alert.timeStamp}>
                <h1>새로운 메세지가 있습니다</h1>
              </StAlertBox>
            );
          })}
        </StModalContainer>
      )}
      <Header />
      <ContentWrapper>
        <Outlet />
      </ContentWrapper>
      {showTopbutton && <ScrollTopButton />}
      <Footer />
    </Wrapper>
  );
};

export default Layout;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  margin: auto;
`;

const ContentWrapper = styled.div`
  flex: 1;
`;
