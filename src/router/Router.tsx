import React, { Suspense } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Home from '../pages/home/Home';
import Login from '../pages/login/Login';
import SearchResults from '../pages/searchResults/SearchResults';
import ChatRoom from '../pages/chat/ChatRoom';
import { GlobalStyles } from '../styles/GlobalStyle';
import Layout from '../layouts/Layout';

const ProductDetail = React.lazy(
  () => import('../pages/productsDetail/ProductDetail')
);
const ProductsPosts = React.lazy(
  () => import('../pages/products/ProductsPosts')
);
const ProductsPostsEdit = React.lazy(
  () => import('../pages/products/ProductsPostsEdit')
);
const CommunityMain = React.lazy(
  () => import('../pages/community/CommunityMain')
);
const PostersProducts = React.lazy(
  () => import('../pages/postersProducts/PostersProducts')
);
const PrivateLayout = React.lazy(
  () => import('../layouts/PrivateLayout/PrivateLayout')
);
const ProductsList = React.lazy(() => import('../pages/products/ProductsList'));
const MyPage = React.lazy(() => import('../pages/mypage/MyPage'));
const WritePost = React.lazy(() => import('../pages/community/WritePost'));
const CommuDetail = React.lazy(() => import('../pages/community/CommuDetail'));

const Router = () => {
  return (
    <BrowserRouter>
      <GlobalStyles />
      <Suspense fallback={<div>로딩 중 </div>}>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Home />} />
            <Route path="/community" element={<CommunityMain />} />
            <Route path="/community/detail/:id" element={<CommuDetail />} />
            <Route path="/products" element={<ProductsList />} />
            <Route path="/postersProducts/:id" element={<PostersProducts />} />
            <Route path="/products/detail/:id" element={<ProductDetail />} />
            <Route path="/search-results" element={<SearchResults />} />
            <Route path="*" element={<Navigate to={'/'} replace />} />

            <Route element={<PrivateLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/mypage" element={<MyPage />} />
              <Route path="/chat" element={<ChatRoom />} />
              <Route path="/productsposts" element={<ProductsPosts />} />
              <Route
                path="/productsposts/edit/:id"
                element={<ProductsPostsEdit />}
              />
              <Route path="/community_write" element={<WritePost />} />
              <Route path="*" element={<Navigate to={'/'} replace />} />
            </Route>
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default Router;
