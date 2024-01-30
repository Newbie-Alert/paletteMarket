import React, { useEffect, useState } from 'react';
import styled, { css } from 'styled-components';
import { supabase } from '../../api/supabase/supabaseClient';
import { useQuery } from 'react-query';
import { fetchData } from '../../components/main/DataFetch';
import { Link } from 'react-router-dom';
import InfiniteCarousel from '../../components/slider/InfiniteCarousel';
import parseDate from '../../util/getDate';
import { FaArrowRight } from 'react-icons/fa6';
import { StFadeAni } from '../../pages/productsDetail/style';

type UsedItemsCountData = {
  count: number | null;
  data: {
    length: number;
  } | null;
};


const getUserId = async () => {
  const { data, error } = await supabase.auth.getUser();
  if (data && data.user) {
    localStorage.setItem('userId', data.user.id);
  }
};

const Home = () => {
  const carouselImages: string[] = [
    process.env.PUBLIC_URL + '/assets/carouselmain.png',
    process.env.PUBLIC_URL + '/assets/carousel0.png',
    process.env.PUBLIC_URL + '/assets/carousel1.png',
    process.env.PUBLIC_URL + '/assets/carousel2.png',
    process.env.PUBLIC_URL + '/assets/carousel3.png'
  ];
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  // 처음 홈화면이 로딩되었을때 현 사용자의 ID를 가져와 로컬스토리지에 담는 로직 시작 (중감자동무)//
  // TODO: 밖으로 뺴기
  // const getUserId = async () => {
  //   const { data, error } = await supabase.auth.getUser();
  //   if (data && data.user) {
  //     localStorage.setItem('userId', data.user.id);
  //   }
  // };

  useEffect(() => {
    getUserId();
  }, []);
  // 처음 홈화면이 로딩되었을때 현 사용자의 ID를 가져와 로컬스토리지에 담는 로직 시작 끝 (중감자동무)//

  // 전체 데이터 개수를 가져오는 쿼리

  // 중고게시물 전체 데이터 개수를 가져오는 쿼리
  const {
    data: usedItemsCountData,
    isLoading: usedItemsCountLoading,
    isError: usedItemsCountError
  } = useQuery<UsedItemsCountData>('usedItemsCount', async () => {
    // https://supabase.com/docs/reference/javascript/select -> 숫자만 가져오는 것이 더 좋을 듯. 용량, 네트워크 문제
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

  const handleText = (content: string): string => {
    // 정규 표현식을 사용하여 태그를 제외한 텍스트만 추출
    const textOnly = content.replace(/<[^>]*>|&nbsp;/g, ' ');
    return textOnly;
  };

  return (
    <HomeContainer>
      <CarouselWrapper>
        <InfiniteCarousel carouselImages={carouselImages} />
      </CarouselWrapper>
      <AllCardContainer>
        <ProductsContainer>
          <ProductsTitle>
            <div>
              {usedItemsCountData?.data?.length}개의 상품이 거래되고 있어요!
            </div>
            <ProductsLink to="/products">
              전체보기
              <FaArrowRight />
            </ProductsLink>
          </ProductsTitle>
          {/* TODO: 차라리 상품 컴포넌트, 커뮤니티 컴포넌트를 다 나누면 보기 깔끔하지 않을까? 한 페이지에서 모든 것들을 하고 있으니 파악이 힘들 것 같음 */}
          <ProductsListContainer>
            {/* 지금 데이터 6개 가져오고 있는데, 모바일에서는 6개, 웹에서는 5개 보여져야함 */}
            {usedItems.slice(0, isMobile ? 6 : 5).map((item) => (
              <ToUsedItemDetailPage
                key={item.id}
                to={`/products/detail/${item.id}`}
              >
                <ProductsList>
                  {item.image_url && item.image_url.length !== undefined ? (
                    <div className="imageWrapper">
                      <img src={item.image_url[0]} alt="Item" />
                    </div>
                  ) : (
                    <svg
                      width="208"
                      height="208"
                      viewBox="0 0 208 208"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <rect width="208" height="208" rx="15" fill="#F8F8F8" />
                    </svg>
                  )}

                  <ProductsCardQuality
                    $quality={item.quality}
                    key={item.quality}
                  >
                    {item.quality}
                  </ProductsCardQuality>
                  <h3>{item.title}</h3>
                  <p>{item.price.toLocaleString('kr-KO')}원</p>
                </ProductsList>
              </ToUsedItemDetailPage>
            ))}
          </ProductsListContainer>
        </ProductsContainer>

        <ComunityContainer>
          <Communitytitle>
            <h2>작업자들의 커뮤니티에 함께해볼까요?</h2>
            <CommunityLink to="/community">
              전체보기
              <FaArrowRight />
            </CommunityLink>
          </Communitytitle>
          <ComunityWrapper>
            {communityItems.map((item) => (
              <ToCommunityDetailPage
                key={item.post_id}
                to={`/community/detail/${item.post_id}`}
              >
                <ComunityList>
                  <div className="commucontent">
                    <div className="ttitle">
                      <h3>{item.title}</h3>
                    </div>
                    <div className="commupic">
                      {item.main_image ? (
                        <img
                          className="community-pic"
                          src={item.main_image}
                          alt="Community Post"
                        />
                      ) : (
                        ''
                      )}
                      <p
                        className={
                          item.main_image
                            ? 'withcommu-image'
                            : 'withoutcommu-image'
                        }
                      >
                        {handleText(item.content)}
                      </p>
                    </div>
                  </div>
                  <div>
                    <svg
                      className="thumbs"
                      width="13"
                      height="13"
                      viewBox="0 0 13 13"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M0.00242571 5.92305C-0.00533256 5.83585 0.00556749 5.74802 0.0344343 5.66515C0.0633011 5.58227 0.109504 5.50616 0.170112 5.44164C0.23072 5.37711 0.304409 5.32559 0.386503 5.29034C0.468598 5.25508 0.557305 5.23686 0.646996 5.23684H1.88275C2.05438 5.23684 2.21899 5.30338 2.34036 5.42183C2.46172 5.54027 2.5299 5.70092 2.5299 5.86842V11.8684C2.5299 12.0359 2.46172 12.1966 2.34036 12.315C2.21899 12.4335 2.05438 12.5 1.88275 12.5H1.18187C1.0199 12.5 0.863797 12.4408 0.7444 12.334C0.625002 12.2272 0.55099 12.0805 0.536979 11.9231L0.00242571 5.92305ZM4.47138 5.67105C4.47138 5.40705 4.63964 5.17084 4.88394 5.05842C5.41753 4.81274 6.32646 4.31916 6.73643 3.65189C7.26484 2.79168 7.3645 1.23768 7.38068 0.881788C7.38295 0.831893 7.38165 0.781998 7.38845 0.732735C7.47614 0.115998 8.69571 0.836314 9.16328 1.598C9.41729 2.01105 9.44965 2.55389 9.42311 2.978C9.39432 3.43147 9.25809 3.86947 9.12445 4.30463L8.8397 5.23211H12.3528C12.4528 5.2321 12.5514 5.2547 12.641 5.29815C12.7305 5.34159 12.8085 5.40469 12.8688 5.48249C12.9292 5.56029 12.9702 5.65069 12.9888 5.74658C13.0073 5.84246 13.0028 5.94124 12.9757 6.03516L11.2381 12.0402C11.1997 12.1727 11.1181 12.2892 11.0056 12.3722C10.8931 12.4552 10.7559 12.5001 10.6149 12.5H5.11854C4.9469 12.5 4.78229 12.4335 4.66093 12.315C4.53956 12.1966 4.47138 12.0359 4.47138 11.8684V5.67105Z"
                        fill="#DBFF00"
                        fillOpacity="0.7"
                      />
                    </svg>
                    <span className="likescount">{item.likes}</span>

                    <svg
                      className="commentss"
                      width="12"
                      height="13"
                      viewBox="0 0 12 13"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M4.8 0.5H7.2C8.47304 0.5 9.69394 1.01868 10.5941 1.94194C11.4943 2.86519 12 4.1174 12 5.42308C12 6.72876 11.4943 7.98096 10.5941 8.90422C9.81235 9.70602 8.7887 10.2027 7.69908 10.3195C7.42451 10.3489 7.2 10.57 7.2 10.8462V11.7544C7.2 12.11 6.8397 12.3527 6.51214 12.2142C3.59783 10.9824 0 9.12524 0 5.42308C0 4.1174 0.505713 2.86519 1.40589 1.94194C2.30606 1.01868 3.52696 0.5 4.8 0.5Z"
                        fill="#DBFF00"
                        fillOpacity="0.7"
                      />
                    </svg>
                    <span>{item.comment.length}</span>
                    <h4>{parseDate(item.created_at)}</h4>
                  </div>
                </ComunityList>
              </ToCommunityDetailPage>
            ))}
          </ComunityWrapper>
        </ComunityContainer>
      </AllCardContainer>
    </HomeContainer>
  );
};
export default Home;

const HomeContainer = styled.section`
  display: flex;
  width: 144rem;
  /* height: 170rem; */
  min-height: 100vh;
  flex-direction: column;
  margin: 0px auto;
  animation: ${StFadeAni} 0.3s ease;

  @media screen and (max-width: 768px) {
    width: 100%;
    max-width: 76.8rem;
    min-width: 32rem;
  }
`;

const CarouselWrapper = styled.div`
  width: 100%;
  /* @media screen and (max-width: 1116px) {
    max-width: 111.6rem;
  }
  @media screen and (max-width: 1024px) {
    max-width: 102.4rem;
  }
  @media screen and (max-width: 768px) {
    max-width: 76.8rem;
  }
  @media screen and (max-width: 530px) {
    max-width: 53rem;
  } */
`;
const AllCardContainer = styled.div`
  width: 100%;
  @media screen and (max-width: 1300px) {
    width: 130rem;
  }
  @media screen and (max-width: 1024px) {
    width: 10;
  }
  @media screen and (max-width: 768px) {
    width: 100%;
  }
`;
const ProductsContainer = styled.div`
  width: 111.6rem;
  margin: 0 auto;
  margin-top: 4rem;
  @media screen and (max-width: 768px) {
    width: 100%;
    min-width: 32rem;
    margin-top: 2rem;
  }
`;
const ProductsTitle = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0 auto;
  padding: 0 1.5rem;
  width: 100%;
  font-size: var(--fontSize-H3);
  @media screen and (max-width: 768px) {
    font-size: var(--fontSize-H5);
  }
`;

const ProductsLink = styled(Link)`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.8rem;
  text-decoration: none;
  @media screen and (max-width: 768px) {
    width: 100%;
  }
  cursor: pointer;
  width: 8.3rem;
  height: 3.2rem;
  background: var(--opc-20);
  border-radius: 4.5rem;
  font-size: var(--fontSize-H6);
  font-weight: var(--fontWeight-medium);
  color: var(--11-gray);
  @media screen and (max-width: 768px) {
    background: none;
    width: 6rem;
    /* line-height: 191.2%; */
    font-size: 1.1rem;
    gap: 0.3rem;
  }
  &:hover {
    background-color: #83ad2e;
    color: #101d1c;
  }
  svg {
    width: 1rem;
    height: 0.9rem;
    @media screen and (max-width: 768px) {
      width: 1rem;
      height: 0.9rem;
      color: var(--opc-100);
    }
  }
`;

const ProductsListContainer = styled.ul`
  display: grid;
  margin: auto;
  padding: 1.5rem;
  grid-template-columns: repeat(5, 1fr);
  margin-top: 2rem;
  row-gap: 1.5rem;
  column-gap: 1.8rem;
  /* align-items: flex-start;
  justify-content: center;
  place-items: center; */
  @media screen and (max-width: 1160px) {
    grid-template-columns: repeat(4, 1fr);
  }

  @media screen and (max-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media screen and (max-width: 768px) {
    column-gap: 1.5rem;
    row-gap: 1.8rem;
    grid-template-columns: repeat(3, 1fr);
  }
  @media screen and (max-width: 670px) {
    column-gap: 1.5rem;
    row-gap: 1.8rem;
    grid-template-columns: repeat(2, 1fr);
  }
  @media screen and (max-width: 520px) {
    row-gap: 1.8rem;
    grid-template-columns: repeat(2, 1fr);
  }

  @media screen and (max-width: 349px) {
    grid-template-columns: repeat(1, 1fr);
  }
`;

const ProductsList = styled.li`
  /* display: inline-block; */
  width: 100%;
  /* height: 31.5rem; */
  display: flex;
  align-items: flex-start;
  flex-direction: column;
  border-radius: 0.6rem;
  @media screen and (max-width: 768px) {
    width: 100%;
  }
  @media screen and (max-width: 520px) {
    width: 100%;
  }

  .imageWrapper {
    width: 100%;
    height: auto;
    aspect-ratio: 1/1;
    border-radius: 0.6rem;
    border-style: none;
    margin-bottom: 2rem;
    @media screen and (max-width: 768px) {
      margin-bottom: 1rem;
    }
  }
  img {
    object-fit: cover;
    object-position: center;
    width: 100%;
    aspect-ratio: 1/1;
    border-style: none;
    border-radius: 0.6rem;
  }

  h3 {
    font-size: var(--fontSize-body);
    color: var(--11-gray);
    margin-top: 1rem;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    white-space: normal;
    overflow: hidden;
    height: 2.5rem;
    white-space: wrap;
    text-overflow: ellipsis;
    line-height: 1.5;
    @media screen and (max-width: 768px) {
      width: 15rem;
      height: 2rem;
      line-height: 1.5;
      margin-top: 0.6rem;
      overflow: hidden;
      white-space: normal;
      text-overflow: ellipsis;
      color: var(--11-gray, #f8f8f8);
      font-weight: var(--fontWeight-medium);
      font-size: var(--fontSize-H5);
      /* line-height: 191.2%; */
    }
  }

  p {
    font-size: var(--fontSize-body);
    font-weight: var(--fontWeight-bold);
    color: var(--11-gray);
    margin-top: 1rem;
    text-align: left;
    @media screen and (max-width: 768px) {
      height: 2.3rem;
      font-weight: var(--fontWeight-bold);
      font-size: var(--fontSize-H5);
    }
  }
`;
interface QualityProps {
  $quality: string;
}
const ProductsCardQuality = styled.h1<QualityProps>`
  width: 9rem;
  padding: 0 0.8rem;
  text-align: center;
  line-height: 1.7;
  border-radius: 0.3rem;
  margin-top: 1rem;
  background-color: #fcfcfc;

  color: var(--2-gray);
  margin-bottom: 0.6rem;
  font-size: var(--fontSize-H6);
  // 배경색 조건부 렌더링
  ${(props) => {
    if (props.children === '새상품(미사용)') {
      return css`
        background-color: var(--opc-100);
        color: var(--2-gray);
      `;
    }
    if (props.children === '고장/파손 상품') {
      return css`
        background-color: var(--4-gray);
        color: var(--11-gray);
      `;
    }
  }}
  @media screen and (max-width: 768px) {
    margin-top: 1rem;
    width: 8rem;
    height: 2rem;
    font-size: 1rem;
    font-weight: 500;
    line-height: 191.2%;
    text-align: center;
  }
`;

const ToUsedItemDetailPage = styled(Link)`
  text-decoration: none;
  cursor: pointer;
  color: black;
  @media screen and (max-width: 768px) {
  }
`;

const ComunityContainer = styled.div`
  max-width: 111.6rem;
  width: 100%;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  margin: 0 auto;
  margin-top: 8rem;
  @media screen and (max-width: 768px) {
    width: 100%;
    margin-top: 3rem;
  }
`;

const Communitytitle = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  margin: 0 auto;
  padding: 0 1.5rem;
  @media screen and (max-width: 768px) {
    margin-bottom: 1rem;
  }

  h2 {
    font-size: var(--fontSize-H3);
    @media screen and (max-width: 768px) {
      width: 20.8rem;
      height: 2.7rem;
      font-size: var(--fontSize-H5);
      font-weight: var(--fontWeight-medium);
      vertical-align: baseline;
      padding-top: 0.63rem;
    }
  }
`;
const CommunityLink = styled(Link)`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 8.3rem;
  height: 3.2rem;
  text-decoration: none;
  cursor: pointer;
  font-weight: var(--fontWeight-bold);
  gap: 0.8rem;
  background: var(--opc-20);
  border-radius: 4.5rem;
  font-size: var(--fontSize-H6);
  font-weight: var(--fontWeight-medium);
  color: var(--11-gray);
  @media screen and (max-width: 768px) {
    display: flex;
    background: none;
    width: 6rem;
    font-size: 1.1rem;
    gap: 0.3rem;
  }
  &:hover {
    background-color: #83ad2e;
    color: #101d1c;
  }
  /* p {
    @media screen and (max-width: 768px) {
      line-height: 50%;
    }
  } */
  svg {
    width: 1rem;
    height: 0.9rem;
    @media screen and (max-width: 768px) {
      width: 9px;
      height: 8px;
      color: var(--opc-100);
    }
  }
`;

const ComunityWrapper = styled.ul`
  width: 100%;
  /* margin: 2.2rem auto; */
  background-color: transparent;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  /* row-gap: 2rem;
  column-gap: 2rem; */
  padding: 1.5rem;
  @media screen and (max-width: 600px) {
    grid-template-columns: 100%;
  }
`;

const ToCommunityDetailPage = styled(Link)`
  text-decoration: none;
  cursor: pointer;
  font-weight: var(--fontWeight-bold);
  @media screen and (max-width: 768px) {
    width: 100%;
  }
`;

const ComunityList = styled.li`
  width: 100%;
  height: 19.5rem;
  display: inline-block;
  position: relative;
  align-items: center;
  border-radius: 1rem;
  background-color: var(--3-gray);
  padding: 2rem;

  @media screen and (max-width: 768px) {
    width: 100%;
    height: 14rem;
    padding: 1rem;
  }

  .commupic {
    width: 100%;
    display: flex;
    gap: 1.2rem;
    margin-block: 2.5rem;
    @media screen and (max-width: 768px) {
    }
  }

  .community-pic {
    width: 6.6rem;
    height: 6.6rem;
    object-fit: cover;
    @media screen and (max-width: 768px) {
      width: 4rem;
      height: 4rem;
    }
  }
  h3 {
    color: var(--11-gray);
    font-size: var(--fontSize-H3);
    margin-bottom: 1.6rem;
    font-weight: var(--fontWeight-bold);
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    max-width: 48rem;
    @media screen and (max-width: 768px) {
      margin-top: 1rem;
      font-size: var(--fontSize-H5);
      font-weight: var(--fontWeight-bold);
      width: 20rem;
    }
  }
  .withcommu-image {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    white-space: normal;
    overflow: hidden;
    height: 6.6rem;
    line-height: 1.2;
    font-size: var(--fontSize-H4);
    font-weight: var(--fontWeight-medium);
    color: var(--8-gray);
    white-space: normal;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 39rem;
    @media screen and (max-width: 768px) {
      font-size: var(--fontSize-H6);
      line-height: 1.9;
      height: 4rem;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      white-space: normal;
      overflow: hidden;
    }
  }
  .withoutcommu-image {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    white-space: normal;
    overflow: hidden;
    height: 6.6rem;
    line-height: 1.2;
    font-size: var(--fontSize-H4);
    font-weight: var(--fontWeight-medium);
    color: var(--8-gray);
    white-space: normal;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 48rem;
    @media screen and (max-width: 768px) {
      font-size: var(--fontSize-H6);
      line-height: 1.9;
      height: 4rem;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      white-space: normal;
      overflow: hidden;
    }
  }

  .thumbs {
    position: absolute;
    bottom: 1.5rem;
    left: 3.5rem;
    width: 2rem;
    height: 2rem;
    @media screen and (max-width: 768px) {
      width: 1.3rem;
      height: 1.2rem;
      left: 3rem;
      bottom: 1.5rem;
    }
  }
  .likescount {
    position: absolute;
    text-decoration: none;
    bottom: 1.5rem;
    left: 7rem;
    color: var(--6, #717171);
    @media screen and (max-width: 768px) {
      font-size: 1.1rem;
      left: 5.5rem;
    }
  }
  .commentss {
    position: absolute;
    bottom: 1.5rem;
    left: 12rem;
    width: 2rem;
    height: 2rem;
    @media screen and (max-width: 768px) {
      width: 1.3rem;
      height: 1.2rem;
      left: 8.5rem;
      bottom: 1.5rem;
    }
  }

  span {
    position: absolute;
    text-decoration: none;
    bottom: 1.5rem;
    left: 15rem;
    color: var(--6, #717171);
    @media screen and (max-width: 768px) {
      font-size: 1.1rem;
      left: 11rem;
    }
  }
  h4 {
    position: absolute;
    bottom: 1.5rem;
    right: 1.5rem;
    color: var(--6, #717171);
    font-size: var(--fontSize-H6);
    @media screen and (max-width: 768px) {
      font-size: 1rem;
      right: 1.5rem;
    }
  }
`;
