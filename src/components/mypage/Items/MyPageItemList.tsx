import React, { useEffect, useRef, useState } from 'react';
import { StCardContainer } from '../../../styles/mypageStyle/ProductCardStyle';
import { debounce } from 'lodash';
import { supabase } from '../../../api/supabase/supabaseClient';
import SkeletonProductCard from '../../skeleton/SkeletonProductCard';
import { Product, ProductCardProps } from '../../../api/supabase/products';
import MyPageItemCard from './MyPageItemCard';
import { useAppDispatch } from '../../../redux/reduxHooks/reduxBase';
import {
  setFavItem,
  setMyItem,
  setPurchasedItem
} from '../../../redux/modules/countSlice';
import Nothing from '../Nothing';

// TODO: react-query 사용하기 & activeTab에 따라 다르게 상품을 가져와야 하는데, 일단 다 들고 오고 시작하여 불필요한 데이터 요청이 너무 많은 상황
const MyPageItemList: React.FC<ProductCardProps> = ({ activeTab }) => {
  const CARDS_COUNT = 10;
  const containerRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [offset, setOffset] = useState(1);
  const [isInView, setIsInView] = useState(false);
  const [myItems, setMyItems] = useState<Product[]>([]);
  const [purchasedItems, setPurchasedItems] = useState<Product[]>([]);
  const [favItems, setFavItems] = useState<Product[]>([]);

  const dispatch = useAppDispatch();
  const userId = localStorage.getItem('userId');

  const getCurrentUserProducts = async () => {
    let { data: products, error } = await supabase
      .from('products')
      .select('*')
      .eq('post_user_uid', userId)
      .limit(10);

    if (products && products.length > 0) {
      setMyItems(products);
      // TODO: useState와 리덕스를 왜 함께 사용하는지?
      dispatch(setMyItem(products));
    }
  };

  const getPurchasedProducts = async () => {
    let { data: purchasedProducts, error } = await supabase
      .from('products')
      .select('*')
      .eq('buyer_uid', userId)
      .limit(10);

    if (purchasedProducts && purchasedProducts.length > 0) {
      setPurchasedItems(purchasedProducts);
      dispatch(setPurchasedItem(purchasedProducts));
    }
  };

  const getFavoriteProducts = async () => {
    let { data: favProducts, error } = await supabase
      .from('products')
      .select('*');

    if (favProducts && favProducts.length > 0) {
      const filteredFavProducts = favProducts
        .filter((product) =>
          product.like_user?.some(
            (like: { user_uid: string }) => like.user_uid === userId
          )
        )
        .map((product) => product);
      dispatch(setFavItem(filteredFavProducts));
      setFavItems(filteredFavProducts);
    }
  };

  useEffect(() => {
    getFavoriteProducts();
  }, []);

  // scroll 말고 intersection-observer 사용하여 바닥에 닿을 때를 감지하면 됨
  const onScrollHandler = () => {
    // js script가 동작하고 카드를 감싸는 전체 컨테이너가 바닥에 닿을 때
    if (containerRef.current && typeof window !== 'undefined') {
      const container = containerRef.current;
      const { scrollTop, clientHeight, scrollHeight } = container;
      const isAtBottom = scrollTop + clientHeight <= scrollHeight;
      setIsInView(isAtBottom);
    }
  };

  useEffect(() => {
    const debouncedScroll = debounce(() => onScrollHandler(), 200);
    window.addEventListener('scroll', debouncedScroll);
    return () => {
      window.removeEventListener('scroll', debouncedScroll);
    };
  }, []);

  const fetchProducts = async (offset: number, limit: number) => {
    const from = offset * CARDS_COUNT;
    const to = from + CARDS_COUNT - 1;

    const { data } = await supabase!
      .from('products')
      .select('*')
      .range(from, to)
      .eq('post_user_uid', userId);

    return data;
  };

  // TODO: 왜 react-query 안쓰고 직접하는지?
  const loadMoreProducts = async (offset: number) => {
    setIsLoading(true);
    setOffset((prev) => prev + 1);
    try {
      const newProducts = await fetchProducts(offset, CARDS_COUNT);

      if (newProducts) {
        setMyItems((prevProducts) => [...prevProducts, ...newProducts]);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    if (isInView) {
      loadMoreProducts(offset);
    }
  }, [isInView]);

  useEffect(() => {
    getCurrentUserProducts();
  }, []);

  useEffect(() => {
    getPurchasedProducts();
  }, []);

  useEffect(() => {
    getFavoriteProducts();
  }, []);

  return (
    <StCardContainer ref={containerRef}>
      {activeTab === 0 &&
        myItems.map((item) => (
          <MyPageItemCard
            key={item.id}
            id={item.id}
            image_url={item.image_url}
            user={item.user}
            quality={item.quality}
            title={item.title}
            price={item.price}
          />
        ))}

      {myItems.length === 0 && activeTab !== 1 && activeTab !== 2 && (
        <Nothing
          type={'판매하기'}
          content={`아직 판매중인 물품이 없어요. \n '판매하기'를 눌러 판매를 시작해보세요!`}
          icon={'/assets/sell.svg'}
          to={'/productsposts'}
          show={true}
        />
      )}
      {isLoading && <SkeletonProductCard cards={myItems.length} />}

      {activeTab === 1 &&
        purchasedItems.map((item) => {
          return (
            <MyPageItemCard
              key={item.id}
              id={item.id}
              image_url={item.image_url}
              user={item.user}
              quality={item.quality}
              title={item.title}
              price={item.price}
            />
          );
        })}
      {purchasedItems.length === 0 && activeTab !== 0 && activeTab !== 2 && (
        <Nothing
          type={''}
          content={`아직 구매하신 물품이 없어요. `}
          icon={''}
          to={''}
          show={false}
        />
      )}
      {isLoading && <SkeletonProductCard cards={purchasedItems.length} />}

      {activeTab === 2 &&
        favItems.map((item) => {
          return (
            <MyPageItemCard
              id={item.id}
              image_url={item.image_url}
              user={item.user}
              quality={item.quality}
              title={item.title}
              price={item.price}
            />
          );
        })}

      {favItems.length === 0 && activeTab !== 0 && activeTab !== 1 && (
        <Nothing
          type={''}
          content={`아직 찜한 물품이 없어요. `}
          icon={''}
          to={''}
          show={false}
        />
      )}
      {isLoading && <SkeletonProductCard cards={10} />}
      {/* <SkeletonProductCard cards={10} /> */}
    </StCardContainer>
  );
};

export default MyPageItemList;
