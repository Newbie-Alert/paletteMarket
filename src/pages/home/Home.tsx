import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Communityy, UsedItem } from '../usedtypes';
import { supabase } from '../../api/supabase/supabaseClient';
import { useQuery } from 'react-query';
import { useNavigate } from 'react-router';
import { Link } from 'react-router-dom';
import InfiniteCarousel from '../../components/slider/InfiniteCarousel';
type UsedItemsCountData = {
  count: number | null;
  data: {
    length: number;
  } | null;
};
// 중고게시물 및 커뮤니티 게시물 + 사진 받아오는 로직
export const fetchData = async (): Promise<{
  usedItems: UsedItem[];
  communityItems: Communityy[];
}> => {
  try {
    const { data: usedItemsData, error: usedItemsError } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5);

    const { data: communityItemsData, error: communityItemsError } =
      await supabase
        .from('community')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(6);

    if (usedItemsError || communityItemsError) {
      console.error(
        '데이터 베이스에 요청을 실패하였습니다:',
        usedItemsError || communityItemsError
      );
      return { usedItems: [], communityItems: [] };
    }

    const usedItemsWithImages = await Promise.all(
      usedItemsData.map(async (item) => {
        const pathToImage = `pictures/${item.image_Url}.png`;
        const { data } = supabase.storage
          .from('picture')
          .getPublicUrl(pathToImage);
        return { ...item, data };
      })
    );

    const communityItemsWithImages = await Promise.all(
      communityItemsData.map(async (item) => {
        const pathToImage = `pictures/${item.image_Url}.png`;
        const { data } = supabase.storage
          .from('community_picture')
          .getPublicUrl(pathToImage);
        return { ...item, data };
      })
    );

    return {
      usedItems: usedItemsWithImages || [],
      communityItems: communityItemsWithImages || []
    };
  } catch (error) {
    console.error('수파베이스에 요청 중 실패:', error);
    throw error;
  }
};

const Home = () => {
  const [showScrollButton, setShowScrollButton] = useState(false);

  // 처음 홈화면이 로딩되었을때 현 사용자의 ID를 가져와 로컬스토리지에 담는 로직 시작 //
  const getUserId = async () => {
    const { data, error } = await supabase.auth.getUser();
    if (data && data.user) {
      localStorage.setItem('userId', data.user.id);
    }
  };

  useEffect(() => {
    getUserId();
  }, []);
  // 처음 홈화면이 로딩되었을때 현 사용자의 ID를 가져와 로컬스토리지에 담는 로직 시작 끝 //

  // 중고게시물 전체 데이터 개수를 가져오는 쿼리
  const {
    data: usedItemsCountData,
    isLoading: usedItemsCountLoading,
    isError: usedItemsCountError
  } = useQuery<UsedItemsCountData>('usedItemsCount', async () => {
    const count = await supabase.from('products').select('*');
    return count;
  });

  const {
    data: { usedItems = [], communityItems = [] } = {},
    isLoading,
    isError
  } = useQuery('data', fetchData);
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>데이터 불러오기를 실패했습니다.</div>;
  }

  const carouselImages: string[] = [
    process.env.PUBLIC_URL + '/assets/carousel1.png',
    process.env.PUBLIC_URL + '/assets/carousel2.png',
    process.env.PUBLIC_URL + '/assets/carousel3.png'
  ];

  return (
    <HomeContainer>
      <CarouselWrapper>
        <InfiniteCarousel carouselImages={carouselImages} />
      </CarouselWrapper>

      <HomeSection>
        <div className="one">
          <div>
            {<span>{usedItemsCountData?.data?.length}개</span>}의 상품이
            거래되고 있어요!
          </div>
          <LinktoProducts to="/products">전체보기</LinktoProducts>
        </div>
        {/* {showScrollButton && (
          <ScrollToTopButton onClick={scrollToTop}>
            <img
              src={process.env.PUBLIC_URL + '/assets/upbutton.png'}
              alt="상단으로 이동"
            />
          </ScrollToTopButton>
        )} */}
        <SupabaseListContainer>
          {usedItems.map((item) => (
            <TousedItemDetailPage
              key={item.id}
              to={`/products/detail/${item.id}`}
            >
              <SupabaseList>
                {item.image_Url && <img src={item.image_Url} alt="Item" />}

                <h1>{item.quality}</h1>
                <h3>{item.title}</h3>
                <p>{item.price}원</p>
              </SupabaseList>
            </TousedItemDetailPage>
          ))}
        </SupabaseListContainer>
      </HomeSection>

      <ComunityContainer>
        <Communitytitle>
          <h2>작업자들의 커뮤니티에 함께해볼까요?</h2>
          <CommunityLink to="/community">전체보기</CommunityLink>
        </Communitytitle>
        <ComunityWrapper>
          {communityItems.map((item) => (
            <ToCommunityDetailPage
              key={item.post_id}
              to={`/community/detail/${item.post_id}`}
            >
              <ComunityList>
                <div className="commupic">
                  {item.image_Url ? (
                    <img src={item.image_Url} alt="Community Post" />
                  ) : (
                    <img
                      src={process.env.PUBLIC_URL + '/assets/defaultuser.png'}
                      alt="Default User"
                    />
                  )}
                </div>
                <div className="commucontent">
                  <h3>{item.title}</h3>
                  <p>{item.content}</p>
                </div>
              </ComunityList>
            </ToCommunityDetailPage>
          ))}
        </ComunityWrapper>
      </ComunityContainer>
    </HomeContainer>
  );
};
export default Home;

