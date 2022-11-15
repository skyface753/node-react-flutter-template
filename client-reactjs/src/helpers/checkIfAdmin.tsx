import { useContext } from 'react';
import { AuthContext } from '../App';
import { Role } from '../proto/auth_pb';

export default function CheckIfAdmin() {
  const { state } = useContext(AuthContext);
  const { user } = state;
  const isLoggedIn = state.isLoggedIn;
  if (user == null) {
    return false;
  }
  if (isLoggedIn) {
    if (user?.role === Role.ADMIN) {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
}
