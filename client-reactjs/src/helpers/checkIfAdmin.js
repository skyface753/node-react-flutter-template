import { useContext } from 'react';
import { AuthContext } from '../App';

export default function CheckIfAdmin() {
  const { state } = useContext(AuthContext);
  const user = state.user;
  const isLoggedIn = state.isLoggedIn;
  if (isLoggedIn) {
    if (user.roleFk === 2) {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
}
