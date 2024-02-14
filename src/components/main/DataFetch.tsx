import { supabase } from '../../api/supabase/supabaseClient';
import { UsedItem } from '../../pages//home/usedtypes';
import { Post } from '../../pages/community/api/model';

export const fetchData = async (): Promise<{
  usedItems: UsedItem[];
  communityItems: Post[];
}> => {
  try {
    const { data: usedItemsData, error: usedItemsError } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

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
        const pathToImage = `quill/${item.image_url}.png`;
        const { data } = supabase.storage
          .from('images')
          .getPublicUrl(pathToImage);
        return { ...item, data };
      })
    );

    const communityItemsWithImages = await Promise.all(
      communityItemsData.map(async (item) => {
        const pathToImage = `pictures/${item.image_Url}.png`;
        const { data } = supabase.storage
          .from('images')
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
