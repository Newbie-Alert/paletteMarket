import React, { useEffect, useRef, useState } from 'react';
import { StCardContainer } from '../../../styles/mypageStyle/ProductCardStyle';
import { debounce } from 'lodash';
import { supabase } from '../../../api/supabase/supabaseClient';
import SkeletonProductCard from '../../skeleton/SkeletonProductCard';
import { Product, ProductCardProps } from '../../../api/supabase/products';
import MyPageItemCard from './MyPageItemCard';
import {
  useAppDispatch,
  useAppSelector
} from '../../../redux/reduxHooks/reduxBase';
import { useInView } from 'react-intersection-observer';
import {
  setFavItem,
  setMyItem,
  setPurchasedItem
} from '../../../redux/modules/itemSlice';
import Nothing from '../Nothing';
import ProductsCard from '../../prducts/ProductsCard';

const MyPageItemList: React.FC<ProductCardProps> = ({ activeTab }) => {
  const CARDS_COUNT = 10;
  const [isLoading, setIsLoading] = useState(false);
  const [offset, setOffset] = useState(1);

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

  const onScrollHandler = () => {
    // js script가 동작하고 카드를 감싸는 전체 컨테이너가 바닥에 닿을 때
    // if (inView) {
    //   const container = containerRef.current;
    //   const { scrollTop, clientHeight, scrollHeight } = container;
    //   const isAtBottom = scrollTop + clientHeight <= scrollHeight;
    //   setIsInView(isAtBottom);
    // }
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
    if (inView) {
      loadMoreProducts(offset);
    }
  }, []);

  useEffect(() => {
    getCurrentUserProducts();
  }, []);

  useEffect(() => {
    getPurchasedProducts();
  }, []);

  useEffect(() => {
    getFavoriteProducts();
  }, []);

  const { ref, inView, entry } = useInView({
    threshold: 0
  });

  return (
    <StCardContainer ref={ref}>
      {myItems && myItems.length > 0 ? (
        <ProductsCard posts={myItems} />
      ) : (
        <p>포스트가 없습니다</p>
      )}
    </StCardContainer>
  );
};

export default MyPageItemList;
