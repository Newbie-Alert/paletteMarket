import styled, { css, keyframes } from 'styled-components';
import { RoomStyledProps } from '../../components/chat/types';
import { IoIosArrowBack } from 'react-icons/io';

export const StFadeAni = keyframes`
  from{
    opacity: 0;
    transform: translateX(-5%);
  }

  to {
    opacity: 1;
    transform: translateX(0%);
  }
`;

const StChatWrapper = styled.div`
  width: 100%;
  max-width: 1114px;
  padding: 4.2rem 1.6rem;
  margin: auto;

  @media screen and (max-width: 768px) {
    width: 100%;
    max-width: 768px;
    overflow: hidden;
  }
`;

const StChatContainer = styled.div`
  width: 100%;
  height: 100%;
  max-width: 1114px;
  max-height: 958px;
  display: flex;
  border-top: 0.3rem solid var(--3-gray);
  border-bottom: 0.3rem solid var(--3-gray);
  margin: auto;
  animation: ${StFadeAni} 0.6s forwards;
  font-family: 'Pretendard-Regular';

  @media screen and (max-width: 768px) {
    width: 100%;
    max-width: 768px;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    border: 0.1rem solid var(--3-gray);
  }
`;

const StChatList = styled.div`
  width: 100%;
  height: 597px;
  max-width: 372px;
  max-height: 597px;
  display: flex;
  flex-direction: column;
  overflow-y: scroll;
  border-right: 0.3rem solid var(--3-gray);

  @media screen and (max-width: 768px) {
    width: 100%;
    max-width: 768px;
    border-right: none;
  }
`;

const StChatListItem = styled.div`
  width: 100%;
  max-width: 372px;
  @media screen and (max-width: 768px) {
    width: 100%;
    max-width: 768px;
  }
`;

type BoardProps = {
  $position: number;
};

const StChatBoard = styled.div<BoardProps>`
  width: 70%;
  height: 597px;
  overflow-y: hidden;
  position: relative;

  @media screen and (max-width: 768px) {
    width: 100%;
    max-width: 768px;
    height: 100%;
    max-height: 640px;
    position: absolute;
    top: 0;
    left: 0;
    transition: all 0.3s ease;
    transform: ${(props) => `translateX(${props.$position}%)`};
    z-index: 3;
    padding-bottom: 1rem;
  }
`;

const StChatGround = styled.div`
  width: 100%;
  height: 100%;
  overflow-y: scroll;
  padding: 1rem 0 15rem 0;

  @media screen and (max-width: 768px) {
    padding: 1rem 0 11rem 0;
    background-color: var(--2-gray);
    max-height: 620px;
  }
`;

const StChatBoardHeader = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: sticky;
  top: 0;
  left: 0;
  padding: 2.7rem;
  background-color: transparent;
  border-bottom: 0.3rem solid var(--3-gray);

  @media screen and (max-width: 768px) {
    background-color: var(--2-gray);
    padding: 1rem 1.5rem;
  }
`;

const StChatBoardHeaderName = styled.h3`
  font-size: 2rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 1rem;

  @media screen and (max-width: 768px) {
    font-size: 1.4rem;
  }
`;

const StChatForm = styled.form`
  width: 100%;
  background-color: var(--bgColor);
  position: sticky;
  bottom: 0;
  padding-bottom: 1rem;

  @media screen and (max-width: 768px) {
    width: 100%;
    margin: auto;
    bottom: -1rem;
    background-color: var(--2-gray);
    padding: 1rem;
  }
`;

const ImageInput = styled.input.attrs({ type: 'file' })`
  width: fit-content;
  padding: 1rem;
  margin-left: 2.5rem;
  margin-bottom: 1rem;
  background-color: var(--3-gray);
  border-radius: 0.6rem;
  @media screen and (max-width: 768px) {
    margin-left: 0;
  }
`;

const StChatInput = styled.textarea.attrs({
  placeholder: '채팅을 입력하세요'
})`
  width: 100%;
  max-width: 688px;
  max-height: 53px;
  margin: auto;
  color: var(--11-gray);
  padding: 1.8rem 1rem 1rem 1.5rem;
  position: sticky;
  bottom: 0;
  border: none;
  font-weight: 600;
  outline: none;
  border-radius: 0.8rem;
  background-color: var(--3-gray);
  resize: none;
  &::placeholder {
    font-weight: 500;
  }
