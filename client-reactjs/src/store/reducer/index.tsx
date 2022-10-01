const tryParse = (jsonString: any) => {
  try {
    var o = JSON.parse(jsonString || '');
    if (o && typeof o === 'object') {
      return o;
    }
    return o;
  } catch (e) {
    return null;
  }
};

// type User = {
//   id: number;
//   email: string;
//   username: string;
//   roleFk: number;
//   avatar: string;
// };

class User {
  id: number;
  email: string;
  username: string;
  roleFk: number;
  avatar: string;

  constructor(
    id: number,
    email: string,
    username: string,
    roleFk: number,
    avatar: string
  ) {
    this.id = id;
    this.email = email;
    this.username = username;
    this.roleFk = roleFk;
    this.avatar = avatar;
  }
}

export interface IState {
  isLoggedIn: boolean;
  user: User | null | any;
  accessToken: string | null;
  refreshToken: string | null;
  csrfToken: string | null;
}

type PayloadLogin = {
  user: User;
  isLoggedIn: boolean;
  accessToken: string;
  refreshToken: string;
  csrfToken: string;
};

type PayloadChangeAvatar = {
  avatar: string;
};

interface IAction {
  type: string;
  payload: PayloadLogin | PayloadChangeAvatar;
}

const getUser: () => User | null = () => {
  const user = tryParse(localStorage.getItem('user'));
  if (user) {
    return new User(
      user.id,
      user.email,
      user.username,
      user.roleFk,
      user.avatar
    );
  }
  return null;
};

export const initialState: IState = {
  isLoggedIn: tryParse(localStorage.getItem('isLoggedIn')) || false,
  user: getUser() || null,

  // user: tryParse(localStorage.getItem('user')) || null,
  accessToken: tryParse(localStorage.getItem('accessToken')) || null,
  refreshToken: tryParse(localStorage.getItem('refreshToken')) || null,
  csrfToken: tryParse(localStorage.getItem('csrfToken')) || null,
};

enum ActionType {
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
  CHANGE_USERNAME = 'CHANGE_USERNAME',
  CHANGE_AVATAR = 'CHANGE_AVATAR',
}

export const reducer = (state: IState, action: IAction) => {
  const { type, payload } = action;
  switch (type) {
    case ActionType.LOGIN: {
      // Check if payload is of type PayloadLogin
      action.payload = action.payload as PayloadLogin;
      localStorage.setItem(
        'isLoggedIn',
        JSON.stringify(action.payload.isLoggedIn)
      );
      localStorage.setItem('user', JSON.stringify(action.payload.user));
      localStorage.setItem(
        'accessToken',
        JSON.stringify(action.payload.accessToken)
      );
      localStorage.setItem(
        'refreshToken',
        JSON.stringify(action.payload.refreshToken)
      );
      localStorage.setItem(
        'csrfToken',
        JSON.stringify(action.payload.csrfToken)
      );
      return {
        ...state,
        isLoggedIn: action.payload.isLoggedIn,
        user: action.payload.user,
      };
    }
    case ActionType.LOGOUT: {
      localStorage.clear();
      return {
        ...state,
        isLoggedIn: false,
        user: null,
      };
    }
    case ActionType.CHANGE_USERNAME: {
      action.payload = action.payload as PayloadLogin;

      localStorage.setItem('user', JSON.stringify(action.payload.user));
      return {
        ...state,
        user: action.payload.user,
      };
    }
    case ActionType.CHANGE_AVATAR: {
      // Old user
      const oldUser = state.user;
      action.payload = action.payload as PayloadChangeAvatar;
      // New user
      const newUser = {
        ...oldUser,
        avatar: action.payload.avatar,
      };
      // Set new user
      localStorage.setItem('user', JSON.stringify(newUser));
      console.log('newUser: ', newUser);
      return {
        ...state,
        user: newUser,
      };
    }
    default:
      return state;
  }
};
