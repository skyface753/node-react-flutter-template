const tryParse = (jsonString: any) => {
  try {
    var o = JSON.parse(jsonString || '');
    return o;
  } catch (e) {
    return null;
  }
};
export const initialState = {
  // isLoggedIn:  JSON.parse(localStorage.getItem("isLoggedIn")) || false,
  isLoggedIn: tryParse(localStorage.getItem('isLoggedIn')) || false,
  user: tryParse(localStorage.getItem('user')) || null,
  accessToken: tryParse(localStorage.getItem('accessToken')) || null,
  refreshToken: tryParse(localStorage.getItem('refreshToken')) || null,
  csrfToken: tryParse(localStorage.getItem('csrfToken')) || null,
  // user: JSON.parse(localStorage.getItem("user")) || null,
  // client_id: process.env.REACT_APP_CLIENT_ID,
  // redirect_uri: process.env.REACT_APP_REDIRECT_URI,
  // client_secret: process.env.REACT_APP_CLIENT_SECRET,
  // proxy_url: process.env.REACT_APP_PROXY_URL,
};

export interface IState {
  isLoggedIn: boolean;
  user: any;
  accessToken: string;
  refreshToken: string;
  csrfToken: string;
}

interface IAction {
  type: string;
  payload: any;
}

export const reducer = (state: IState, action: IAction) => {
  switch (action.type) {
    case 'LOGIN': {
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
    case 'LOGOUT': {
      localStorage.clear();
      return {
        ...state,
        isLoggedIn: false,
        user: null,
      };
    }
    case 'CHANGE_USERNAME': {
      localStorage.setItem('user', JSON.stringify(action.payload.user));
      return {
        ...state,
        user: action.payload.user,
      };
    }
    default:
      return state;
  }
};
