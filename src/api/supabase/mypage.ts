import { Product } from '../../pages/productsDetail/types';
import { supabase } from './supabaseClient';
const userId = localStorage.getItem('userId');
const CARDS_PER_SCROLL = 10;

export const getMyItems = async ({ pageParam = 1 }) => {
  let myItemResults;

  let { data: getMyItems, error } = await supabase
    .from('products')
    .select('*')
    .explain({ format: 'json', analyze: true });

  if (Array.isArray(getMyItems)) {
    myItemResults = getMyItems
      .map((item) => item.Plan)
      .map((item: any) => item.Plans)
      .map((item) => item[0])
      .map((item) => item)[0];
  }

  const { data } = await supabase
    .from('products')
    .select('*')
    .eq('post_user_uid', userId)
    .range(
      (pageParam - 1) * CARDS_PER_SCROLL,
      pageParam * CARDS_PER_SCROLL - 1
    );

  const myItemData = {
    total_length: myItemResults['Actual Rows'],
    data: data,
    page: pageParam,
    total_pages: Math.ceil(myItemResults['Actual Rows'] / CARDS_PER_SCROLL)
  };
  if (error) {
    throw error;
  }

  return myItemData;
};

export const getPurchasedItems = async ({ pageParam = 1 }) => {
  let purchasedItemResults;

  let { data: purchasedItems, error } = await supabase
    .from('products')
    .select('*')
    .explain({ format: 'json', analyze: true });

  if (Array.isArray(purchasedItems)) {
    purchasedItemResults = purchasedItems
      .map((item) => item.Plan)
      .map((item: any) => item.Plans)
      .map((item) => item[0])
      .map((item) => item)[0];
  }

  const { data } = await supabase
    .from('products')
    .select('*')
    .eq('buyer_uid', userId)
    .range(
      (pageParam - 1) * CARDS_PER_SCROLL,
      pageParam * CARDS_PER_SCROLL - 1
    );

  const myPurchasedItemsData = {
    total_length: purchasedItemResults['Actual Rows'],
    data: data,
    page: pageParam,
    total_pages: Math.ceil(
      purchasedItemResults['Actual Rows'] / CARDS_PER_SCROLL
    )
  };
  if (error) {
    throw error;
  }

  return myPurchasedItemsData;
};

export const getFavoriteItems = async ({ pageParam = 1 }) => {
  let favItemsResults;

  let { data: favItems, error } = await supabase
    .from('products')
    .select('*')
    .explain({ format: 'json', analyze: true });

  if (Array.isArray(favItems)) {
    favItemsResults = favItems
      .map((item) => item.Plan)
      .map((item: any) => item.Plans)
      .map((item) => item[0])
      .map((item) => item)[0];
  }

  let { data } = await supabase
    .from('products')
    .select('*')
    .range(
      (pageParam - 1) * CARDS_PER_SCROLL,
      pageParam * CARDS_PER_SCROLL - 1
    );

  if (data && data.length > 0) {
    const filteredFavItems = data
      .filter((product) =>
        product.like_user?.some(
          (like: { user_uid: string }) => like.user_uid === userId
        )
      )
      .map((product) => product);

    const myPurchasedItemsData = {
      total_length: favItemsResults['Actual Rows'],
      data: filteredFavItems,
      page: pageParam,
      total_pages: Math.ceil(favItemsResults['Actual Rows'] / CARDS_PER_SCROLL)
    };
    return (favItemsResults = myPurchasedItemsData);
  }

  return favItemsResults;
};

export const getCommunityPosts = async ({ pageParam = 1 }) => {
  let myPostResults;

  let { data: communityPosts, error } = await supabase
    .from('community')
    .select('*')
    .explain({ format: 'json', analyze: true });

  if (Array.isArray(communityPosts)) {
    myPostResults = communityPosts
      .map((item) => item.Plan)
      .map((item: any) => item.Plans)
      .map((item) => item[0])
      .map((item) => item)[0];
  }

  const { data } = await supabase
    .from('community')
    .select('*')
    .eq('post_user', userId)
    .range(
      (pageParam - 1) * CARDS_PER_SCROLL,
      pageParam * CARDS_PER_SCROLL - 1
    );

  const myItemData = {
    total_length: myPostResults['Actual Rows'],
    data: data,
    page: pageParam,
    total_pages: Math.ceil(myPostResults['Actual Rows'] / CARDS_PER_SCROLL)
  };
  if (error) {
    throw error;
  }

  return myItemData;
};

export const getFavCommunityPosts = async ({ pageParam = 1 }) => {
  let myFavPostResults;

  let { data: favCommunityPosts, error } = await supabase
    .from('community')
    .select('*')
    .explain({ format: 'json', analyze: true });

  if (Array.isArray(favCommunityPosts)) {
    myFavPostResults = favCommunityPosts
      .map((item) => item.Plan)
      .map((item: any) => item.Plans)
      .map((item) => item[0])
      .map((item) => item)[0];
  }

  const { data } = await supabase
    .from('community')
    .select('*')
    .range(
      (pageParam - 1) * CARDS_PER_SCROLL,
      pageParam * CARDS_PER_SCROLL - 1
    );

  if (data && data.length > 0) {
    const filteredFavProducts = data
      .filter((user) => user.likes_user?.includes(userId))
      .map((item) => item);
    const myFavItemData = {
      total_length: myFavPostResults['Actual Rows'],
      data: filteredFavProducts,
      page: pageParam,
      total_pages: Math.ceil(myFavPostResults['Actual Rows'] / CARDS_PER_SCROLL)
    };
    return (myFavPostResults = myFavItemData);
  }
  return myFavPostResults;
};
