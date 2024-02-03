import React, { MouseEvent, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { supabase } from '../../api/supabase/supabaseClient';
import { Bounce, toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ProductDetailInfo from '../../components/productDetailInfoBody/ProductDetailInfo';
import * as St from './style';
import type { CustomUser, Product } from './types';
import { Participants, RoomType } from '../../components/chat/types';
import parseDate from '../../util/getDate';
import { FaHeart } from 'react-icons/fa';
import { v4 as uuid } from 'uuid';
import ProductDetailCarousel from './ProductDetailCarousel';
import { FaPencil, FaTrash } from 'react-icons/fa6';
import styled from 'styled-components';
import {
  createRoom,
  getProductInfo,
  handleAddRoomIntoUsers,
  handleCheckIsSoldOut,
  isLikedProduct,
  sendInitMessage
} from './supabase_Detail/supabaseAPI';
// DB의 채팅방 테이블 조회 후 같은 게시물에 대한 정보를 가진 채팅방이 존재하면
// 채팅 보내고 구매하기 버튼 대신 이어서 채팅하기로 전환

const StSellTitle = styled.h1`
  text-align: center;
  font-weight: 600;
  margin-block: 1rem;
  color: white;
  letter-spacing: 0.1rem;
`;

const ProductDetail = () => {
  const { id } = useParams();
  const navi = useNavigate();
  const [curUser, setCurUser] = useState<CustomUser | null>(null);
  const [target, setTarget] = useState<CustomUser | null>(null);

  const [product, setProduct] = useState<Product[] | null>(null);
  const [isExist, setIsExist] = useState<boolean>(false);
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [createdChatList, setCreatedChatList] = useState<RoomType[]>([]);
  const [buyerChatId, setBuyerChatId] = useState<string>('');
  const [showChatList, setShowChatList] = useState<boolean>(false);
  const [isSoldOut, setIsSoldOut] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [likesCount, setLikesCount] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  
  // 하빈 추가(게시물 수정기능)
  const [isEditing, setIsEditing] = useState<boolean>(false);

  // 1. 버튼 클릭 시 상대방과의 채팅방을 만든다.

  // 2. 채팅에는 제품에 대한 Id, 참여자 정보가 들어있고, 고유한 ID를 가졌다.
  // 중복을 어떻게 막는가: participants를 고유한 값으로 줘서 중복생성을 막는다,
  // 참여자 정보는 같아도 participants 안의 about에 제품 정보가 들어있기 때문에,
  // 한 제품에는 같은 유저들로 구성된 채팅방이 생성될 수 없을 것
  // 3. 한 쪽이 채팅방을 생성하면 게시물 작성자의 정보를 가져와 그 유저의 chatRoom에도 채팅방 ID를 추가한다.
  //    participants의 about이 같고 현재 로그인 유저가 속해 있는 chatRoom에
  // 4. 생성한 사람의 charRoom에도 현재 채팅방 id를 추가한다 (participants의 about이 같고 현재 로그인 유저가 있는 곳에)
  // 5. 해당 채팅방에 sender ID를 현재 유저의 아이디로 하여 보낸다.

  const makeChatRoom = async (e: MouseEvent<HTMLDivElement>) => {
    // curUser, targetUser 준비
    const currentUserId = localStorage.getItem('userId');
    const targetUserID = e.currentTarget.id;

    // user 테이블에서 채팅 상대 정보 가져오기
    const [targetUserRes, currentUserRes] = await Promise.all([
      supabase.from('user').select('*').eq('uid', targetUserID),
      supabase.from('user').select('*').eq('uid', currentUserId)
    ]);

    // 에러 처리
    if (targetUserRes.error) {
      alert('작성자 정보를 찾을 수 없습니다');
      return;
    }
    if (currentUserRes.error) {
      alert('로그인 정보를 찾을 수 없습니다');
      navi('/login');
      return;
    }

    const targetUser = targetUserRes.data;
    const currentUser = currentUserRes.data;

    // 둘 중 하나라도 데이터가 없다면 중단
    if (
      !targetUser ||
      targetUser.length === 0 ||
      !currentUser ||
      currentUser.length === 0
    ) {
      console.log('TargetUser or currentUser is null');
      if (window.confirm('로그인 후 이용 부탁드립니다') === true) {
        navi('/login');
      }
      return;
    }

    // 에러가 없다면 실행
    setTarget(targetUser[0]);
    setCurUser(currentUser[0]);
    if (targetUser && currentUser) {
      await insertUserIntoChatRoom(currentUser[0], targetUser[0]);
    } else {
      console.log('TargetUser or currentUser is null');
    }
  };

  // 생성된 채팅방 row에 참여자 정보, 채팅방 이름 삽입
  const insertUserIntoChatRoom = async (
    currentUser: CustomUser | null,
    targetUser: CustomUser | null
  ) => {
    const productInfo = await getProductInfo(id);

    if (productInfo) {
      setProduct(productInfo);
      const roomForm = [
        {
          id: uuid(), // 고유 채팅방 id
          room_name: `${productInfo[0].title}`, // 채팅방 이름
          about: `${id}`, // 채팅방이 어떤 제품과 관련이 있는지 제품 id를 넣음
          // 참여자 정보와 제품 정보를 넣어 참여자와 제품이 모두 같은 방의 중복 생성을 방지
          participants: [
            {
              about: `${id}`,
              isSeller: true, // 구매자와 판매자를 나누는 기준
              user_id: targetUser?.uid, // 상대방은 항상 판매자
              user_name: targetUser?.username,
              avatar_url: targetUser?.avatar_url
            },
            {
              about: `${id}`,
              isSeller: false,
              user_id: currentUser?.uid,
              user_name: currentUser?.username,
              avatar_url: currentUser?.avatar_url
            }
          ]
        }
      ];

      const chatRoom = await createRoom(roomForm);

      ////////////////// 방 생성 후 유저들에게 소속된 방을 추가 //////////////

      // 방이 생겼다면 유저들의 chat_room 필드에 생성 된 채팅방을 넣어주자
      if (chatRoom && currentUser && targetUser) {
        await Promise.all([
          handleAddRoomIntoUsers(currentUser, chatRoom),
          handleAddRoomIntoUsers(targetUser, chatRoom),
          sendInitMessage(product, chatRoom, currentUser, navi)
        ]);
      }
    }
  };

  // 좋아요
  const handleLike = async () => {
    // 좋아요 수
    const { data: likesField, error: Nolikes } = await supabase
      .from('products')
      .select('likes')
      .eq('id', id);
    // 좋아요 누른 사람들
    const { data: existingData, error: user_no_exists } = await supabase
      .from('products')
      .select('like_user')
      .eq('id', id);

    // 유저가 좋아한 목록
    const { data: likeList, error: noUser } = await supabase
      .from('user')
      .select('likes')
      .eq('uid', curUser?.uid);

    ////////////////////////////// 유저 관련 처리 ////////////////////////////////

    // 유저에게 좋아요한 게시물 추가
    const like_userList =
      Array.isArray(likeList) && likeList.length > 0
        ? likeList[0].likes || []
        : [];

    const updatedList = [...like_userList, id];

    if (likeList) {
      const { data: user_likeList, error } = await supabase
        .from('user')
        .update({ likes: updatedList })
        .eq('id', curUser?.id);
    }

    ////////////////////////// product 테이블 관련 처리 ///////////////////////////

    if (
      likesField &&
      likesField.length > 0 &&
      existingData &&
      existingData.length > 0
    ) {
      // 좋아요 수 1 증가
      const { status, error } = await supabase
        .from('products')
        .update({ likes: likesField[0].likes + 1 })
        .eq('id', id);

      setLikesCount((prevLikesCount) =>
        prevLikesCount ? prevLikesCount + 1 : 1
      );

      // 배열인지, 배열이면 길이가 0이상인지 확인
      const like_userList =
        existingData && Array.isArray(existingData) && existingData.length > 0
          ? Array.from(existingData[0].like_user || [])
          : [];

      const newLikeUser = {
        userNickname: curUser?.nickname,
        user_uid: curUser?.uid
      };

      const updatedLikeUserList = [...like_userList, newLikeUser];

      // 좋아요한 사용자 업데이트
      const { status: likeUser, error: likeUserFail } = await supabase
        .from('products')
        .update({
          like_user: updatedLikeUserList
        })
        .eq('id', id);

      if (status === 204 && likeUser === 204) {
        toast.success('찜 목록에 추가했어요!', {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'dark',
          transition: Bounce
        });
      }
      if (error || likeUserFail) {
        toast.error('찜하기 실패, 다시 시도해주세요', {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'dark',
          transition: Bounce
        });
      }
    }

    if (Nolikes || user_no_exists) {
      toast.error('찜하기 실패, 다시 시도해주세요', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'dark',
        transition: Bounce
      });
    }
    isLikedProduct({ curUser, id, setIsLiked });
  };

  // 찜 취소 기능
  const handleCancleLike = async () => {
    // 좋아요 수
    const { data: likesField, error: likes } = await supabase
      .from('products')
      .select('likes')
      .eq('id', id);
    // 좋아요 누른 사람들
    const { data: existingData, error: user_no_exists } = await supabase
      .from('products')
      .select('like_user')
      .eq('id', id);

    // 유저가 좋아한 목록
    const { data: likeList, error: noUser } = await supabase
      .from('user')
      .select('likes')
      .eq('uid', curUser?.uid);

    ////////////////////////////// 유저 관련 처리 ////////////////////////////////
    // 유저에게 좋아요한 게시물 추가
    const like_userList =
      Array.isArray(likeList) && likeList.length > 0
        ? likeList[0].likes || []
        : [];

    const updatedList = like_userList.filter(
      (productId: string) => productId !== id
    );

    if (likeList) {
      const { data: user_likeList, error } = await supabase
        .from('user')
        .update({ likes: updatedList })
        .eq('id', curUser?.id);
    }

    ////////////////////////// product 테이블 관련 처리 ///////////////////////////

    if (
      likesField &&
      likesField.length > 0 &&
      existingData &&
      existingData.length > 0
    ) {
      // 좋아요 수 1 감소
      const { status, error } = await supabase
        .from('products')
        .update({ likes: likesField[0].likes - 1 })
        .eq('id', id);

      setLikesCount((prevLikesCount) =>
        prevLikesCount ? prevLikesCount - 1 : 1
      );

      // 배열인지, 배열이면 길이가 0이상인지 확인
      const like_userList =
        existingData && Array.isArray(existingData) && existingData.length > 0
          ? Array.from(existingData[0].like_user || [])
          : [];

      const updatedLikeUserList = like_userList.filter(
        (user: any) => user.user_uid !== curUser?.uid
      );

      // 좋아요한 사용자 업데이트
      const { status: likeUser, error: likeUserFail } = await supabase
        .from('products')
        .update({
          like_user: updatedLikeUserList
        })
        .eq('id', id);

      if (status === 204 && likeUser === 204) {
        toast.info('찜 목록에서 삭제했어요!', {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'dark',
          transition: Bounce
        });
      }
      if (error || likeUserFail) {
        toast.error('찜하기 실패, 다시 시도해주세요', {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'dark',
          transition: Bounce
        });
      }
    }

    if (likes || user_no_exists) {
      toast.error('찜하기 실패, 다시 시도해주세요', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'dark',
        transition: Bounce
      });
    }
    isLikedProduct({ curUser, id, setIsLiked });
  };

  // 판매 완료 때 사용 할 제품 관련 사용자 리스트 가져오기
  const handleLoadChatRooms = async () => {
    const { data: roomList, error: roomListFetchError } = await supabase
      .from('chat_room')
      .select('*')
      .eq('about', id);
    if (roomList) {
      setCreatedChatList(roomList);
    }
    if (roomListFetchError) {
      console.log('no exists created Room');
    }
  };

  // 누구한테 팔지 선택할 때 (클릭한 사용자의 uid를 받아) state에 저장
  const handleSetBuyer = (e: MouseEvent<HTMLDivElement>) => {
    const buyerChatroomId = e.currentTarget.id;
    setBuyerChatId(buyerChatroomId);
  };

  // 판매 완료
  const handleSellComplete = async () => {
    if (
      window.confirm(`${selectedUser}님 에게 물품 판매를 완료하시겠습니까?`) ===
      true
    ) {
      const { data: buyUser, error: buyUserFetchError } = await supabase
        .from('user')
        .select('*')
        .eq('uid', buyerChatId);

      // 에러처리
      if (buyUserFetchError) {
        console.log('buyUser Fetch Failed', buyUserFetchError);
      }

      if (buyUser) {
        const currentBuyProducts = buyUser[0].buyProduct || [];
        const newList = [...currentBuyProducts, id];
        const { data: res, error: sellError } = await supabase
          .from('user')
          .update({ buyProduct: newList })
          .eq('uid', buyerChatId);

        // 업데이트 실패 에러 처리
        if (sellError) {
          console.log('list update fail at user table');
        }

        // 제품 게시물 상태  업데이트
        const { data: sellRes, error: sellErr } = await supabase
          .from('products')
          .update({ isSell: true })
          .eq('id', id);

        // 게시물 buyer_uid에 구매자 ID 업데이트
        const { data: buyerInsert, error: buyerInsertErr } = await supabase
          .from('products')
          .update({ buyer_uid: buyerChatId })
          .eq('id', id);

        alert('판매가 완료되었습니다');
        navi('/');
      }
    } else {
      return;
    }
  };

  // 채팅 리스트 보여주기
  const handleShowChatList = () => {
    setShowChatList(true);
  };

  // 클릭 된 유저 이름 받아오기
  const handleSelectedUser = (e: MouseEvent<HTMLDivElement>) => {
    const selected = e.currentTarget.innerText;
    setSelectedUser(selected);
  };

  // 찜 개수 카운트 해주는 함수
  const handleGetLikeCount = async () => {
    const { data: likes, error } = await supabase
      .from('products')
      .select('likes')
      .eq('id', id);

    if (likes && likes.length > 0) {
      setLikesCount(likes[0].likes);
    }
  };

  // 게시물 삭제
  const handleDeletePost = async () => {
    if (window.confirm('정말 삭제하시겠습니까?') === true) {
      const { error } = await supabase.from('products').delete().eq('id', id);

      if (error) console.log('삭제 실패!');

      if (!error) {
        alert('삭제 완료!');
        navi('/');
      }
    } else {
      return;
    }
  };

  // 내가 소속된 채팅 방인지 판단 (마운트 시)
  const isExistsRoom = async () => {
    const { data: chat_rooms, error } = await supabase
      .from('chat_room')
      .select('*')
      .eq('about', id);

    if (chat_rooms) {
      const existsRoom = chat_rooms.filter((room) => {
        return room.participants.some((part: Participants) => {
          return part.user_id === curUser?.uid;
        });
      });
      existsRoom?.length > 0 && setIsExist(true);
    }
    // if (chat_rooms && chat_rooms.length > 0 && curUser) {
    //   const connectedRoom = chat_rooms.filter((room: RoomType) => {

    //   });
    //   if (connectedRoom && connectedRoom.length > 0) {
    //     setIsExist(true);
    //   }
    // }
  };
  // 마운트 시 유저 정보 가져옴
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

  // 마운트 시 유저 정보 가져옴
  const getTargetData = async () => {
    const { data: product, error: productError } = await supabase
      .from('products')
      .select('*')
      .eq('id', id);

    if (product) {
      const { data: targetUser, error } = await supabase
        .from('user')
        .select('*')
        .eq('uid', product[0]?.post_user_uid);

      // 현재 로그인 유저의 데이터가 있다면
      if (targetUser && targetUser.length > 0) {
        setTarget(targetUser[0]);
      }
      // 로그이 유저 없음 에러
      if (error) console.log('logined user not exists');
    }

    if (productError) console.log('작성자 정보 fetch 오류');
  };

  // 마운트 시 제품 정보 가져옴
  const getProduct = async (id: string | undefined) => {
    let { data: products, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id);
    if (error) {
      console.log(error);
    } else {
      setProduct(products);
    }
  };

  useEffect(() => {
    getUserData();
    getTargetData();
    getProduct(id);
    handleCheckIsSoldOut({ id, setIsSoldOut });
    handleGetLikeCount();
  }, []);

  useEffect(() => {
    if (curUser) {
      isLikedProduct({ curUser, id, setIsLiked });
      isExistsRoom();
    }
  }, [curUser]);

  const checkWindowSize = () => {
    if (window.matchMedia('(max-width: 768px)').matches) {
      setIsMobile(true);
    } else {
      setIsMobile(false);
    }
  };

  useEffect(() => {
    checkWindowSize();
    window.addEventListener('DOMContentLoaded', checkWindowSize);
    window.addEventListener('resize', checkWindowSize);

    return () => {
      window.removeEventListener('DOMContentLoaded', checkWindowSize);
      window.removeEventListener('resize', checkWindowSize);
    };
  });

  if (product === null) return <div>로딩 중</div>;

  const labels = ['수량', '상태', '거래 방식', '직거래 장소', '교환'];

  const data = product[0];
  const productInfo = [
    data.count,
    data.quality,
    data.deal_type,
    data.address,
    data.exchange_product,
    data.changable,
    data.shipping_cost
  ];
  return (
    <>
      {showChatList && (
        <St.StSelectChatBg onClick={() => setShowChatList(false)}>
          <St.StChatList onClick={(e) => e.stopPropagation()}>
            <StSellTitle>구매한 사용자를 선택해주세요</StSellTitle>
            {!createdChatList ||
              (createdChatList.length === 0 && (
                <h1
                  style={{
                    textAlign: 'center',
                    height: '100%'
                  }}
                >
                  채팅 내역이 없습니다
                </h1>
              ))}
            {createdChatList &&
              createdChatList?.map((room: RoomType) => {
                return (
                  <>
                    <St.StChatListItem
                      key={room.id}
                      id={
                        room.participants.filter(
                          (part: Partial<Participants>) => {
                            return part.user_id !== curUser?.id;
                          }
                        )[0].user_id
                      }
                      onClick={(e) => {
                        handleSetBuyer(e);
                        handleSelectedUser(e);
                      }}
                    >
                      <div>
                        {
                          room.participants.filter(
                            (part: Partial<Participants>) => {
                              return part.user_id !== curUser?.id;
                            }
                          )[0].user_name
                        }
                      </div>
                    </St.StChatListItem>
                    <St.StConfirmSellBtn onClick={handleSellComplete}>
                      <span>{selectedUser}</span> 님에게 판매 완료하기
                    </St.StConfirmSellBtn>
                  </>
                );
              })}
          </St.StChatList>
        </St.StSelectChatBg>
      )}
      <ToastContainer />
      {/* ///////////// 본체 //////////////// */}
      <St.StDetailContainer>
        <St.StDetailInfoSection>
          <St.StImageWrapper>
            <ProductDetailCarousel
              carouselImages={
                product[0]?.image_url === null ? [] : product[0]?.image_url
              }
            />
          </St.StImageWrapper>
          <St.StProductInfo>
            <St.StProductInfoHeader>
              <St.StUserTitlebox>
                <div
                  style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}
                >
                  <St.StUserImage>
                    {product[0].post_user_uid === curUser?.id ? (
                      <St.StProfileImages
                        $url={curUser?.avatar_url}
                      ></St.StProfileImages>
                    ) : (
                      <St.StProfileImages
                        $url={target?.avatar_url}
                      ></St.StProfileImages>
                    )}
                  </St.StUserImage>
                  <St.StUserNickname>
                    {product[0].post_user_uid === curUser?.id ? (
                      <p>
                        {curUser.nickname !== null
                          ? curUser?.nickname
                          : curUser?.username}
                      </p>
                    ) : (
                      <p>
                        {target?.nickname !== null
                          ? target?.nickname
                          : target?.username}
                      </p>
                    )}
                  </St.StUserNickname>
                </div>
              </St.StUserTitlebox>

              <St.StAlertButton>
                {product[0].post_user_uid === curUser?.uid && (
                  <>
                    <div
                      onClick={() => {
                        alert('개발 중인 기능입니다!');
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '.36rem',
                        cursor: 'pointer'
                      }}
                    >
                      <FaPencil style={{ color: 'var(--opc-100)' }} />
                      수정하기
                    </div>
                    <div
                      onClick={handleDeletePost}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '.36rem',
                        cursor: 'pointer'
                      }}
                    >
                      <FaTrash style={{ color: 'var(--opc-100)' }} />
                      삭제하기
                    </div>
                  </>
                )}
                {product[0].post_user_uid !== curUser?.uid && (
                  <>
                    {isMobile && (
                      <St.StTimeLeft>
                        {parseDate(data.created_at)}
                      </St.StTimeLeft>
                    )}
                    {!isMobile && <St.StAlertIcon />}
                    <p
                      style={{ cursor: 'pointer' }}
                      onClick={() => {
                        alert('개발 중인 기능입니다!');
                      }}
                    >
                      신고하기
                    </p>
                  </>
                )}
              </St.StAlertButton>
            </St.StProductInfoHeader>
            <St.StHeaderTitle>{data.title}</St.StHeaderTitle>
            <St.StHeaderPriceWrapper>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '2rem'
                }}
              >
                <St.StPrice>{data.price.toLocaleString('kr-KO')}원</St.StPrice>
                <div
                  style={{
                    padding: '.5rem',
                    backgroundColor: 'var(--4-gray)',
                    borderRadius: '2px',
                    fontSize: '1.2rem'
                  }}
                >
                  {data.shipping_cost}
                </div>
              </div>

              {!isMobile && (
                <St.StTimeLeft>{parseDate(data.created_at)}</St.StTimeLeft>
              )}
            </St.StHeaderPriceWrapper>
            <St.StProductInfoBody>
              <ProductDetailInfo
                labels={labels}
                productInfo={productInfo}
                data={data}
              />
              {/* 판매자에게 보여지는 버튼 */}
            </St.StProductInfoBody>
            {product[0].post_user_uid === curUser?.uid ? (
              <St.ButtonWrapper>
                <St.Button
                  $role="chat"
                  onClick={(e) => {
                    handleLoadChatRooms();
                    handleShowChatList();
                  }}
                >
                  <h3>판매 완료로 전환하기</h3>
                </St.Button>
              </St.ButtonWrapper>
            ) : (
              <St.ButtonWrapper>
                {isLiked === false ? (
                  <St.Button $role="like" onClick={handleLike}>
                    <p>
                      <St.FaHeartIcon />
                      {likesCount}
                    </p>
                  </St.Button>
                ) : (
                  // //////////////////////
                  // 실시간 좋아요 개수 반영
                  /////////////////////////
                  <St.Button $role="like" onClick={handleCancleLike}>
                    <p>
                      <FaHeart
                        style={{
                          marginBlock: '0.4rem',
                          fontSize: '2.2rem',
                          color: 'red'
                        }}
                      />
                      {likesCount}
                    </p>
                  </St.Button>
                )}

                {/* 게시물 작성자가 아닌 사람이 보이는 버튼 */}
                {/* 작성자 ID 가져오기 */}
                {isSoldOut ? (
                  <St.Button $role="sold-out">
                    <h3>판매 완료되었습니다</h3>
                  </St.Button>
                ) : isExist ? (
                  <St.Button $role="chat" onClick={() => navi('/chat')}>
                    <h3>채팅으로 이동하기</h3>
                  </St.Button>
                ) : (
                  <St.Button
                    $role="chat"
                    id={product[0]?.post_user_uid}
                    data-about={product[0]?.post_user_uid}
                    onClick={makeChatRoom}
                  >
                    <h3>채팅 보내고 구매하기</h3>
                  </St.Button>
                )}
              </St.ButtonWrapper>
            )}
          </St.StProductInfo>
        </St.StDetailInfoSection>
        <St.StProductIntroSection>
          <St.StProductIntroTitle>상품 설명</St.StProductIntroTitle>
          <St.StProductContent>{data.contents}</St.StProductContent>
          <St.StProductCategory>
            {data.tags?.map((tag: string, i: number) => {
              return <St.StCategoryTag key={i}># {tag}</St.StCategoryTag>;
            })}
          </St.StProductCategory>
        </St.StProductIntroSection>
      </St.StDetailContainer>
    </>
  );
};

export default ProductDetail;