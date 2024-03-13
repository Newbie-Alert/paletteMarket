# Palette Market

## Overview

🕗 개발기간: 2024. 1 ~ 2024. 2  

💻 배포 주소: [https://mucation-project.vercel.app](https://palette-market-gold.vercel.app/)



<br/>

## 팀소개

이하빈: 

이락균: 

김건우: https://github.com/doodookim

정혜원: 

전지현: https://github.com/jihyun-j

<br/>

## 프로젝트 소개

<aside>
미대생 또는 미술을 취미로 하는 사람들이 미술용품을 중고로 거래할 수 있고, 고민, 끌팀 또는 미술을 주제로 한<br/>
커뮤니티를 형성할 수 있는 커뮤니티를 제공하는 서비스

</aside>

<br/>

## Stack

### Environment
 
<img src="https://img.shields.io/badge/GIT-F05032?style=for-the-badge&logo=Git&logoColor=white"/></a>
<img src="https://img.shields.io/badge/GITHUB-181717?style=for-the-badge&logo=GitHub&logoColor=white"/></a>
<img src="https://img.shields.io/badge/VISUAL STUDIO CODE-007ACC?style=for-the-badge&logo=visualstudiocode&logoColor=white"/></a>

### Config

<img src="https://img.shields.io/badge/YARN-2C8EBB?style=for-the-badge&logo=Yarn&logoColor=white"/></a>


### Development
<img src="https://img.shields.io/badge/HTML-E34F26?style=for-the-badge&logo=HTML5&logoColor=white"/></a>
<img src="https://img.shields.io/badge/CSS-1572B6?style=for-the-badge&logo=CSS3&logoColor=white"/></a>
<img src="https://img.shields.io/badge/JAVASCRIPT-F7DF1E?style=for-the-badge&logo=JavaScript&logoColor=black"/></a> 
<img src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=React&logoColor=black"/></a>
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)

### Database

![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)

### API

<img src="https://img.shields.io/badge/KAKAO MAP-FFCD00?style=for-the-badge&logo=KaKao&logoColor=black"/></a>  

### Communication

<img src="https://img.shields.io/badge/SLACK-4A154B?style=for-the-badge&logo=Slack&logoColor=white"/></a>
<img src="https://img.shields.io/badge/Notion-000000?style=for-the-badge&logo=Notion&logoColor=white"/></a>
<img src="https://img.shields.io/badge/FIGMA-F24E1E?style=for-the-badge&logo=Figma&logoColor=white"/></a>


<br>

## 프로젝트 구조

