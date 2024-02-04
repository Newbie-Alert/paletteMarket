import React, { useEffect, useRef, useState } from 'react';
import { StPostContainer } from '../../../styles/mypageStyle/CommunityCardStyle';
import 'react-loading-skeleton/dist/skeleton.css';
import SkeletonCommunityCard from '../../skeleton/SkeletonCommunityCard';
import { CommunityActive } from '../../../api/supabase/community';
import { MyPageCommunityCard } from './MyPageCommunityCard';
import Nothing from '../Nothing';
import { useInView } from 'react-intersection-observer';
import {
  getCommunityPosts,
  getFavCommunityPosts
} from '../../../api/supabase/mypage';
import { useInfiniteQuery } from 'react-query';

const MyPageCommunityPostList: React.FC<CommunityActive> = ({ activeTab }) => {
  const {
    data: myPost,
    hasNextPage: hasNextPageMyPost,
    fetchNextPage: fetchNextPageMyPost,
    status: statusMyPost
  } = useInfiniteQuery({
    queryKey: ['myPost'],
    queryFn: getCommunityPosts,
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
    data: myFavPost,
    hasNextPage: hasNextPageMyFavPost,
    fetchNextPage: fetchNextPageMyFavPost,
    status: statusMyFavPost
  } = useInfiniteQuery({
    queryKey: ['myFavPost'],
    queryFn: getFavCommunityPosts,
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

  const { ref } = useInView({
    threshold: 0,
    onChange: (inView) => {
      if (!inView || !hasNextPageMyPost) return;
      fetchNextPageMyPost();

      if (!inView || !hasNextPageMyPost) return;
      fetchNextPageMyPost();
    }
  });

  useEffect(() => {
    // 처음 랜더링 시 화면이 맨 위에 위치
    if (window.scrollY !== 0) window.scrollTo(0, 0);
  }, []);

  const handleText = (content: string): string => {
    const textOnly = content.replace(/<[^>]*>|&nbsp;/g, ' ');
    return textOnly;
  };

  return (
    <StPostContainer ref={ref}>
      {activeTab === 3 &&
        myPost?.pages.map((post) => {
          return (
            <MyPageCommunityCard
              id={post.id}
              title={post.title}
              content={handleText(post.content)}
              created_at={post.created_at}
              main_image={post.main_image}
              post_id={post.post_id}
              comment={post.comment}
              likes={post.likes}
            />
          );
        })}

      {activeTab === 4 &&
        myFavPost?.pages.map((post) => {
          return (
            <MyPageCommunityCard
              id={post.id}
              title={post.title}
              content={handleText(post.content)}
              created_at={post.created_at}
              main_image={post.main_image}
              post_id={post.post_id}
              comment={post.comment}
              likes={post.likes}
            />
          );
        })}
    </StPostContainer>
  );
};

export default MyPageCommunityPostList;
