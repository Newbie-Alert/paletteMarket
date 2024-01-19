import styled from 'styled-components';

export const StProfileContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 2rem;
  margin: 2rem 0;
  background: #dcffb7;
  border-radius: 1rem;
`;

export const StProfileWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

export const StProfileImage = styled.img`
  width: 187px;
  height: 187px;
  border-radius: 50%;
`;

export const StNickname = styled.p`
  font-size: 22px;
  font-weight: bold;
`;

export const StNicknameInput = styled.input`
  background-color: orange;
`;

export const StUsername = styled.p`
  font-size: 16px;
`;

export const StButtonWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const StEditProfileButton = styled.button``;

export const StEmail = styled.p`
  font-size: 16px;
`;