├── public
└── src
    ├── App.tsx
    ├── api
    │   └── supabase
    │       ├── community.ts
    │       ├── mypageQuery.ts
    │       ├── products.ts
    │       ├── profile.ts
    │       └── supabaseClient.ts
    ├── components
    │   ├── chat
    │   │   ├── ChatCompStyles.ts
    │   │   ├── chatMessages
    │   │   │   ├── ChatMessages.tsx
    │   │   │   ├── ChatMsg.tsx
    │   │   │   └── ChatMyMsg.tsx
    │   │   ├── chatRoom
    │   │   │   ├── ChatRoomFn.ts
    │   │   │   ├── ChatRoomList.tsx
    │   │   │   └── CheckDvice.ts
    │   │   └── types.ts
    │   ├── community
    │   │   ├── CategorySeletor.tsx
    │   │   ├── CommentInput.tsx
    │   │   ├── CommuFileList.tsx
    │   │   ├── CommunityList.tsx
    │   │   ├── CommunityMainCount.tsx
    │   │   ├── Reply.tsx
    │   │   ├── ReplyContent.tsx
    │   │   ├── ReplyForm.tsx
    │   │   ├── ReplyList.tsx
    │   │   └── WriteLayout.tsx
    │   ├── imagePreviewer
    │   │   ├── ImagePreviewFn.ts
    │   │   ├── ImagePreviewer.tsx
    │   │   ├── ImagePreviewerStyles.ts
    │   │   └── ImagePreviewerTypes.tsx
    │   ├── layout
    │   │   └── header
    │   │       ├── Hamburger.tsx
    │   │       ├── HamburgerStyle.ts
    │   │       ├── SearchBar.tsx
    │   │       └── SearchBarStyle.ts
    │   ├── main
    │   │   └── DataFetch.tsx
    │   ├── mainpage
    │   │   └── Carousel.tsx
    │   ├── map
    │   │   ├── MapFn.ts
    │   │   ├── MapStyles.ts
    │   │   ├── MapTypes.ts
    │   │   └── Maps.tsx
    │   ├── mypage
    │   │   ├── Commnity
    │   │   │   ├── MyPageCommuCard.tsx
    │   │   │   ├── MyPageCommuList.tsx
    │   │   │   └── MyPageCommunityPostList.tsx
    │   │   ├── Items
    │   │   │   └── MyPageItemList.tsx
    │   │   ├── Nothing.tsx
    │   │   ├── Profile
    │   │   │   ├── Profile.tsx
    │   │   │   ├── ProfileMobileNav.tsx
    │   │   │   └── QnAFrom.tsx
    │   │   └── Tabs
    │   │       └── Tabs.tsx
    │   ├── prducts
    │   │   ├── ProductsCard.tsx
    │   │   ├── ProductsList
    │   │   │   ├── PostsNothing.tsx
    │   │   │   ├── ProductCategory.tsx
    │   │   │   ├── ProductsListCard.tsx
    │   │   │   └── ProductsSortBtn.tsx
    │   │   ├── ProductsPosts
    │   │   │   ├── AddressBtn.tsx
    │   │   │   ├── ProductsImage.tsx
    │   │   │   └── ProductsWriteForm.tsx
    │   │   ├── ProductsSetData.ts
    │   │   ├── ProductsType.ts
    │   │   └── productsQuery.ts
    │   ├── productDetail
    │   │   ├── DetailInfo
    │   │   │   ├── ProductDetailInfo.tsx
    │   │   │   ├── ProductDetailInfoHeader.tsx
    │   │   │   └── styles.ts
    │   │   ├── ImageViewer.tsx
    │   │   ├── ProductDetailFn.ts
    │   │   ├── ProductDetailStyles.ts
    │   │   ├── ProductDetailTypes.ts
    │   │   ├── chatList
    │   │   │   ├── ChatListTypes.ts
    │   │   │   ├── ProductChatList.tsx
    │   │   │   └── detailBody
    │   │   │       ├── ProductButton.tsx
    │   │   │       ├── ProductDetailBody.tsx
    │   │   │       ├── ProductPriceWrapper.tsx
    │   │   │       ├── Recommend.tsx
    │   │   │       └── RecommendStyle.ts
    │   │   ├── customToast
    │   │   │   ├── CustomToast.tsx
    │   │   │   ├── CustomToastError.tsx
    │   │   │   └── CustomToastSuccess.tsx
    │   │   ├── detailCarousel
    │   │   │   ├── DetailCarousel.tsx
    │   │   │   ├── DetailCarouselStyle.ts
    │   │   │   └── ProductDetailCarousel.tsx
    │   │   └── infoStyle.ts
    │   ├── search
    │   │   └── CreatedTime.tsx
    │   ├── searchResults
    │   ├── sideBar
    │   │   ├── SideBar.tsx
    │   │   ├── SideBarFn.tsx
    │   │   ├── SideBarStyles.ts
    │   │   ├── SideBarTypes.ts
    │   │   ├── noti
    │   │   │   └── NotiRender.tsx
    │   │   └── sideBarRender
    │   │       └── SideBarRender.tsx
    │   ├── skeleton
    │   │   ├── ProductsSkeleton.tsx
    │   │   ├── SkeletonCommunityCard.tsx
    │   │   ├── SkeletonCommunityDetail.tsx
    │   │   └── SkeletonProductCard.tsx
    │   └── slider
    │       └── InfiniteCarousel.tsx
    ├── index.tsx
    ├── layouts
    │   ├── Footer.tsx
    │   ├── Header copy.tsx
    │   ├── Header.tsx
    │   ├── Layout.tsx
    │   ├── NotificationFn.ts
    │   ├── PrivateLayout
    │   │   └── PrivateLayout.tsx
    │   └── ScrollTopButton.tsx
    ├── pages
    │   ├── chat
    │   │   ├── ChatRoom.tsx
    │   │   ├── chatForm
    │   │   │   └── ChatForm.tsx
    │   │   ├── chatHeader
    │   │   │   ├── ChatHeader.tsx
    │   │   │   └── ChatHeaderType.ts
    │   │   ├── chat_utils
    │   │   │   ├── functions.ts
    │   │   │   └── inputClass.ts
    │   │   ├── style.ts
    │   │   └── supabaseChat
    │   │       └── supabase_chat.ts
    │   ├── community
    │   │   ├── CommuDetail.tsx
    │   │   ├── CommunityMain.tsx
    │   │   ├── WritePost.tsx
    │   │   ├── api
    │   │   │   ├── ReplyQuery.ts
    │   │   │   ├── commuQuery.ts
    │   │   │   ├── fileUploader.ts
    │   │   │   ├── imgaeUploader.ts
    │   │   │   └── model.ts
    │   │   └── hook
    │   │       └── useQuery.ts
    │   ├── home
    │   │   │
    │   │   ├── Home.tsx
    │   │   └── usedtypes.ts
    │   ├── login
    │   │   └── Login.tsx
    │   ├── mypage
    │   │   └── MyPage.tsx
    │   ├── postersProducts
    │   │   ├── PosterProductsFn.ts
    │   │   ├── PosterProductsStyle.ts
    │   │   └── PostersProducts.tsx
    │   ├── products
    │   │   ├── ProductsList.tsx
    │   │   ├── ProductsPosts.tsx
    │   │   └── ProductsPostsEdit.tsx
    │   ├── productsDetail
    │   │   ├── ProductDetail.tsx
    │   │   ├── style.ts
    │   │   ├── supabase_Detail
    │   │   │   └── supabaseAPI.ts
    │   │   └── types.ts
    │   └── searchResults
    │       ├── SearchResults.tsx
    │       └── researchItem.ts
    ├── react-app-env.d.ts
    ├── redux
    │   ├── HowtoUseRedux.tsx
    │   ├── modules
    │   │   ├── authSlice.ts
    │   │   ├── countPostsAndItemsSlice.ts
    │   │   ├── example.ts
    │   │   ├── openForm.ts
    │   │   ├── searchSlice.ts
    │   │   └── tabSlice.ts
    │   ├── reduxHooks
    │   │   └── reduxBase.ts
    │   └── store
    │       └── store.ts
    ├── reportWebVitals.ts
    ├── router
    │   └── Router.tsx
    ├── service-worker.ts
    ├── serviceWorkerRegistration.ts
    ├── styles
    │   ├── GlobalStyle.ts
    │   ├── community
    │   │   ├── CommentStyle.ts
    │   │   ├── CommunityDetailStyle.ts
    │   │   ├── CommunityListStyle.ts
    │   │   ├── CommunityMainStyle.ts
    │   │   └── CommunityWriteStyle.ts
    │   ├── footerStyle
    │   │   └── FooterStyle.ts
    │   ├── headerStyle
    │   │   └── HeaderStyle.ts
    │   ├── loginStyle
    │   │   └── LoginStyle.ts
    │   ├── mainStyle
    │   │   └── MainStyle.ts
    │   ├── mypageStyle
    │   │   ├── CommunityCardStyle.ts
    │   │   ├── MyPageStyle.ts
    │   │   ├── Nothing.ts
    │   │   ├── ProductCardStyle.ts
    │   │   ├── ProfileMobileNavStyle.ts
    │   │   ├── ProfileStyle.ts
    │   │   ├── QnAFormStyle.ts
    │   │   └── TabsStyle.ts
    │   ├── products
    │   │   ├── productsList
    │   │   │   ├── StProductsCard.ts
    │   │   │   ├── StProductsCategory.ts
    │   │   │   ├── StProductsList.ts
    │   │   │   ├── StProductsNothing.ts
    │   │   │   └── StProductsSkeleton.ts
    │   │   └── productsPosts
    │   │       ├── StProductsImageUpload.ts
    │   │       ├── StProductsPosts.ts
    │   │       └── StProductsWriteForm.ts
    │   ├── searchresults
    │   │   ├── Dropdown.tsx
    │   │   └── SearchResultsStyle.ts
    │   └── skeleton
    │       └── Skeleton.ts
    └── util
        └── getDate.ts



