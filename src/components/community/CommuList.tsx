import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { useNavigate } from 'react-router';
import { fetchRangePosts } from '../../pages/community/commuQuery';
import { CommuListProps, Post } from '../../pages/community/model';
import * as St from '../../styles/community/CommunityListStyle';
import parseDate from '../../util/getDate';
const RANGE_POST_NUMBER = 12;
const CommuList: React.FC<CommuListProps> = ({
  selectCategory
}: {
  selectCategory: string;
}) => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const {
    data: postInfo,
    isLoading,
    isError
  } = useQuery(
    ['posts', currentPage, selectCategory],
    () => fetchRangePosts(currentPage, selectCategory),
    {
      onSuccess: (data) => {
        if (data.count) {
          setTotalPages(Math.ceil(data.count / RANGE_POST_NUMBER));
        }
      }
      // staleTime: 300000
    }
  );
  useEffect(() => {
    setCurrentPage(1); // 카테고리가 바뀔 때마다 첫 페이지로 리셋
  }, [selectCategory]);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // TODO: layout shift를 없애기 위한 Skeleton 만들기
  if (isLoading) {
    // return <SkeletonCommunityCard cards={2} />;
    return <></>;
  }

  if (isError) {
    return <div>Error loading posts</div>;
  }

  const handleText = (content: string): string => {
    // 정규 표현식을 사용하여 태그를 제외한 텍스트만 추출
    const textOnly = content.replace(/<[^>]*>|&nbsp;/g, ' ');

    return textOnly;
  };
  const posts = postInfo?.data;
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div>
      <St.Container>
        {posts?.map((post: Post) => {
          return (
            <St.Posts
              key={post.post_id}
              onClick={() => {
                navigate(`/community/detail/${post.post_id}`);
              }}
            >
              <div>
                {' '}
                <h2>{post.title}</h2>
                <St.ContentsContainer>
                  {post.main_image && (
                    <St.MainImg>
                      <img src={post.main_image} alt="Main" />
                    </St.MainImg>
                  )}

                  <St.ContentArea>{handleText(post.content)}</St.ContentArea>
                </St.ContentsContainer>
              </div>
              <St.RightSide>
                {' '}
                <St.CommentArea>
                  <St.LikesIcon />
                  <p>{post.likes}</p>
                  <St.CommentIcon />
                  <p>{post.comment?.length}</p>
                </St.CommentArea>
                <div>
                  <p>{parseDate(post.created_at)}</p>
                </div>
              </St.RightSide>
            </St.Posts>
          );
        })}
      </St.Container>
      <St.PageNumber>
        {pages.map((number) => (
          <St.PageBtn
            $currentPage={currentPage}
            $pageNumber={number}
            key={number}
            onClick={() => {
              setCurrentPage(number);
              window.scrollTo({ top: 0 });
            }}
          >
            {number}
          </St.PageBtn>
        ))}
      </St.PageNumber>
    </div>
  );
};

export default CommuList;
