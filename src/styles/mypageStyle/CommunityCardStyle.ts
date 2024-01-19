import styled from 'styled-components';

export const StPostContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
`;

export const StPostWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  gap: 1.5rem;
  background: #1f1f1f;
  border-radius: 1rem;
  padding: 3rem;

  & span {
    color: #9d9d9d;
    font-size: 1.2rem;
  }
`;

export const StPostTitle = styled.p`
  font-size: 1.8rem;
  color: #f8f8f8;
`;

export const StPostContentsWrapper = styled.div`
  display: flex;
  flex-direction: row;
  gap: 1rem;
`;

export const StPostImage = styled.img`
  width: 7rem;
  height: 7rem;
  border-radius: 5px;
`;

export const StPostContent = styled.p`
  font-size: 1.4rem;
  color: #b6b6b6;
`;

export const StIconAndDateWrapper = styled.div`
  display: flex;
  justify-content: space-between;
`;

export const StIconContainer = styled.div`
  & span {
    margin-right: 0.5rem;
  }
`;

export const StPostDate = styled.p`
  color: #717171;
  font-size: 1.2rem;
`;
