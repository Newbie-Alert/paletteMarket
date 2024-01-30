import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Routes
} from 'react-router-dom';
import Layout from '../layout/Layout';
import ChatRoom from '../pages/chat/ChatRoom';
import CommuDetail from '../pages/community/CommuDetail';
import CommunityMain from '../pages/community/CommunityMain';
import WritePost from '../pages/community/WritePost';
import Home from '../pages/home/Home';
import Login from '../pages/login/Login';
import MyPage from '../pages/mypage/MyPage';
import ProductsList from '../pages/products/ProductsList';
import ProductsPosts from '../pages/products/ProductsPosts';
import ProductDetail from '../pages/productsDetail/ProductDetail';
import SearchResults from '../pages/searchResults/SearchResults';
import { GlobalStyles } from '../styles/GlobalStyle';
import { useAppSelector } from '../redux/reduxHooks/reduxBase';

const Router = () => {
  // TODO: useSelector와 useAppSelector의 차이는?
  const { isLogin } = useAppSelector((state) => state.auth);

  return (
    <BrowserRouter>
      <GlobalStyles />
      <Routes>
        <Route element={<Layout />}>
          {/* TODO: 로그인이 필요한 페이지마다 다 Navigate 사용하기보다 하나로 묶는 것이 좋을 듯 */}
          <Route
            // TODO: :mode의 역할은?
            path="/login/:mode"
            element={isLogin ? <Navigate to="/" /> : <Login />}
          />
          <Route path="/" element={<Home />} />
          <Route
            path="/mypage"
            element={isLogin ? <MyPage /> : <Navigate to="/login/login" />}
          />
          <Route path="/products" element={<ProductsList />} />
          <Route
            path="/products/detail/:id"
            element={
              isLogin ? <ProductDetail /> : <Navigate to="/login/login" />
            }
          />
          <Route
            path="/productsposts"
            element={
              isLogin ? <ProductsPosts /> : <Navigate to="/login/login" />
            }
          />
          <Route path="/community" element={<CommunityMain />} />
          <Route
            path="/community_write"
            element={isLogin ? <WritePost /> : <Navigate to="/login/login" />}
          />
          <Route path="/search-results" element={<SearchResults />} />
          <Route
            path="/chat"
            element={isLogin ? <ChatRoom /> : <Navigate to="/login/login" />}
          />
          <Route
            path="/community/detail/:id"
            element={isLogin ? <CommuDetail /> : <Navigate to="/login/login" />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};


// TODO: 다른 파일로 빼기
const PrivateRoute = () => {
  const { isLogin } = useAppSelector((state) => state.auth);
  if (!isLogin) {
    // TODO: 왜 url이 login/login인지?
    return <Navigate to="/login/login" />
  }

  return <Outlet />
}

const Router2 = () => {
  const { isLogin } = useAppSelector((state) => state.auth);
  return (
    <BrowserRouter>
      <GlobalStyles />
      <Routes>
        <Route element={<Layout />}>
          {/* TODO: 로그인이 필요한 페이지마다 다 Navigate 사용하기보다 하나로 묶는 것이 좋을 듯 */}
          {/* TODO: 얘는 뭔지? */}
          {/* <Route
            path="/login/:mode"
            element={isLogin ? <Navigate to="/" /> : <Login />} /> */}
          <Route path="/" element={<Home />} />
          <Route path="/community" element={<CommunityMain />} />
          <Route path="/products" element={<ProductsList />} />
          <Route path="/search-results" element={<SearchResults />} />
          <Route
            // TODO: :mode의 역할은?
            path="/login/login"
            element={isLogin ? <Navigate to="/" /> : <Login />}
          />
          <Route element={<PrivateRoute />}>
            <Route path="/mypage" element={<MyPage />} />
            <Route path="/products/detail/:id" element={<ProductDetail />} />
            <Route path="/productsposts" element={<ProductsPosts />} />
            <Route path="/community_write" element={<WritePost />} />
            <Route path="/chat" element={<ChatRoom />} />
            <Route path="/community/detail/:id" element={<CommuDetail />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
export default Router2;