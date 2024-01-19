import { supabase } from './supabaseClient';

export const logOut = async () => {
  let { error } = await supabase.auth.signOut();
  if (error) console.log(error);
};

export const userId = localStorage.getItem('userId');