<br>

## 화면구성

- 로그인 /  회원가입
    - Supabase Auth UI를 이용해 Kakao, Facebook, Google 소셜 로그인을 구현 함

- 홈(메인) 페이지
    - 최근에 게시된 중고 물품과 커뮤니티 글을 확인할 수 있음

- 중고 상품 판매
    - react-hook-form을 사용해 중고 물품 거래에 필요한 내용을 작성할 수 있는 폼을 제공
    - 물품 거래에 필요한 내용들: 제품 이미지, 제품상태, 거래위치, 개수, 가격, 제품 태그 등이 포함되어 있음
    
- 중고 상품 판매 상세
    -  판매자가 게시한 물품의 상세 정보를 확인할 수 있음
    -  채팅 기능을 이용해 구매자는 판매자에게 채팅을 걸어 거래방식이나 가격을 조율할 수 있음

- 커뮤니티
    - 사용자들의 고민, 꿀팁 또는 미술을 주제로하여 커뮤니티에 게시글을 작성할 수 있음 (익명으로도 작성이 가능)
    - 작성된 게시글에 사용자들은 댓글과 대댓글을 남길 수 있고 관심있는 글에 '좋아요'를 클릭할 수 있음 (익명 댓글도 가능)

  
- 프로필
    - 사용자가 직접 판매한 상품, 구매한 상품, 찜한 상품, 커뮤니티 추천 글, 커뮤니티 게시글 들을 모아서 볼 수 있음
    - 사용자의 닉네임과 이미지를 수정할 수 있음

<br>

## 주요기능

### 📌 실시간 채팅과 알림 기능

- 중고 상품 판매자와 구매자가 실시간 채팅을 이용해 의사소통하고 거래 함
- 새로운 채팅이 생성되었을 때 알림 기능 작동 (구매자가 판매자에게 메세지를 보냈을 때 판매자의 알림이 울림)

### 📌 중고 상품 게시 기능

- 판매자가 판매하고자 하는 상품에 대한 가격, 상태, 거래 위치, 상품의 이미지를 업로드해 상품을 게시 함
- 구매자와 판매자가 거래가 성사 되었을 때 판매자는 '판매완료' 처리를 할 수 있음

### 📌 검색 기능

- 

<br/>

## 📂 아키텍처

