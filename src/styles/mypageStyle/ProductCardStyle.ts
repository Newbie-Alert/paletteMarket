import styled from 'styled-components';

export const StCardContainer = styled.div`
  width: 1200px;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 30px;
  margin: 0 auto;
`;

export const StCardWrapper = styled.div`
  border: 1px solid black;
  width: 210px;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const StProductQuality = styled.p`
  background-color: #cf0;
  display: inline;
  padding: 4px 16px;
  font-size: 13px;
  border-radius: 20px;
`;

export const StProductImage = styled.img`
  width: 100%;
`;

export const StProductTitle = styled.p``;

export const StProductPrice = styled.p`
  font-weight: bold;
`;
