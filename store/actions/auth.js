import AsyncStorage from '@react-native-async-storage/async-storage';

export const AUTHENTICATE = 'AUTHENTICATE';
export const LOGUOT = 'LOGUOT';

export const authenticate = (token, userId, expTime) => {
  return dispatch => {
    dispatch(setLogoutTimer(expTime));
    dispatch({
      type: AUTHENTICATE,
      token,
      userId
    });
  };
};

export const signup = (email, password) => {
  return async dispatch => {
    const response = await fetch(
      'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyAAx6UEYF9EvQval3DU-QCrDv4XqRwVqEU',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email,
          password,
          returnSecureToken: true
        })
      }
    );

    const resData = await response.json();

    if (!response.ok) {
      let msg = 'Something went wrong.';
      switch (resData.error.message) {
        case 'EMAIL_EXISTS':
          msg = 'The email address is already in use by another account.';
          break;
        case 'INVALID_EMAIL':
          msg = 'This email address is not valid.';
          break;
        case 'WEAK_PASSWORD : Password should be at least 6 characters':
          msg = 'Password should be at least 6 characters.';
          break;
        case 'OPERATION_NOT_ALLOWED':
          msg = 'Password sign-in is disabled for this project.';
          break;
        case 'TOO_MANY_ATTEMPTS_TRY_LATER':
          msg = 'We have blocked all requests from this device due to unusual activity. Try again later.';
          break;
        default:
          break;
      }
      throw new Error(msg);
    }

    const expiresIn = parseInt(resData.expiresIn) * 1000;

    dispatch(authenticate(
      resData.idToken,
      resData.localId,
      expiresIn
    ));

    const expDate = new Date(
      new Date().getTime() + expiresIn
    );
    saveDateToStorage(resData.idToken, resData.localId, expDate);
  };
};

export const login = (email, password) => {
  return async dispatch => {
    const response = await fetch(
      'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyAAx6UEYF9EvQval3DU-QCrDv4XqRwVqEU',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email,
          password,
          returnSecureToken: true
        })
      }
    );

    const resData = await response.json();

    if (!response.ok) {
      let msg = 'Something went wrong, maybe check the form errors.';
      switch (resData.error.message) {
        case 'EMAIL_NOT_FOUND':
          msg = 'There is no user record corresponding to this identifier.';
          break;
        case 'INVALID_PASSWORD':
          msg = 'This password is invalid.';
          break;
        case 'USER_DISABLED':
          msg = 'The user account has been disabled by an administrator.';
          break;
        default:
          break;
      }
      throw new Error(msg);
    }

    const expiresIn = parseInt(resData.expiresIn) * 1000;

    dispatch(authenticate(
      resData.idToken,
      resData.localId,
      expiresIn
    ));

    const expDate = new Date(
      new Date().getTime() + expiresIn
    );
    saveDateToStorage(resData.idToken, resData.localId, expDate);
  };
};

const saveDateToStorage = (token, userId, expDate) => {
  AsyncStorage.setItem('userData', JSON.stringify({
    token,
    userId,
    expDate: expDate.toISOString()
  }));
};

let timer;

export const logout = () => {
  AsyncStorage.removeItem('userData');

  if (timer) clearTimeout(timer);

  return { type: LOGUOT };
};

const setLogoutTimer = expTime => {
  return dispatch => {
    timer = setTimeout(() => {
      dispatch(logout());
    }, expTime);
  };
};