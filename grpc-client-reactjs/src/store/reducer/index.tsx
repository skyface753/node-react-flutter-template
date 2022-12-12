import { DefaultAuthResponse, User } from '../../proto/grpc-proto/auth_pb';

export enum ActionType {
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
  CHANGE_USERNAME = 'CHANGE_USERNAME',
  CHANGE_AVATAR = 'CHANGE_AVATAR',
}

export interface IAction {
  type: ActionType;
  payload:
    | DefaultAuthResponse.AsObject
    | {
        username: string;
      }
    | {
        avatar: string;
      }
    | ActionType.LOGOUT;
}

export interface IAuthState {
  isLoggedIn: boolean;
  user: User.AsObject | null;
  accessToken: string | null;
  refreshToken: string | null;
  csrfToken: string | null;
}

export function storeLogin(userAndTokens: DefaultAuthResponse.AsObject) {
  localStorage.setItem('isLoggedIn', JSON.stringify(true));
  console.log('User to Store: ', userAndTokens.user);
  localStorage.setItem('user', JSON.stringify(userAndTokens.user));
  localStorage.setItem('accessToken', userAndTokens.accessToken);
  localStorage.setItem('refreshToken', userAndTokens.refreshToken);
  localStorage.setItem('csrfToken', userAndTokens.csrfToken);
}

export const reducer = (state: IAuthState, action: IAction) => {
  const { type, payload } = action;
  switch (type) {
    case ActionType.LOGIN: {
      storeLogin(payload as DefaultAuthResponse.AsObject);
      return {
        ...state,
        isLoggedIn: true,
        user: (payload as DefaultAuthResponse.AsObject)
          .user as unknown as User.AsObject,
        accessToken: (payload as DefaultAuthResponse.AsObject).accessToken,
        refreshToken: (payload as DefaultAuthResponse.AsObject).refreshToken,
        csrfToken: (payload as DefaultAuthResponse.AsObject).csrfToken,
      } as IAuthState;
    }
    case ActionType.LOGOUT: {
      //TODO clear local storage specific
      localStorage.clear();
      return {
        ...state,
        isLoggedIn: false,
        user: null,
        accessToken: null,
        refreshToken: null,
        csrfToken: null,
      } as IAuthState;
    }
    case ActionType.CHANGE_USERNAME: {
      const { username } = payload as { username: string };
      // TODO: update local storage
      if (localStorage.getItem('user')) {
        const user = JSON.parse(localStorage.getItem('user')!);
        user.username = username;
        localStorage.setItem('user', JSON.stringify(user));
      }

      return {
        ...state,
        user: {
          ...state.user,
          username: username,
        } as User.AsObject,
      } as IAuthState;
    }
    case ActionType.CHANGE_AVATAR: {
      const { avatar } = payload as { avatar: string };
      // Avatar as URL
      if (localStorage.getItem('user')) {
        const user = JSON.parse(localStorage.getItem('user')!);
        user.avatar = avatar;
        localStorage.setItem('user', JSON.stringify(user));
      }
      return {
        ...state,
        user: {
          ...state.user,
          avatar: avatar,
        } as User.AsObject,
      } as IAuthState;
    }
    default:
      return state;
  }
};

// export const initialState: IAuthState = {
//   isLoggedIn: localStorage.getItem('isLoggedIn') === 'true',
//   user: localStorage.getItem('user')
//     ? JSON.parse(localStorage.getItem('user')!)
//     : null,
//   accessToken: localStorage.getItem('accessToken'),
//   refreshToken: localStorage.getItem('refreshToken'),
//   csrfToken: localStorage.getItem('csrfToken'),
// };

export const initialState = {
  isLoggedIn: localStorage.getItem('isLoggedIn') === 'true',
  user: localStorage.getItem('user')
    ? (JSON.parse(localStorage.getItem('user')!) as User.AsObject)
    : null,

  accessToken: localStorage.getItem('accessToken'),
  refreshToken: localStorage.getItem('refreshToken'),
  csrfToken: localStorage.getItem('csrfToken'),
};
