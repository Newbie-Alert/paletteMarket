import parse from 'html-react-parser';
import React, { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import 'react-quill/dist/quill.snow.css';
import { useNavigate, useParams } from 'react-router';
import styled from 'styled-components';
import { supabase } from '../../api/supabase/supabaseClient';
import Comment from '../../components/community/Comment';
import parseDate from '../../util/getDate';
import WriteLayout from './WriteLayout';
import { deletePostMutation, fetchDetailPost } from './commuQuery';
import { FilesObject } from './model';
// Quill.register('modules/imageActions', ImageActions);
// Quill.register('modules/imageFormats', ImageFormats);

const CommuDetail: React.FC = () => {
  const param = useParams();
  const navigate = useNavigate();
  const [isEditState, setIsEditState] = useState(false);
  const [userId, setUserId] = useState('');
  useEffect(() => {
    const fetchData = async () => {
      try {
        const {
          data: { user }
        } = await supabase.auth.getUser();
        setUserId(user!.id);
        console.log(userId);
      } catch (error: any) {
        console.log(error.message);
      }
    };

    fetchData();
  }, []);

  const queryClient = useQueryClient();
  const {
    data: posts,
    isLoading,
    isError
  } = useQuery(['posts', param.id], () => fetchDetailPost(param.id));
  const deleteMutation = useMutation(deletePostMutation, {
    onSuccess: () => {
      queryClient.invalidateQueries('posts');
    }
  });
  if (isLoading) {
    return <div></div>;
  }

  if (isError) {
    return <div>Error loading posts</div>;
  }
  console.log('detail이에요');
  const deletePost = async () => {
    if (window.confirm(`정말로"${posts![0].title}" 글을 삭제하시겠습니까?`)) {
      deleteMutation.mutate(param.id);
      navigate('/community');
    }
  };

  return (
    <Container>
      {isEditState ? (
        <WriteWrap>
          <h1>게시글 수정</h1>
          <WriteLayout
            profile={undefined}
            isEdit={true}
            paramId={param.id}
            setIsEditState={setIsEditState}
          />
        </WriteWrap>
      ) : (
        <ContentsContainer>
          <div>
            {posts?.map((post) => {
              return (
                <div key={post.post_id}>
                  <Topper>
                    <TopperLeft>
                      <h1>{post.title}</h1>
                      <p>{!!post.anon ? '익명의 작업자' : post.nickname}</p>
                    </TopperLeft>

                    <TopperRight>
                      <p>{parseDate(post.created_at)}</p>
                    </TopperRight>
                  </Topper>{' '}
                  <Category>{post.category}</Category>
                  <Content>{parse(post.content)}</Content>
                  {post.files && post.files.length > 0 && (
                    <div>
                      {post.files.map((file: FilesObject, index: number) => (
                        <a
                          key={index}
                          href={file.url[index]}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {file.name}
                        </a>
                      ))}
                    </div>
                  )}{' '}
                  <FeatureArea>
                    {posts![0].post_user === userId ? (
                      <div>
                        <button
                          onClick={() => {
                            setIsEditState(true);
                          }}
                        >
                          수정
                        </button>
                        <button onClick={deletePost}>삭제</button>
                      </div>
                    ) : (
                      ''
                    )}
                    <IconContainer>
                      <Icon src="/assets/heart.png" />
                      <p>0</p>
                    </IconContainer>
                  </FeatureArea>
                  <p>{`${post.comment.length}개의 댓글`}</p>
                </div>
              );
            })}{' '}
          </div>

          <div>
            <Comment userId={userId} paramId={param.id} />
          </div>
        </ContentsContainer>
      )}
    </Container>
  );
};
const Content = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 24px;
  line-height: 30px;
  min-height: 600px;
`;
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  & strong {
    font-weight: bold;
  }
  & em {
    font-style: italic;
  }
  & p {
    display: flex;
  }
`;
const FeatureArea = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
`;
const ContentsContainer = styled.div`
  width: 80%;
  max-width: 1116px;
  min-height: 600px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;
const WriteWrap = styled.div`
  width: 80%;
  max-width: 906px;

  & h1 {
    font-size: 30px;
    margin-top: 50px;
    text-align: center;
    margin-bottom: 20px;
  }
`;
const Icon = styled.img`
  width: 20px;
`;
const Topper = styled.div`
  margin-top: 10px;
  display: flex;
  justify-content: space-between;
  width: 100%;
  max-width: 1116px;
  margin-bottom: 10px;
`;
const TopperRight = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;
const TopperLeft = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  & h1 {
    font-size: 20px;
    font-weight: bold;
  }
`;
const IconContainer = styled.div`
  display: flex;
  justify-content: end;
  font-size: 14px;
  align-items: center;
`;
const Category = styled.p`
  background-color: #636363;
  color: white;
  width: fit-content;
  padding: 12px;
  border-radius: 6px;
`;

export default CommuDetail;
