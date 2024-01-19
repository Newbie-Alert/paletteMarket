import { supabase } from './supabaseClient';

export interface UserProfile {
  id: string;
  username: string;
  nickname: string;
  avatar_url: string;
  email: string;
}

// 현재 사용자 정보 가져오기
export const getUserProfile = async (id: string | null) => {
  let { data: profile } = await supabase.from('user').select('*').eq('id', id);
  return profile;
};

// 현재 사용자 닉네임 수정
export const updateUserNickname = async ({
  nickname,
  id
}: {
  nickname: string;
  id: string;
}): Promise<UserProfile> => {
  const { data } = await supabase
    .from('user')
    .update({ nickname: nickname })
    .eq('id', id);
  return data!;
};

// 현재 사용자 이미지 수정
export const updateUserImage = async ({
  avatar_url,
  id
}: {
  avatar_url: string;
  id: string;
}): Promise<UserProfile> => {
  const { data } = await supabase
    .from('user')
    .update({ avatar_url: avatar_url })
    .eq('id', id);

  console.log(data);
  return data!;
};
