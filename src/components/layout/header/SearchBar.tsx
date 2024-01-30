import React, {
  ChangeEvent,
  KeyboardEvent,
  SetStateAction,
  useEffect,
  useState
} from 'react';
import { useNavigate } from 'react-router';
import styled, { css } from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../redux/store/store';
import {
  setSearchQuery,
  setSearchResults
} from '../../../redux/modules/searchSlice';
import {
  ResearchResults,
  researchItems
} from '../../../pages/searchResults/researchItem';
import { FaMagnifyingGlass } from 'react-icons/fa6';
import { IoIosArrowBack, IoIosClose } from 'react-icons/io';

type SearchBarProps = {
  showSearchComp: boolean;
  setShowSearchComp: React.Dispatch<SetStateAction<boolean>>;
};

const SearchBar: React.FC<SearchBarProps> = ({
  showSearchComp,
  setShowSearchComp
}) => {
  // TODO: 굳이 전역 관리를 하는 이유는? SearchBar에서만 사용하는데?
  const { searchQuery } = useSelector((state: RootState) => state.search);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState<boolean>(false);

  const handleHideSearchComp = () => {
    setShowSearchComp(false);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    dispatch(setSearchQuery(e.target.value));
  };

  const handleSearch = async () => {
    // 공란 일 때 실행 안함.
    if (!searchQuery.trim()) {
      return;
    }

    const rresults: ResearchResults | undefined = await researchItems(
      searchQuery
    );
    if (!rresults) {
      console.error('수파베이스에 요청 중 실패:');
      return;
    }

    const { usedItemsWithImages, communityItemsWithImages } = rresults;

    dispatch(
      setSearchResults({
        usedItemResults: usedItemsWithImages || [],
        communityResults: communityItemsWithImages || []
      })
    );
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      navigate(`/search-results?q=${encodeURIComponent(searchQuery)}`);
      handleSearch();
      setShowSearchComp(false);
    }
  };

  const checkWindowSize = () => {
    // TODO: 대부분 mobile은 768px 보다 훨씬 작을 것 같네요
    if (window.matchMedia('(max-width:768px)').matches) {
      setIsMobile(true);
    } else {
      setIsMobile(false);
    }
  };

  // TODO: dependency array 를 추가하면 안되는지?
  useEffect(() => {
    checkWindowSize();
    window.addEventListener('resize', checkWindowSize);

    return () => {
      window.removeEventListener('resize', checkWindowSize);
    };
  });

  return (
    <SearchInputContainer $position={showSearchComp}>
      <div
        style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center'
        }}
      >
        {isMobile && (
          <IoIosClose
            style={{
              color: 'var(--opc-100)',
              fontSize: '3rem',
              cursor: 'pointer'
            }}
            onClick={handleHideSearchComp}
          />
        )}
        <SearchInputBar
          type="text"
          placeholder={
            isMobile
              ? '검색어 입력 후 Enter키를 누르세요.'
              : '검색어를 입력하세요.'
          }
          value={searchQuery}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
        />

        <SearchBtn onClick={handleSearch}>
          <StMagnifyGlass />

          <SearchBtnImg src={'/assets/searchbtn.png'} alt="searchbutton" />
        </SearchBtn>
      </div>
    </SearchInputContainer>
  );
};

export default SearchBar;

type MobileProps = {
  $position: boolean;
};

const SearchInputContainer = styled.div<MobileProps>`
  /* display: flex; */
  align-items: center;
  /* position: relative; */

  @media only screen and (max-width: 768px) {
    width: 100vw;
    height: 100vh;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 3000;
    transition: all 0.3s ease;
    ${(props) => {
    if (props.$position === true) {
      return css`
          display: block;
          opacity: 1;
          transform: translateX(0%);
        `;
    } else {
      return css`
          display: none;
          opacity: 0;
          transform: translateX(100%);
        `;
    }
  }};
    background-color: var(--3-gray);
    padding: 2rem;
  }
`;

const SearchInputBar = styled.input`
  width: 48.8rem;
  height: 3.7rem;
  border-radius: 1.9rem;
  padding-left: 20px;
  background: var(--3-gray, #2c2c2c);
  border: none;
  color: var(--6-gray, #717171);
  font-size: var(--fontSize-H5);
  font-weight: var(--fontWeight-medium);
  line-height: 2.4856rem;
  outline: none;
  @media screen and (max-width: 1300px) {
    width: 48.8rem;
  }
  @media screen and (max-width: 1100px) {
    width: 40rem;
  }

  @media screen and (max-width: 900px) {
    width: 30rem;
  }
  @media screen and (max-width: 768px) {
    position: relative;
    left: 46%;
    transform: translateX(-50%);
    width: 85%;
    background-color: var(--2-gray);
  }
`;

const StMagnifyGlass = styled(FaMagnifyingGlass)`
  position: absolute;
  top: 32%;
  right: 55%;
  z-index: 3;
  color: var(--opc-100);
  display: none;

  @media screen and (max-width: 768px) {
    display: block;
  }
`;

const SearchBtn = styled.button`
  border: none;
  background-color: transparent;
  position: absolute;
  right: 10px;
  width: 37px;
  height: 37px;
  cursor: pointer;

  @media screen and (max-width: 768px) {
    position: relative;
  }
`;

const SearchBtnImg = styled.img`
  width: 3.7rem;
  height: 3.7rem;
  @media screen and (max-width: 768px) {
    display: none;
  }
`;
