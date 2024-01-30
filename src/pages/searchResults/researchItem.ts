import { supabase } from '../../api/supabase/supabaseClient';
import { Communityy, UsedItem } from '../home/usedtypes';

export interface ResearchResults {
  usedItemsWithImages: UsedItem[];
  communityItemsWithImages: Communityy[];
}
export async function researchItems(searchQuery: string) {
  // TODO: 아래 두 데이터도 Promise.all 로 가져오면 더 빠를 듯
  const { data: usedItemData, error: usedItemError } = await supabase
    .from('products')
    .select('*')
    .or(
      `title.ilike.%${searchQuery}%, contents.ilike.%${searchQuery}%, tags.cs.{${searchQuery}}`
    );

  const { data: communityData, error: communityError } = await supabase
    .from('community')
    .select('*')
    .or(`title.ilike.%${searchQuery}%, content.ilike.%${searchQuery}%`);

  if (usedItemError || communityError) {
    console.error(
      '데이터 베이스에 요청을 실패하였습니다:',
      usedItemError || communityError
    );
    return;
  }

  // 중고 게시물 이미지 가져오기
  const usedItemsWithImages = await Promise.all(
    usedItemData.map(async (item) => {
      const pathToImage = `products/${item.image_url}.png`;
      const { data } = await supabase.storage
        .from('images')
        .getPublicUrl(pathToImage);
      return { ...item, data };
    })
  );

  // 커뮤 게시물 이미지 가져오기
  const communityItemsWithImages = await Promise.all(
    communityData.map(async (item) => {
      const pathToImage = `quill_imgs/${item.image_Url}.png`;
      const { data } = await supabase.storage
        .from('images')
        .getPublicUrl(pathToImage);
      return { ...item, data };
    })
  );

  return { usedItemsWithImages, communityItemsWithImages };
}

// TODO:
export async function researchItems2(searchQuery: string) {
  const usedItemPromise = supabase
    .from('products')
    .select('*')
    .or(
      `title.ilike.%${searchQuery}%, contents.ilike.%${searchQuery}%, tags.cs.{${searchQuery}}`
    );

  const communityPromise = supabase
    .from('community')
    .select('*')
    .or(`title.ilike.%${searchQuery}%, content.ilike.%${searchQuery}%`);

  const [usedItemResult, communityResult] = await Promise.all([
    usedItemPromise,
    communityPromise
  ]);

  const { data: usedItemData, error: usedItemError } = usedItemResult;
  const { data: communityData, error: communityError } = communityResult;

  if (usedItemError || communityError) {
    console.error(
      '데이터 베이스에 요청을 실패하였습니다:',
      usedItemError || communityError
    );
    return;
  }

  // TODO: 이건 products 와 community에 image url을 미리 저장한 형태였어야 한다.
  //  => 지금 getPublicUrl을 할 게 아니고 저장할 때 넣어야함
  // 중고 게시물 이미지 가져오기
  const usedItemsWithImages = await Promise.all(
    usedItemData.map(async (item) => {
      const pathToImage = `products/${item.image_url}.png`;
      const { data } = await supabase.storage
        .from('images')
        .getPublicUrl(pathToImage);
      return { ...item, data };
    })
  );

  // 커뮤 게시물 이미지 가져오기
  const communityItemsWithImages = await Promise.all(
    communityData.map(async (item) => {
      const pathToImage = `quill_imgs/${item.image_Url}.png`;
      const { data } = await supabase.storage
        .from('images')
        .getPublicUrl(pathToImage);
      return { ...item, data };
    })
  );

  return { usedItemsWithImages, communityItemsWithImages };
}
