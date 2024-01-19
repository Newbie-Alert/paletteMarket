import { Link } from 'react-router-dom';
import styled from 'styled-components';

export const HeaderContainer = styled.header`
  width: 1440px;
  height: 148px;
  display: flex;
  flex-direction: column;
  padding: 10px 20px;
  margin: 0px auto;
  background-color: #131313;
  border: 3px solid #d9d9d9;
`;

export const HeaderSection = styled.section`
  display: flex;
  justify-content: space-between;
  margin: 30px 100px;
`;
export const Logo = styled.div`
  font-size: 30px;
  cursor: pointer;
  user-select: none;
`;
export const ButtonContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;
export const Button = styled.button`
  border-radius: 5px;
`;
export const UserIcon = styled.img`
  border-radius: 50%;
  width: 50px;
  height: 50px;
  cursor: pointer;
`;

export const NavSection = styled.section`
  display: flex;
  justify-content: space-between;
  margin: 0px 100px;
`;
export const NavBar = styled.nav`
  display: flex;
  justify-content: center;
  align-items: center;
`;
export const NavButton = styled(Link)`
  text-decoration: none;
  margin-right: 10px;
  cursor: pointer;
  color: #f8f8f8;
  font-size: 18px;
`;
export const SearchBar = styled.div``;
