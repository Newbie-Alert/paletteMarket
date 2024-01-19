import React, { useEffect, useState } from 'react';
import {
  StButtonWrapper,
  StEditProfileButton,
  StEmail,
  StNickname,
  StNicknameInput,
  StProfileContainer,
  StProfileImage,
  StProfileWrapper,
  StUsername
} from '../../styles/mypageStyle/ProfileStyle';
import { supabase } from '../../api/supabase/supabaseClient';
import { v4 as uuidv4 } from 'uuid';

import { useQuery, useMutation, useQueryClient } from 'react-query';
import {
  getUserProfile,
  updateUserImage,
  updateUserNickname
} from '../../api/supabase/profile';

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [userNickname, setUserNickname] = useState<string | undefined>();
  const [profileImage, setProfileImage] = useState<string | null>();

  const userId = localStorage.getItem('userId');

  const queryClient = useQueryClient();

  const { data: user } = useQuery({
    queryKey: ['user'],
    queryFn: () => getUserProfile(userId)
  });

  // profile 수정 버튼
  const editProfileHandler = () => {
    setIsEditing(true);
  };

  // profile 수정 취소
  const cancelEditHandler = () => {
    setIsEditing(false);
  };

  // nickname input onChange
  const onChangeNickname = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserNickname(e.target.value);
  };

  const { mutate: updateNickname } = useMutation(updateUserNickname, {
    onSuccess: () => {
      queryClient.invalidateQueries('user');
    }
  });

  const { mutate: updateProfileImage } = useMutation(updateUserImage, {
    onSuccess: () => {
      queryClient.invalidateQueries('user');
    }
  });

  const clickUpdateProfile = () => {
    if (userNickname && userId) {
      updateNickname({
        nickname: userNickname,
        id: userId
      });
    }

    if (profileImage && userId) {
      updateProfileImage({
        avatar_url: profileImage,
        id: userId
      });
    }
    setIsEditing(false);
  };

  const uploadProfileImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const baseUrl =
      'https://kbfbecvacokagdljwtnh.supabase.co/storage/v1/object/public/profiles/';
    if (e.target.files && e.target.files.length > 0) {
      let file = e.target.files[0];
      const { data, error } = await supabase.storage
        .from('profiles')
        .upload(userId + '/' + uuidv4(), file, {
          upsert: true
        });

      if (data) {
        setProfileImage(baseUrl + data?.path);
      } else {
        console.log(error);
      }
    }
  };

  return (
    <>
      {user?.map((user) => {
        return (
          <StProfileContainer key={user.id}>
            <StProfileImage
              src={!profileImage ? user.avatar_url : profileImage}
              alt=""
            />
            <input type="file" onChange={(e) => uploadProfileImage(e)} />

            <StProfileWrapper key={user.id}>
              <StButtonWrapper>
                {isEditing ? (
                  <StNicknameInput
                    defaultValue={user.nickname}
                    onChange={onChangeNickname}
                  />
                ) : (
                  <StNickname>{user.nickname}</StNickname>
                )}

                {isEditing ? (
                  <>
                    <button onClick={cancelEditHandler}>취소</button>
                    <button onClick={clickUpdateProfile}>저장</button>
                  </>
                ) : (
                  <StEditProfileButton onClick={editProfileHandler}>
                    프로필 수정
                  </StEditProfileButton>
                )}
              </StButtonWrapper>

              <StUsername>{user.username}</StUsername>
              <StEmail>{user.email}</StEmail>
            </StProfileWrapper>
          </StProfileContainer>
        );
      })}
    </>
  );
};

export default Profile;
