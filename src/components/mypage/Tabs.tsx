import { useState } from 'react';
import { Tab, TabsContainer } from '../../styles/mypageStyle/TabsStyle';
import ProductCard from './ProductCard';
import CommunityPost from './CommunityPost';

const Tabs = () => {
  const [toggle, setToggle] = useState(1);

  const clickToggleTab = (index: number) => {
    setToggle(index);
  };

  return (
    <>
      <TabsContainer>
        <Tab active={toggle} tabIndex={1} onClick={() => clickToggleTab(1)}>
          내 상품
        </Tab>
        <Tab active={toggle} tabIndex={2} onClick={() => clickToggleTab(2)}>
          구매 상품
        </Tab>
        <Tab active={toggle} tabIndex={4}>
          찜목록
        </Tab>
        <Tab active={toggle} tabIndex={3} onClick={() => clickToggleTab(3)}>
          커뮤니티
        </Tab>
      </TabsContainer>

      {toggle === 1 ? <ProductCard activeTab={toggle} /> : null}
      {toggle === 2 ? <ProductCard activeTab={toggle} /> : null}
      {toggle === 3 ? <CommunityPost activeTab={toggle} /> : null}
    </>
  );
};

export default Tabs;
