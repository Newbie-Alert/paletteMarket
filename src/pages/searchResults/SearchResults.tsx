// SearchResults.tsx
import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { supabase } from '../../api/supabase/supabaseClient';
import { Community, UsedItem } from '../usedtypes';

const SearchResults: React.FC = () => {
  const [usedItemResults, setUsedItemResults] = useState<UsedItem[]>([]);
  const [communityResults, setCommunityResults] = useState<Community[]>([]);
  const location = useLocation();
  const searchQuery = new URLSearchParams(location.search).get('q');

  useEffect(() => {
    const fetchSearchResults = async () => {
      try {
        // 중고 게시물 검색
        const { data: usedItemData, error: usedItemError } = await supabase
          .from('products')
          .select('*')
          .textSearch('title', searchQuery as string);

        // 커뮤 게시물 검색
        const { data: communityData, error: communityError } = await supabase
          .from('community')
          .select('*')
          .textSearch('title', searchQuery as string);
        console.log(communityData);
        if (usedItemError || communityError) {
          console.error(
            '데이터 베이스에 요청을 실패하였습니다:',
            usedItemError || communityError
          );
          return;
        }

        // 중고 게시물 이미지 URL 가져오기
        const usedItemsWithImages = await Promise.all(
          usedItemData.map(async (item) => {
            const pathToImage = `pictures/${item.image_Url}.png`;
            const { data } = await supabase.storage
              .from('picture')
              .getPublicUrl(pathToImage);
            return { ...item, data };
          })
        );

        // 커뮤니티 게시물 이미지 URL 가져오기
        const communityItemsWithImages = await Promise.all(
          communityData.map(async (item) => {
            const pathToImage = `pictures/${item.image_Url}.png`;
            const { data } = await supabase.storage
              .from('community_picture')
              .getPublicUrl(pathToImage);
            return { ...item, data };
          })
        );

        setUsedItemResults(usedItemsWithImages || []);
        setCommunityResults(communityItemsWithImages || []);
      } catch (error) {
        console.error('수파베이스에 요청 중 실패:', error);
        throw error;
      }
    };

    if (searchQuery) {
      fetchSearchResults();
    }
  }, [searchQuery]);

  return (
    <div>
      <h2>중고거래게시물 결과</h2>
      {usedItemResults.map((item) => (
        <div key={item.id}>
          <Link to={`/products/detail/${item.id}`}>
            {item.image_Url && <img src={item.image_Url} alt="Item" />}
            <h1>{item.quality}</h1>
            <h3>{item.title}</h3>
            <p>{item.price}원</p>
          </Link>
        </div>
      ))}
      <h2>커뮤니티 게시물 결과</h2>
      {communityResults.map((item) => (
        <div key={item.post_id}>
          <Link to={`/community/detail/${item.post_id}`}>
            {item.image_Url && (
              <img src={item.image_Url} alt="Community Post" />
            )}
            <div>{item.title}</div>
            <p>{item.content}</p>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default SearchResults;
