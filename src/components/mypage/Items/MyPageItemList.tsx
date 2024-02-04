import React, { useEffect } from 'react';
import { StCardContainer } from '../../../styles/mypageStyle/ProductCardStyle';
import SkeletonProductCard from '../../skeleton/SkeletonProductCard';
import { ProductCardProps } from '../../../api/supabase/products';
import { useInView } from 'react-intersection-observer';
import Nothing from '../Nothing';
import ProductsCard from '../../prducts/ProductsCard';
import {
  getFavoriteItems,
  getMyItems,
  getPurchasedItems
} from '../../../api/supabase/mypage';
import { useInfiniteQuery } from 'react-query';

const MyPageItemList: React.FC<ProductCardProps> = ({ activeTab }) => {
  const {
    data: myItems,
    hasNextPage: hasNextPageMyItem,
    fetchNextPage: fetchNextPageMyItem,
    status: statusMyItem
  } = useInfiniteQuery({
    queryKey: ['myItem'],
    queryFn: getMyItems,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage && lastPage.page < lastPage.total_pages) {
        return lastPage.page + 1;
      }
    },
    select: (data) => {
      return {
        pages: data.pages.map((pageData) => pageData.data).flat(),
        pageParams: data.pageParams
      };
    }
  });

  const {
    data: purchasedItems,
    hasNextPage: hasNextPagePurchasedItems,
    fetchNextPage: fetchNextPagePurchasedItems,
    status: statusPurchasedItems
  } = useInfiniteQuery({
    queryKey: ['purchasedItems'],
    queryFn: getPurchasedItems,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage && lastPage.page < lastPage.total_pages) {
        return lastPage.page + 1;
      }
    },
    select: (data) => {
      return {
        pages: data.pages.map((pageData) => pageData.data).flat(),
        pageParams: data.pageParams
      };
    }
  });

  const {
    data: favItems,
    hasNextPage: hasNextPageFavItems,
    fetchNextPage: fetchNextPageFavItems,
    status: statusFavItems
  } = useInfiniteQuery({
    queryKey: ['favItems'],
    queryFn: getFavoriteItems,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage && lastPage.page < lastPage.total_pages) {
        return lastPage.page + 1;
      }
    },
    select: (data) => {
      return {
        pages: data.pages.map((pageData) => pageData?.data).flat(),
        pageParams: data.pageParams
      };
    }
  });

  const { ref } = useInView({
    threshold: 0,
    onChange: (inView) => {
      if (!inView || !hasNextPageMyItem) return;
      fetchNextPageMyItem();

      if (!inView || !hasNextPagePurchasedItems) return;
      fetchNextPagePurchasedItems();

      if (!inView || !hasNextPageFavItems) return;
      fetchNextPageFavItems();
    }
  });

  useEffect(() => {
    // 처음 랜더링 시 화면이 맨 위에 위치
    if (window.scrollY !== 0) window.scrollTo(0, 0);
  }, []);

  return (
    <>
      {activeTab === 0 && (
        <StCardContainer ref={ref}>
          {statusMyItem === 'loading' ? (
            <SkeletonProductCard cards={5} />
          ) : (
            <ProductsCard posts={myItems?.pages} />
          )}
        </StCardContainer>
      )}

      {activeTab === 1 && (
        <StCardContainer ref={ref}>
          {statusPurchasedItems === 'loading' ? (
            <SkeletonProductCard cards={5} />
          ) : (
            <ProductsCard posts={purchasedItems?.pages} />
          )}
        </StCardContainer>
      )}

      {activeTab === 2 && (
        <StCardContainer ref={ref}>
          {statusFavItems === 'loading' ? (
            <SkeletonProductCard cards={5} />
          ) : (
            <ProductsCard posts={favItems?.pages} />
          )}
        </StCardContainer>
      )}
    </>
  );
};

export default MyPageItemList;