const HomeContainer = styled.section`
  display: flex;
  width: 1440px;
  height: 1870px;
  flex-direction: column;
  margin: 0px auto;
`;

const CarouselWrapper = styled.div`
  width: 100%;
  cursor: pointer;
`;
const HomeSection = styled.div`
  width: 1116px;
  margin: 0 auto;
  margin-top: 40px;

  span {
    font-weight: bold;
  }
  .one {
    display: flex;
    justify-content: space-between;
    margin: 0 10px;
  }

  h2 {
    text-align: left;
    margin-top: 20px;
    margin-left: 10px;
  }
`;

const LinktoProducts = styled(Link)`
  text-decoration: none;
  color: #000;
  cursor: pointer;
  font-weight: bold;
`;

const SupabaseListContainer = styled.ul`
  width: 100%;
  height: 315px;
  display: flex;
  flex-wrap: nowrap;
  margin-top: 20px;
`;
const SupabaseList = styled.li`
  flex: 1 0 calc(20% - 20px);
  width: 100%;
  height: 315px;
  padding: 10px;
  display: flex;
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
    color: #656464;
    text-align: center;
    background-color: rgba(255, 122, 0, 0.1);
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
const TousedItemDetailPage = styled(Link)`
  text-decoration: none;
  cursor: pointer;
  color: black;
`;

const ComunityContainer = styled.div`
  width: 1116px;
  display: flex;
  flex-wrap: wrap;
  margin: 0 auto;
  margin-top: 40px;
`;

const Communitytitle = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  margin-top: 80px;
`;
const CommunityLink = styled(Link)`
  text-decoration: none;
  color: #000;
  cursor: pointer;
  font-weight: bold;
`;

const ComunityWrapper = styled.ul`
  width: 100%;
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  background-color: transparent;
`;

const ToCommunityDetailPage = styled(Link)`
  text-decoration: none;
  color: #000;
  cursor: pointer;
  font-weight: bold;
`;

const ComunityList = styled.li`
  display: flex;
  /* justify-content: space-between; */
  align-items: center;
  /* width: 100%; */
  height: 120px;
  border: 1px solid #ccc;
  border-radius: 10px;
  margin-top: 20px;
  /* margin-bottom: 20px; */
  background-color: #d9d9d9;
  /* .commupic {
    width: 100px;
  } */
  img {
    width: 80px;
    height: 80px;
    object-fit: cover;
    border-radius: 50%;
    margin-left: 30px;
  }
  .commucontent {
    margin-left: 15px;
  }
  h3 {
    font-size: 18px;
    margin-bottom: 10px;
  }

  p {
    font-size: 16px;
    color: #555;
  }
`;
