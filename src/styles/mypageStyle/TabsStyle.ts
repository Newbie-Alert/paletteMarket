import styled from 'styled-components';

export const TabsContainer = styled.ul`
  background-color: bagie;
  display: flex;
  cursor: pointer;
  background: #ff9843;
  padding: 2rem;
  border-radius: 0.8rem;
  margin: 2rem 0;
  gap: 2rem;
`;

export const Tab = styled.li<{ active: number }>`
  font-weight: ${(props) =>
    props.active === props.tabIndex ? 'bold' : 'normal'};
`;
