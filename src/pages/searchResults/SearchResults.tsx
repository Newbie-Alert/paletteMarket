import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { supabase } from '../../api/supabase/supabaseClient';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store/store';
import { Communityy, UsedItem } from '../usedtypes';
import styled from 'styled-components';

const SearchResults: React.FC = () => {
  const { usedItemResults, communityResults } = useSelector(
    (state: RootState) => state.search.searchResults
  );
  const searchQuery = useSelector(
    (state: RootState) => state.search.searchQuery
  );

  const [usedItemsWithImages, setUsedItemsWithImages] = useState<UsedItem[]>(
    []
  );
  const [communityItemsWithImages, setCommunityItemsWithImages] = useState<
    Communityy[]
  >([]);

  useEffect(() => {
    const fetchSearchResults = async () => {
      try {
        // 중고 게시물 이미지 URL 가져오기
        const usedItemsImages = await Promise.all(
          usedItemResults.map(async (item) => {
            const pathToImage = `pictures/${item.image_Url}.png`;
            const { data } = await supabase.storage
              .from('picture')
              .getPublicUrl(pathToImage);
            return { ...item, data };
          })
        );

        // 커뮤니티 게시물 이미지 URL 가져오기
        const communityItemsImages = await Promise.all(
          communityResults.map(async (item) => {
            const pathToImage = `pictures/${item.image_Url}.png`;
            const { data } = await supabase.storage
              .from('community_picture')
              .getPublicUrl(pathToImage);
            return { ...item, data };
          })
        );

        setUsedItemsWithImages(usedItemsImages);
        setCommunityItemsWithImages(communityItemsImages);
      } catch (error) {
        console.error('수파베이스에 요청 중 실패:', error);
        throw error;
      }
    };

    if (searchQuery) {
      fetchSearchResults();
    }
  }, [searchQuery, usedItemResults, communityResults]);

  const usedItemCount = usedItemResults.length;
  const communityCount = communityResults.length;

  return (
    <SearchResultsContainer>
      <SearchResultsCountContainer>
        <CheckImage src="/assets/checkresults.png" alt="검색결과" />
        <FullCounts>
          {usedItemCount + communityCount}개의 결과가 검색되었어요
        </FullCounts>
      </SearchResultsCountContainer>
      <ResultListContainer>
        <UsedItemResultsContainer>
          <CountBar>
            <CountList>{usedItemCount}개의 상품이 거래되고 있어요</CountList>
            <LinktoUsedProducts to="/products">
              <img
                className="products-button"
                src="/assets/linktoproducts.png"
                alt="중고게시판 이동"
              />
            </LinktoUsedProducts>
          </CountBar>
          <UsedItemsList>
            {usedItemsWithImages.slice(0, 5).map((item) => (
              <ToProductsPage key={item.id} to={`/products/detail/${item.id}`}>
                <ProductList>
                  {item.image_Url && <img src={item.image_Url} alt="Item" />}
                  <h1>{item.quality}</h1>
                  <h3>{item.title}</h3>
                  <p>{item.price}원</p>
                </ProductList>
              </ToProductsPage>
            ))}
          </UsedItemsList>
        </UsedItemResultsContainer>
        <CommunityResultsContainer>
          <CountBar>
            <CountList>{communityCount}개의 이야기가 있어요</CountList>
            <LinktoCommunityPosts to="/community">
              <img
                className="commu-button"
                src="/assets/linktoproducts.png"
                alt="커뮤니티 게시판 이동"
              />
            </LinktoCommunityPosts>
          </CountBar>
          <CommunityPostsList>
            {communityItemsWithImages.slice(0, 6).map((item) => (
              <ToCommunityPage
                key={item.post_id}
                to={`/community/detail/${item.post_id}`}
              >
                <PostList>
                  <Content>
                    <div>{item.title}</div>
                    <span>
                      {item.image_Url && (
                        <img src={item.image_Url} alt="Community Post" />
                      )}
                      <p>{item.content}</p>
                    </span>
                  </Content>
                </PostList>
              </ToCommunityPage>
            ))}
          </CommunityPostsList>
        </CommunityResultsContainer>
      </ResultListContainer>
    </SearchResultsContainer>
  );
};

export default SearchResults;

const SearchResultsContainer = styled.div`
  display: flex;
  width: 1440px;
  flex-direction: column;
  margin: 0px auto;
  color: #f8f8f8;
  background-color: #131313;
`;

const SearchResultsCountContainer = styled.div`
  margin: 0px auto;
  margin-top: 60px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;
const CheckImage = styled.img`
  margin: 0px auto;
  width: 66px;
  height: 66px;
`;
const FullCounts = styled.div`
  margin-top: 20px;
  font-size: 24px;
  font-weight: 800;
`;
const ResultListContainer = styled.div`
  display: flex;
  flex-direction: column;
  border-top: 1px solid #717171;
  margin: 60px 162px;
  margin-bottom: 130px;
`;
const UsedItemResultsContainer = styled.div`
  margin-top: 20px;
  width: 100%;
`;
const CountBar = styled.div`
  display: flex;
  justify-content: space-between;
`;

const CountList = styled.h1`
  display: flex;
  font-size: 20px;
  align-items: center;
`;
const LinktoUsedProducts = styled(Link)`
  text-decoration: none;
  cursor: pointer;
  font-weight: bold;
  .products-button {
    height: 31px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;
const UsedItemsList = styled.ul`
  width: 1116px;
  height: 315px;
  display: flex;
  flex-wrap: wrap;
  margin-top: 20px;
  gap: 19px;
`;
const ToProductsPage = styled(Link)`
  text-decoration: none;
  cursor: pointer;
  color: #f8f8f8;
`;
const ProductList = styled.li`
  display: flex;
  flex: 0 0 calc(20% - 19px);
  width: 100%;
  height: 315px;
  flex-direction: column;
  img {
    width: 100%;
    height: 208px;
    object-fit: cover;
    border-style: none;
  }
  h1 {
    width: 90px;
    padding: 8px;
    color: #cccccc;
    text-align: center;
    background-color: rgba(219, 255, 0, 0.2);
    border-radius: 3px;
    margin-top: 10px;
    font-weight: bold;
  }
  h3 {
    font-size: 16px;
    margin-top: 30px;
  }

  p {
    font-size: 16px;
    font-weight: bold;
    margin-top: 10px;
    text-align: left;
  }
`;
const CommunityResultsContainer = styled.div`
  width: 100%;
  height: 715px;
  margin-top: 80px;
`;
const LinktoCommunityPosts = styled(Link)`
  text-decoration: none;
  cursor: pointer;
  font-weight: bold;
  .commu-button {
    height: 31px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;
const CommunityPostsList = styled.ul`
  width: 1116px;
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-top: 20px;
`;
const ToCommunityPage = styled(Link)`
  text-decoration: none;
  cursor: pointer;
  color: #f8f8f8;
`;
const PostList = styled.li`
  display: flex;
  flex: 0 0 calc(50% - 20px);
  width: 546px;
  height: 225px;
  background-color: #1f1f1f;
`;
const Content = styled.div`
  margin: 24px 30px;
  div {
    font-size: 20px;
    font-weight: bold;
  }
  img {
    width: 66px;
    height: 66px;
    margin-top: 10px;
    border: none;
    border-radius: 5px;
    background-color: #d9d9d9;
  }
  p {
    margin-top: 10px;
    display: flex;
    align-items: flex-start;
    font-size: 15px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    line-height: 1.6;
  }
  span {
    display: flex;
    justify-content: space-between;
  }
`;