`;

const StListRoom = styled.div<RoomStyledProps>`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 0.8rem;
  padding: 1.25rem;
  cursor: pointer;
  ${(props) => {
    if (props.$current === props.children) {
      return css`
        background-color: #eee;
      `;
    }
  }}
  &:hover {
    background-color: var(--3-gray);
  }
  position: relative;

  @media screen and (max-width: 768px) {
    width: 100%;
    max-width: 768px;
  }
`;

const StListUpper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  font-size: 1.6rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

const StListLower = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 1rem;
  font-weight: 600;

  p {
    font-size: 1.2rem;
    font-weight: 500;
    margin-left: 3rem;
  }
  span {
    color: var(--6-gray);
    font-size: 1.2rem;
  }
`;

type ChatProfileType = {
  $url: string;
};

const StListUserProfile = styled.div<ChatProfileType>`
  width: 21px;
  height: 21px;
  border-radius: 50px;
  background: ${(props) => (props.$url ? css`url(${props.$url})` : '#d9d9d9')};
  background-size: cover;

  @media screen and (max-width: 768px) {
    width: 24px;
    height: 24px;
  }
`;

const StUserInfoBox = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 1rem;

  @media screen and (max-width: 768px) {
    font-size: 1.4rem;
  }
`;

const StUnreadCount = styled.div`
  width: fit-content;
  height: fit-content;
  text-align: center;
  padding: 0.3rem 0.6rem;
  border-radius: 50px;
  color: var(--2-gray);
  background-color: var(--opc-100);

  @media screen and (max-width: 768px) {
    font-size: 1.2rem;
  }
`;

const StListBody = styled.div`
  display: 'flex';
  flex-direction: 'column';
  gap: '0.6rem';
  height: 'fit-content';
`;

const StImageViewerBg = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  gap: 1rem;
  position: absolute;
  top: 0;
  left: 0;
  background-color: #1d1d1d90;
  z-index: 3;

  @media screen and (max-width: 768px) {
    width: 100%;
    height: 100%;
  }
`;

const StImageViewer = styled.div`
  width: 1200px;
  height: 80%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 3;
  background-color: #1d1d1d;
  margin: auto;
  text-align: center;

  &::before {
    content: 'X';
    position: absolute;
    top: 3%;
    right: 2%;
    color: var(--primary-color);
    font-size: 2rem;
    cursor: pointer;
    z-index: 3;
  }

  @media screen and (max-width: 768px) {
    width: 100%;
    height: 50%;
  }
`;

const StViewerImg = styled.img`
  max-width: 100%;
  max-height: 100%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  object-fit: cover;
`;

const StMenuBox = styled.div`
  width: 200px;
  height: fit-content;
  position: absolute;
  top: 50%;
  right: 8%;
  z-index: 5;
  background-color: #1d1d1d;
`;

const StMenu = styled.div`
  width: 100%;
  padding: 1.25rem;
  font-weight: 600;
  color: white;
  cursor: pointer;

  &:hover {
    color: var(--opc-100);
    background-color: var(--1-gray);
  }
`;

//////////////////////////////////

const StUserProfile = styled.div<ChatProfileType>`
  width: 28px;
  height: 28px;
  border-radius: 50px;
  background: ${(props) => (props.$url ? css`url(${props.$url})` : '#d9d9d9')};
  background-size: cover;
`;

const StHeaderArrow = styled(IoIosArrowBack)`
  font-size: 2.5rem;
  height: max-content;
  margin-right: 0.5rem;
  color: var(--opc-100);
  cursor: pointer;
  display: none;

  @media only screen and (max-width: 768px) {
    display: block;
  }
`;

export {
  StChatWrapper,
  StChatContainer,
  StChatList,
  StChatListItem,
  StListRoom,
  StChatBoard,
  StChatGround,
  StChatBoardHeader,
  StChatBoardHeaderName,
  StChatForm,
  ImageInput,
  StChatInput,
  StListUserProfile,
  StUserInfoBox,
  StUnreadCount,
  StListBody,
  StListUpper,
  StListLower,
  StImageViewerBg,
  StImageViewer,
  StViewerImg,
  StMenuBox,
  StMenu,
  StUserProfile,
  StHeaderArrow
};
