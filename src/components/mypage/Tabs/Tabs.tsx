import { useState } from 'react';
import { StTab, StTabsContainer } from '../../../styles/mypageStyle/TabsStyle';
import MyPageItemList from '../Items/MyPageItemList';
import MyPageCommunityPostList from '../Commnity/MyPageCommunityPostList';
import { useAppSelector } from '../../../redux/reduxHooks/reduxBase';

const Tabs = () => {
  const count = useAppSelector((state) => state.item);
  const tabMenuArray = [
    { label: '내 물품', value: count.myItems },
    { label: '구매한 물품', value: count.purchasedItems },
    { label: '찜한 물품', value: count.favItems },
    { label: '내가 쓴 글', value: count.myPosts },
    { label: '추천한 글', value: count.favPosts }
  ];

  const [tab, setTab] = useState<number>(0);
  const clickToggleTab = (index: number) => {
    setTab(index);
  };

  return (
    <>
      <StTabsContainer>
        {tabMenuArray.map((menu, index) => {
          return (
            <StTab
              key={index}
              onClick={() => clickToggleTab(index)}
              active={tab === index}
            >
              {`${menu.label} (${menu.value.length})`}
            </StTab>
          );
        })}
      </StTabsContainer>

      {tab > 3 ? (
        <MyPageCommunityPostList activeTab={tab} />
      ) : (
        <MyPageItemList activeTab={tab} />
      )}
    </>
  );
};

export default Tabs;
