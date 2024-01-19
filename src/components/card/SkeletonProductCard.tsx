import React from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import styled from 'styled-components';

interface SkeletonProductCardProps {
  cards: number;
}

const SkeletonProductCard: React.FC<SkeletonProductCardProps> = ({ cards }) => {
  return (
    <>
      {Array(cards)
        .fill(0)
        .map((item) => (
          <div key={item.id}>
            <SkeletonTheme baseColor="#ebebeb" highlightColor="#cccccc">
              <StCardWrapper>
                <Skeleton width={200} height={200} />
                <Skeleton width={90} />
                <Skeleton width={180} />
                <Skeleton width={100} />
              </StCardWrapper>
            </SkeletonTheme>
          </div>
        ))}
    </>
  );
};

export default SkeletonProductCard;

export const StCardWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
`;
