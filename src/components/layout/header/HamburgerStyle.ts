import { Link } from 'react-router-dom';
import styled from 'styled-components';

const HamburgerModalContainer = styled.div<{ $isOpen: boolean }>`
  display: ${({ $isOpen }) => ($isOpen ? 'block' : 'none')};
  position: absolute;
  width: 30%;
  height: 60rem;
  top: 0;
  right: 0;
  padding: 1.5rem;
  border: 0.1px solid var(--opc-100);
  border-radius: 1rem;
  background-color: #fffefa;
  z-index: 1000;
  @media screen and (max-width: 768px) {
    width: 30%;
  }
  @media screen and (max-width: 570px) {
    width: 40%;
  }
  @media screen and (max-width: 440px) {
    width: 50%;
  }
`;
const CloseHamburger = styled.div`
  border-bottom: 1px solid var(--4-gray);
  display: flex;
  justify-content: right;
  align-items: center;
  margin: auto 0;
`;
const UserInfo = styled.div`
  cursor: pointer;
  display: flex;
  border-bottom: 1px solid var(--4-gray);
  justify-content: center;
  margin: 0 auto;
  padding: 1rem;
  img {
    border-radius: 50%;
    width: 8rem;
    height: 8rem;
  }
`;
const NavToBoard = styled.div`
  display: flex;
  flex-direction: column;
  padding-top: 1rem;
`;

const NavToProducts = styled(Link)`
  text-decoration: none;
  color: var(--black);
  display: flex;
  margin-top: 2rem;
  gap: 0.5rem;
  svg {
    color: var(--opc-100);
  }
  &:hover {
    font-weight: var(--fontWeight-bold);
  }
`;

const NavToCommunity = styled(Link)`
  text-decoration: none;
  color: var(--11-gray);
  display: flex;
  margin-top: 2rem;
  gap: 0.5rem;
  svg {
    color: var(--opc-100);
  }
  &:hover {
    font-weight: var(--fontWeight-bold);
  }
`;

const UserMenu = styled.div`
  cursor: pointer;
  border-top: 1px solid var(--4-gray);
  display: flex;
  flex-direction: column;
  gap: 3rem;
`;
const NavToMypage = styled(Link)`
  text-decoration: none;
  color: var(--11-gray);
  display: flex;
  gap: 0.5rem;
  margin-top: 3rem;

  svg {
    color: var(--opc-100);
  }
  &:hover {
    font-weight: var(--fontWeight-bold);
  }
`;

const NavToChatRoom = styled(Link)`
  text-decoration: none;
  color: var(--11-gray);
  display: flex;
  gap: 0.5rem;

  svg {
    color: var(--opc-100);
  }
  &:hover {
    font-weight: var(--fontWeight-bold);
  }
`;
const Logout = styled.div`
  cursor: pointer;
  display: flex;
  gap: 0.5rem;

  svg {
    color: var(--opc-100);
    font-weight: var(--fontWeight-bold);
  }
  &:hover {
    font-weight: var(--fontWeight-bold);
  }
`;

const HrStyle = styled.hr`
  width: 100%;
  height: 0.01rem;
  border: none;
  background-color: var(--opc-100);
  margin-top: 3rem;
`;

export {
  HamburgerModalContainer,
  CloseHamburger,
  UserInfo,
  NavToBoard,
  NavToProducts,
  NavToCommunity,
  UserMenu,
  NavToMypage,
  NavToChatRoom,
  Logout,
  HrStyle
};
