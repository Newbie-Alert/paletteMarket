import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Layout from '../layout/Layout';
import ChatRoom from '../pages/chat/ChatRoom';
import CommuDetail from '../pages/community/CommuDetail';
import CommunityMain from '../pages/community/CommunityMain';
import WritePost from '../pages/community/WritePost';
import Home from '../pages/home/Home';
import Login from '../pages/login/Login';
import MyPage from '../pages/mypage/MyPage';
import Products from '../pages/products/Products';
import ProductsPosts from '../pages/products/ProductsPosts';
import SearchResults from '../pages/searchResults/SearchResults';
import { GlobalStyles } from '../styles/GlobalStyle';
import ProductDetail from '../pages/productsDetail/ProductDetail';

const Router = () => {
  return (
    <BrowserRouter>
      <GlobalStyles />
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="mypage" element={<MyPage />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/detail/:id" element={<ProductDetail />} />
          <Route path="/productsposts" element={<ProductsPosts />} />
          <Route path="/community" element={<CommunityMain />} />
          <Route path="/community_write" element={<WritePost />} />
          <Route path="/search-results" element={<SearchResults />} />
          <Route path="/chat" element={<ChatRoom />} />
          <Route path="/community/detail/:id" element={<CommuDetail />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
