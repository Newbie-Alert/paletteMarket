import { useState } from 'react';
import { StTab, StTabsContainer } from '../../../styles/mypageStyle/TabsStyle';
import MyPageItemList from '../Items/MyPageItemList';
import MyPageCommunityPostList from '../Commnity/MyPageCommunityPostList';
import { useAppSelector } from '../../../redux/reduxHooks/reduxBase';

const Tabs = () => {
  const count = useAppSelector((state) => state.count);
  const tabMenuArray = [
    { label: '내 물품', value: count.myItems },
    { label: '구매한 물품', value: count.purchasedItems },
    { label: '찜한 물품', value: count.favItems },
    { label: '내가 쓴 글', value: count.myPosts },
    { label: '추천한 글', value: count.favPosts }
  ];

  // TODO: null은 안넣어도 되지 않을까? 
  // TODO: toggle이 아니라 다른 이름을 지어야할 듯. toggle은 켜고 끄는 스위치같은 느낌
  // const [toggle, setToggle] = useState<number | null>(0);
  const [toggle, setToggle] = useState<number>(0);
  const clickToggleTab = (index: number) => {
    setToggle(index);
  };

  return (
    <>
      <StTabsContainer>
        {tabMenuArray.map((menu, index) => {
          return (
            <StTab
              key={index}
              onClick={() => clickToggleTab(index)}
              active={toggle === index}
            >
              {`${menu.label} (${menu.value.length})`}
            </StTab>
          );
        })}
      </StTabsContainer>

      {toggle === 0 || toggle === 1 || toggle === 2 ? (
        <MyPageItemList activeTab={toggle} />
      ) : (
        ''
      )}
      {toggle === 3 || toggle === 4 ? (
        <MyPageCommunityPostList activeTab={toggle} />
      ) : (
        ''
      )}
      {/* TODO: 삼항연산자로 만들기 or 더 좋은 방법없나? */}
      {/* {0 <= toggle && toggle <= 2 ? (
        <MyPageItemList activeTab={toggle} />
      ) : (
        <MyPageCommunityPostList activeTab={toggle} />
      )} */}
    </>
  );
};

export default Tabs;

