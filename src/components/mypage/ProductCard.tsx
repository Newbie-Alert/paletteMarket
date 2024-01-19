import React, { useEffect, useRef, useState } from 'react';
import {
  StCardContainer,
  StCardWrapper,
  StProductImage,
  StProductPrice,
  StProductQuality
} from '../../styles/mypageStyle/ProductCardStyle';

import { debounce } from 'lodash';
import { supabase } from '../../api/supabase/supabaseClient';
import SkeletonProductCard from '../card/SkeletonProductCard';
import { Product, ProductCardProps } from '../../api/supabase/products';

const ProductCard: React.FC<ProductCardProps> = ({ activeTab }) => {
  const CARDS_COUNT = 10;
  const containerRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadedProducts, setLoadedProducts] = useState<Product[]>([]);
  const [loadedPurchasedProducts, setLoadedPurchasedProducts] = useState<
    Product[]
  >([]);
  const [offset, setOffset] = useState(1);
  const [isInView, setIsInView] = useState(false);

  const userId = localStorage.getItem('userId');

  const getCurrentUserProducts = async () => {
    let { data: products, error } = await supabase
      .from('products')
      .select('*')
      .eq('uid', userId)
      .limit(10);

    if (products && products.length > 0) {
      setLoadedProducts(products);
    }
  };

  const getPurchasedProducts = async () => {
    let { data: purchasedProducts, error } = await supabase
      .from('products')
      .select('*')
      .eq('buyer_uid', userId);

    if (purchasedProducts && purchasedProducts.length > 0) {
      setLoadedPurchasedProducts(purchasedProducts);
    }
  };

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
      .eq('uid', userId);

    return data;
  };

  const loadMoreProducts = async (offset: number) => {
    setIsLoading(true);
    setOffset((prev) => prev + 1);
    try {
      const newProducts = await fetchProducts(offset, CARDS_COUNT);
      console.log(newProducts);

      if (newProducts) {
        setLoadedProducts((prevProducts) => [...prevProducts, ...newProducts]);
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
    // Initial load
    getCurrentUserProducts();
  }, []);

  useEffect(() => {
    // Initial load
    getPurchasedProducts();
  }, []);

  return (
    <StCardContainer ref={containerRef}>
      {activeTab === 1 &&
        loadedProducts.map((product) => {
          return (
            <StCardWrapper key={product.id}>
              <StProductImage
                src={
                  'https://images.unsplash.com/photo-1632516643720-e7f5d7d6ecc9?q=80&w=1911&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
                }
                alt=""
              />
              <StProductQuality>{product.quality}</StProductQuality>
              <p>{product.user}</p>
              <p>{product.title}</p>
              <StProductPrice>{product.price}원</StProductPrice>
            </StCardWrapper>
          );
        })}

      {isLoading && <SkeletonProductCard cards={10} />}

      {activeTab === 2 &&
        loadedPurchasedProducts.map((product) => {
          return (
            <StCardWrapper key={product.id}>
              <StProductImage
                src={
                  'https://images.unsplash.com/photo-1632516643720-e7f5d7d6ecc9?q=80&w=1911&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
                }
                alt=""
              />
              <StProductQuality>{product.quality}</StProductQuality>
              <p>{product.user}</p>
              <p>{product.title}</p>
              <StProductPrice>{product.price}원</StProductPrice>
            </StCardWrapper>
          );
        })}

      {isLoading && <SkeletonProductCard cards={10} />}
    </StCardContainer>
  );
};

export default ProductCard;
