// auth.js
import { auth } from './firebase';

export const isLoggedIn = () => {
  return auth.currentUser !== null;
};
