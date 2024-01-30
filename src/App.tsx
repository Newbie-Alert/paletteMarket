import './App.css';
import Router from './router/Router';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';





const queryclient = new QueryClient();
function App() {
  return (
    // TODO: Provider들은 필요한 곳에 한 번에 몰아넣기 or Providers라는 컴포넌트로 하나로 만들기 => 그냥 보기 편하게 하기 위함 
    <QueryClientProvider client={queryclient}>
      <Router />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;

// TODO: EX)
// import { Provider } from 'react-redux';
// import { store } from './redux/store/store';
// import { ReactNode } from 'react';

// const Providers = ({ children }: { children: ReactNode }) => {
//   return (
//     <QueryClientProvider client={queryclient}>
//       <Provider store={store}>
//         {children}
//       </Provider>
//     </QueryClientProvider>
//   )
// }