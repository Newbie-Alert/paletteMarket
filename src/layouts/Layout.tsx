import React, { useEffect, useState } from 'react';
import Header from './Header';
import Footer from './Footer';
import { Outlet, useLocation, useNavigate } from 'react-router';
import ScrollTopButton from './ScrollTopButton';
import { supabase } from '../api/supabase/supabaseClient';
import styled from 'styled-components';
import { CustomUser } from '../pages/productsDetail/types';
import { Participants } from '../components/chat/types';
const userId = localStorage.getItem('userId');

const Layout = () => {
  const location = useLocation();
  const [showTopbutton, setShowTopButton] = useState(false);
  const [curUser, setCurUser] = useState<CustomUser | null>(null);

  // 실시간 알림
  const [notification, setNotification] = useState<any[]>([]);
  const [newNotiExists, setNewNotiExists] = useState<boolean>(false);

  const playAlert = () => {
    const ring = new Audio('/assets/Twitter Notification_sound_effect.mp3');

    setTimeout(() => {
      ring.play();
      ring.currentTime = 0.5;
    }, 1000);
  };

  useEffect(() => {
    const getUserData = async () => {
      const currentUserId = localStorage.getItem('userId');
      const { data: currentUser, error } = await supabase
        .from('user')
        .select('*')
        .eq('uid', currentUserId);

      // 현재 로그인 유저의 데이터가 있다면
      if (currentUser && currentUser.length > 0) {
        setCurUser(currentUser[0]);
      }
      // 로그이 유저 없음 에러
      if (error) console.log('logined user not exists');
    };

    getUserData();
    const chatMessages = supabase
      .channel('custom-insert-channel')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'chat_messages' },
        async (payload: any) => {
          const { data: chatRooms, error } = await supabase
            .from('chat_room')
            .select('participants')
            .eq('id', payload.new.chat_room_id);
          console.log(chatRooms);

          if (chatRooms && chatRooms.length > 0) {
            const exists = chatRooms.map((room) => {
              return room.participants.some(
                (part: Participants) => part.user_id === curUser?.uid
              );
            });
            if (
              exists &&
              exists.length > 0 &&
              payload.new.sender_id !== curUser?.uid
            ) {
              console.log(exists);
              setNotification((prev) => [payload.new, ...prev]);
              console.log('알림');
              setNewNotiExists(true);
              playAlert();
            }
          }
          // 유저가 속한 채팅방의 알림만 filter해서 state에 set
        }
      )
      .subscribe();

    return () => {
      chatMessages.unsubscribe();
    };
  }, []);

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

  return (
    <Wrapper>
      <Header
        notification={notification}
        newNotiExists={newNotiExists}
        setNewNotiExists={setNewNotiExists}
        setNotification={setNotification}
      />
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