import React from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import styled from 'styled-components';
import { StPostContentsWrapper } from '../../styles/mypageStyle/CommunityCardStyle';

interface SkeletonCommunityCardProps {
  cards: number;
}

const SkeletonCommunityCard: React.FC<SkeletonCommunityCardProps> = ({
  cards
}) => {
  return (
    <>
      {Array(cards)
        .fill(0)
        .map((item) => (
          <div key={item.id}>
            <SkeletonTheme baseColor="#ebebeb" highlightColor="#cccccc">
              <StPostSkeletonContainer>
                <Skeleton width={300} height={25} />

                <StPostSkeletonWrapper>
                  <Skeleton width={70} height={70} />
                  <StPostSkeletonContentWrapper>
                    <Skeleton width={300} />
                    <Skeleton width={300} />
                  </StPostSkeletonContentWrapper>
                </StPostSkeletonWrapper>

                <StPostSkeletonIconAndDate>
                  <Skeleton width={100} />
                  <Skeleton width={100} />
                </StPostSkeletonIconAndDate>
              </StPostSkeletonContainer>
            </SkeletonTheme>
          </div>
        ))}
    </>
  );
};

export default SkeletonCommunityCard;

const StPostSkeletonContainer = styled.div`
  background-color: #e2e2e288;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  gap: 1.5rem;
  border-radius: 1rem;
  padding: 3rem;
`;

const StPostSkeletonWrapper = styled.div`
  display: flex;
  gap: 1rem;
`;

const StPostSkeletonContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
`;

const StPostSkeletonIconAndDate = styled.div`
  display: flex;
  justify-content: space-between;
`;
