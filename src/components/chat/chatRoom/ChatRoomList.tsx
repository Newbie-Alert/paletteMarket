import React, { useEffect, useState } from 'react';
import { supabase } from '../../../api/supabase/supabaseClient';
import * as St from '../../../pages/chat/style';
import { MessageType, RoomType } from '../types';
import parseDate from '../../../util/getDate';
import { Product } from '../../../api/supabase/products';
import { User } from '@supabase/supabase-js';
import { StOverayText, StRoomName, StStatusOveray } from '../ChatCompStyles';

type Props = {
  rooms: RoomType[] | null | undefined;
  handleCurClicked: React.MouseEventHandler<HTMLDivElement>;
  clicked: string | undefined;
  unread: any[] | null;
  handleBoardPosition: any;
  curUser: User | null | undefined;
};

const ChatRoomList: React.FC<Props> = ({
  rooms,
  handleCurClicked,
  clicked,
  handleBoardPosition,
  curUser
}: Props) => {
  const [newMsg, setNewMsg] = useState<any | null>(null);
  const [allMessage, setAllMessage] = useState<MessageType[] | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [unread, setUnread] = useState<(number | undefined)[]>([]);

  const unreadCount = async (
    room_id: string,
    curUser: User | null | undefined
  ) => {
    let { data: chat_messages, error } = await supabase
      .from('chat_messages')
      .select()
      .eq('chat_room_id', room_id)
      .eq('isNew', true);

    if (error) console.log('count error', error);

    return chat_messages?.filter(
      (msg: MessageType) => msg.sender_id !== curUser?.id
    ).length;
  };

  const updateToRead = async (room_id: string) => {
    await supabase
      .from('chat_messages')
      .update({ isNew: false })
      .eq('chat_room_id', room_id)
      .eq('isNew', true);

    await supabase.from('chat_room').update({ unread: 0 }).eq('id', room_id);
  };

  const handleRealtime = () => {
    // 채팅방 테이블 구독
    const chatRooms = supabase
      .channel('custom-all-channel')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'chat_room' },
        (payload) => {}
      )
      .subscribe();

    const chatMessages = supabase
      .channel('custom-all-channel')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'chat_messages' },
        (payload) => {
          setNewMsg(payload.new);
        }
      )
      .subscribe();
  };

  // 메세지를 다 가져오고, 현재 로그인 된 유저가 속한 채팅방의 메세지라면
  // allMessage에 set 하고 밑에서 map을 돌면서
  // 이 div의 id와 같은 채팅방 메세지만 출력
  const getAllMessage = async () => {
    const { data: messages, error } = await supabase
      .from('chat_messages')
      .select('*');

    setAllMessage(messages);
  };

  const getProductsforRoom = async () => {
    const { data: product, error } = await supabase
      .from('products')
      .select('*');

    if (product && product.length > 0) {
      setProducts(product);
    }
  };
  // product(게시물)의 id가 chatRoom의 about의 값이 되기 때문에
  // 채팅과 연결 된 게시물의 가져오려면 각 room의 about값과 같은 product를 찾아서 => isSell이나, 존재 여부에 따라 조건부 렌더
  const checkProductsStatus = (room_id: string) => {
    const matchedProduct = products.filter(
      (item: Product) => item.id === room_id
    );

    if (matchedProduct && matchedProduct[0]?.isSell === true) {
      return true;
    } else {
      return false;
    }
  };

  // 모든 채팅방은 2개
  // 메세지는 map으로 훑기 너무 많다 index가 안 닿음
  // 각 방에 맞게 필터 된 배열을 시간순으로 정렬하고
  // 그 중 가장 오래 된 메세지를 출력
  // 모든 메세지를 가져와 해당 방의 아이디와 일치하는 값을 가지고 있다면 보여주기
  const findMatchMessage = (room: string): any => {
    if (allMessage !== null) {
      const Matched = allMessage
        .map((msg) => {
          return msg.chat_room_id === room && msg;
        })
        .sort(
          (a: any, b: any) =>
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        )
        .filter((msg) => msg !== false);

      return Matched[Matched.length - 1];
    }
  };

  // participants에서 상대방 정보를 가져오는 함수
  const chatTarget = (room: RoomType) => {
    const targetInfo = room.participants.filter((info) => {
      return info.user_id !== curUser?.id;
    });
    return targetInfo[0];
  };

  useEffect(() => {
    handleRealtime();
    getAllMessage();
    getProductsforRoom();
  }, []);

  const checkDevice = (agent: string) => {
    const mobileRegex = [
      /Android/i,
      /iPhone/i,
      /iPad/i,
      /iPod/i,
      /BlackBerry/i,
      /Windows Phone/i
    ];

    return mobileRegex.some((mobile) => agent.match(mobile));
  };

  useEffect(() => {
    if (checkDevice(window.navigator.userAgent)) setIsMobile(true);
    if (checkDevice(window.navigator.userAgent)) setIsMobile(false);
  }, []);

  useEffect(() => {
    // 각 채팅방 목록이 업데이트될 때마다 안 읽은 메세지 수를 가져오고 상태에 저장
    if (rooms) {
      Promise.all(rooms.map((room) => unreadCount(room.id, curUser))).then(
        (counts) => {
          setUnread(counts);
        }
      );
    }
  }, [rooms, clicked]);

  return (
    <St.StChatListItem>
      {rooms
        ?.sort((a, b) => {
          return (
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          );
        })
        .map((room, i) => {
          // 판매 완료 상태인지 아닌지 췤
          if (checkProductsStatus(room.about) === true)
            return (
              <St.StListRoom
                onClick={(e) => {
                  updateToRead(room.id);
                  handleCurClicked(e);
                }}
                $current={clicked}
                id={room.id}
                key={room.id}
              >
                {/* onClick={handleBoardPosition} 완료 상품 관련 채팅을 띄워줘야할지,,, 고민즁... */}
                <StStatusOveray onClick={handleBoardPosition}>
                  <StOverayText>판매 완료 상품입니다</StOverayText>
                </StStatusOveray>
                <St.StListUpper>
                  <St.StUserInfoBox>
                    <St.StListUserProfile
                      $url={
                        chatTarget(room).avatar_url === null
                          ? ''
                          : chatTarget(room).avatar_url
                      }
                    ></St.StListUserProfile>
                    <div>
                      <p>{`${chatTarget(room).user_name}`}</p>
                      <StRoomName>
                        {room.room_name.length >= 20
                          ? `${room.room_name.substring(0, 20)}...`
                          : room.room_name}
                      </StRoomName>
                    </div>
                  </St.StUserInfoBox>
                  <St.StUnreadCount>{unread && unread[i]}</St.StUnreadCount>
                </St.StListUpper>

                <St.StListLower>
                  <p>
                    {findMatchMessage(room.id)?.content
                      ? findMatchMessage(room.id)?.content
                      : ''}
                  </p>
                  <span>
                    {findMatchMessage(room.id)
                      ? parseDate(findMatchMessage(room.id)?.created_at)
                      : '신규 생성 채팅방'}
                  </span>
                </St.StListLower>
              </St.StListRoom>
            );
          else {
            return (
              <St.StListRoom
                onClick={(e) => {
                  handleCurClicked(e);
                  handleBoardPosition();
                  updateToRead(room.id);
                }}
                $current={clicked}
                id={room.id}
                key={room.id}
              >
                <St.StListUpper>
                  <St.StUserInfoBox>
                    <St.StListUserProfile
                      $url={
                        chatTarget(room).avatar_url === null
                          ? ''
                          : chatTarget(room).avatar_url
                      }
                    ></St.StListUserProfile>
                    <div>
                      <p>{`${chatTarget(room).user_name}`}</p>
                      <StRoomName>
                        {room.room_name.length >= 20
                          ? `${room.room_name.substring(0, 20)}...`
                          : room.room_name}
                      </StRoomName>
                    </div>
                  </St.StUserInfoBox>
                  <St.StUnreadCount>{unread && unread[i]}</St.StUnreadCount>
                </St.StListUpper>

                <St.StListLower>
                  <p>
                    {findMatchMessage(room.id)?.content
                      ? findMatchMessage(room.id)?.content
                      : ''}
                  </p>
                  <span>
                    {findMatchMessage(room.id)
                      ? parseDate(findMatchMessage(room.id)?.created_at)
                      : '신규 생성 채팅방'}
                  </span>
                </St.StListLower>
              </St.StListRoom>
            );
          }
        })}
    </St.StChatListItem>
  );
};

export default ChatRoomList;