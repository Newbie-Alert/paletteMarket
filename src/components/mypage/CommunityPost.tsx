import React, { useEffect, useRef, useState } from 'react';
import {
  StIconAndDateWrapper,
  StIconContainer,
  StPostContainer,
  StPostContent,
  StPostContentsWrapper,
  StPostDate,
  StPostImage,
  StPostTitle,
  StPostWrapper
} from '../../styles/mypageStyle/CommunityCardStyle';

import 'react-loading-skeleton/dist/skeleton.css';
import { userId } from '../../api/supabase/auth';
import { supabase } from '../../api/supabase/supabaseClient';
import { debounce } from 'lodash';
import SkeletonCommunityCard from '../card/SkeletonCommunityCard';

export interface Community {
  id: number;
  title: string;
  content: string;
  created_at: string;
  images: string;
}

interface CommunityCardProps {
  // list: Community[];
  activeTab: number;
}

const CommunityPost: React.FC<CommunityCardProps> = ({ activeTab }) => {
  const CARDS_COUNT = 10;
  const containerRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [offset, setOffset] = useState(1);
  const [isInView, setIsInView] = useState(false);
  const [communityPosts, setCommunityPosts] = useState<Community[]>([]);

  const getCurrentUserCommunityPosts = async () => {
    let { data: communityPosts, error } = await supabase
      .from('community')
      .select('*')
      .eq('author_uid', userId)
      .limit(10);

    if (communityPosts && communityPosts.length > 0) {
      setCommunityPosts(communityPosts);
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

  const fetchCommunityPosts = async (offset: number, limit: number) => {
    const from = offset * CARDS_COUNT;
    const to = from + CARDS_COUNT - 1;

    const { data } = await supabase!
      .from('community')
      .select('*')
      .range(from, to)
      .eq('author_uid', userId);

    return data;
  };

  const loadMorePosts = async (offset: number) => {
    setIsLoading(true);
    setOffset((prev) => prev + 1);
    try {
      const newPosts = await fetchCommunityPosts(offset, CARDS_COUNT);

      if (newPosts) {
        setCommunityPosts((prevPosts) => [...prevPosts, ...newPosts]);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    if (isInView) {
      loadMorePosts(offset);
    }
  }, [isInView]);

  useEffect(() => {
    // Initial load
    getCurrentUserCommunityPosts();
  }, []);

  return (
    <StPostContainer ref={containerRef}>
      {activeTab === 3 &&
        communityPosts.map((post) => {
          return (
            <StPostWrapper key={post.id}>
              <StPostTitle>{post.title}</StPostTitle>
              <StPostContentsWrapper>
                {!post.images ? '' : <StPostImage src={post.images} />}
                <StPostContent>{post.content}</StPostContent>
              </StPostContentsWrapper>

              <StIconAndDateWrapper>
                <StIconContainer>
                  <span>좋아요</span>
                  <span>41</span>
                  <span>댓글</span>
                  <span>15</span>
                </StIconContainer>

                <StPostDate>{post.created_at}</StPostDate>
              </StIconAndDateWrapper>
            </StPostWrapper>
          );
        })}

      {isLoading && <SkeletonCommunityCard cards={10} />}
    </StPostContainer>
  );
};

export default CommunityPost;
