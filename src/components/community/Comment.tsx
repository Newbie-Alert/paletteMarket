import React, { FormEvent, useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import 'react-quill/dist/quill.snow.css';
import { supabase } from '../../api/supabase/supabaseClient';
import * as St from '../../styles/community/CommentStyle';

import {
  fetchDetailPost,
  updatePostMutation
} from '../../pages/community/commuQuery';
import {
  CommentProps,
  Comments,
  ProfileObject
} from '../../pages/community/model';
import parseDate from '../../util/getDate';

// TODO: 비즈니스 & UI 분리해보기
const Comment: React.FC<CommentProps> = ({ userId, paramId, likes }) => {
  const queryClient = useQueryClient();
  // react-query 혹은 custom hook으로 분리하여 profile 세팅
  useEffect(() => {
    const fetchData = async () => {
      if (userId) {
        try {
          const { data: user, error } = await supabase
            .from('user')
            .select('*')
            .eq('id', userId);
          // console.log(user);
          if (error) {
            console.log(error);
          }

          if (user != null) {
            setProfile(user);
            // console.log(user);
          }
        } catch (error: any) {
          console.log(error.message);
        }
      }
    };
    fetchData();
  }, []);

  const {
    data: posts,
    isLoading,
    isError
  } = useQuery(['post', paramId], () => fetchDetailPost(paramId));

  const [isEdit, setisEdit] = useState(false);
  const [comments, setComments] = useState<Comments>([]);
  const [profile, setProfile] = useState<ProfileObject[]>([]);
  const [comment, setComment] = useState('');
  const [editComment, setEditComment] = useState('');
  const [editedCommentIndex, setEditedCommentIndex] = useState<number | null>(
    null
  ); // 수정 중인 댓글의 인덱스
  const [anon, setAnon] = useState(false);
  const [liked, setLiked] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  useEffect(() => {
    // 사용자가 이미 좋아요를 했는지 확인
    const userLiked = posts?.[0]?.likes_user?.includes(userId);
    if (userLiked) {
      setLiked(true);
    }
  }, [posts, userId]);

  const toggleLike = async () => {
    const newLikedStatus = !liked;
    setLiked(newLikedStatus);

    // 기본값으로 빈 배열 설정
    const currentLikeUsers = posts![0]?.likes_user || [];

    const updatedLikes = newLikedStatus ? likes! + 1 : likes! - 1;
    let updatedLikeUsers;
    if (newLikedStatus) {
      updatedLikeUsers = [...currentLikeUsers, userId];
    } else {
      updatedLikeUsers = currentLikeUsers.filter((id: string) => id !== userId);
    }

    const likesUpdate = {
      updateData: {
        likes: updatedLikes,
        likes_user: updatedLikeUsers
      },
      paramId
    };
    upsertMutation.mutate(likesUpdate);
  };
  useEffect(() => {
    if (!isLoading && posts) {
      setComments(posts[0].comment);
    }
  }, [isLoading, posts]);
  const upsertMutation = useMutation(updatePostMutation, {
    onSuccess: () => {
      queryClient.invalidateQueries(['posts', paramId]);
      setAnon(false);
      setComment('');
    }
  });
  const updateComment = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (comment) {
      const newComment = {
        //   comment_id: uuid(),
        comment_user: profile![0].id,
        nickname: profile![0].nickname
          ? profile![0].nickname
          : profile![0].username,
        comment,
        anon,
        time: Date()
      };
      setComments((prevComments) => [...prevComments, newComment]);
      const commentObject = {
        updateData: {
          comment: [...comments, newComment]
        },
        paramId
      };
      upsertMutation.mutate(commentObject);
    }
  };

  // 댓글 수정 버튼 클릭 시
  const startEditComment = (index: number) => {
    setisEdit(true);
    setEditedCommentIndex(index);
    setEditComment(comments[index].comment);
  };

  const updateCommentDetail = (index: number) => {
    if (isEdit && editedCommentIndex !== null) {
      // 수정 중인 댓글을 업데이트
      const updatedComments = comments.map((comment, index) =>
        index === editedCommentIndex
          ? { ...comment, comment: editComment }
          : comment
      );

      setComments(updatedComments);
      setEditedCommentIndex(null);

      const commentObject = {
        updateData: {
          comment: updatedComments
        },
        paramId
      };
      upsertMutation.mutate(commentObject);
    }
  };

  const deleteComment = (index: number) => {
    if (window.confirm('댓글을 삭제하시겠습니까?')) {
      const updatedComments = comments.filter((_, idx) => idx !== index);

      setComments(updatedComments);

      // 삭제된 댓글을 서버로 업데이트
      const commentObject = {
        updateData: {
          comment: updatedComments
        },
        paramId
      };
      upsertMutation.mutate(commentObject);
    }
  };
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error loading posts</div>;
  }

  return (
    <St.Container>
      <St.CountDivTop>
        <div onClick={toggleLike}>
          {liked ? <St.LikesIconOn /> : <St.LikesIcon className="likes" />}
        </div>
        <p>{likes}</p>

        <St.CommentIcon className="comment" />
        <p>{`${comments.length}개의 댓글`}</p>
      </St.CountDivTop>

      <St.Form
        onSubmit={updateComment}
        $isFocused={isFocused}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      >
        <div>
          <St.CommentInput
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="댓글을 입력하세요"
          />
          <button type="submit">
            <St.SendIcon />
          </button>
        </div>

        <St.AnonLabel>
          <St.CheckBoxs
            type="checkbox"
            checked={anon}
            onChange={() => setAnon(!anon)}
          />
          익명
        </St.AnonLabel>
      </St.Form>

      {comments?.map((comment, index) => {
        const parseTime = parseDate(comment.time);
        return (
          <St.CommentContainer key={index}>
            <St.LeftCommentSide>
              <St.LeftSide>
                <St.Name>
                  {comment.anon ? '익명의 작업자' : comment.nickname}
                </St.Name>
                <St.Time>{parseTime}</St.Time>
              </St.LeftSide>
              {isEdit && editedCommentIndex === index ? (
                <input
                  value={editComment}
                  onChange={(e) => setEditComment(e.target.value)}
                />
              ) : (
                <St.CommentContent>{comment.comment}</St.CommentContent>
              )}
            </St.LeftCommentSide>{' '}
            <St.UpdateBtnContainer>
              {profile.length > 0 && comment.comment_user === profile[0].id ? (
                isEdit && editedCommentIndex === index ? (
                  <p onClick={() => updateCommentDetail(index)}>수정완료</p>
                ) : (
                  <>
                    <p onClick={() => startEditComment(index)}>수정</p>
                    <p>|</p>
                    <p onClick={() => deleteComment(index)}>삭제</p>
                  </>
                )
              ) : (
                <></>
              )}
            </St.UpdateBtnContainer>
            {/* <button>신고</button> */}
          </St.CommentContainer>
        );
      })}
    </St.Container>
  );
};

export default React.memo(Comment);
