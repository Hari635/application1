import { AsyncStorage } from 'react-native';
export const AUTHENTICATE = 'AUTHENTICATE';
export const LOGOUT = 'LOGOUT';

let timer;


export const authenticate = (userId, token, expiryTime) => {
    return dispatch => {
        dispatch(setLogoutTimer(expiryTime));
        dispatch({ type: AUTHENTICATE, userId: userId, token: token });
      };
};

export const SIGNUP = 'SIGNUP'
export const LOGIN = 'LOGIN'

export const signup = (email, password) => {
    return async (dispatch) => {
        const response = await fetch('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyAKfKYJAvgO5-rPTrvbIAHshSiDs4nPfhA'
            , {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: email,
                    password: password,
                    returnSecureToken: true
                })
            })
        if (!response.ok) {
            const errorData = await response.json()
            const errorId = errorData.error.message
            let message = 'something went wrong'
            if (errorId === 'EMAIL_EXISTS') {
                message = 'This email exists try another email !'
            }
            throw new Error(message)
        }
        const resData = await response.json()
        console.log(resData);
        dispatch(
            authenticate(resData.localId, resData.idToken,parseInt(resData.expiresIn)* 1000 )
        )
        const expirationDate = new Date(
            new Date().getTime() + parseInt(resData.expiresIn) * 1000
        );

        saveDataToStorage(resData.idToken, resData.localId, expirationDate);
    }
}

export const login = (email, password) => {
    return async (dispatch) => {
        const response = await fetch('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyAKfKYJAvgO5-rPTrvbIAHshSiDs4nPfhA'
            , {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: email,
                    password: password,
                    returnSecureToken: true
                })
            })
        if (!response.ok) {
            const errorData = await response.json()
            const errorId = errorData.error.message
            let message = 'something went wrong'
            if (errorId === 'EMAIL_NOT_FOUND') {
                message = 'This email could not be found!'
            } else if (errorId === 'INVALID_PASSWORD') {
                message = 'this password is not valid'
            }
            throw new Error(message)
        }
        const resData = await response.json()
        console.log(resData);
        dispatch(authenticate(resData.localId, resData.idToken,parseInt(resData.expiresIn)*1000));
        const expirationDate = new Date(
            new Date().getTime() + parseInt(resData.expiresIn) * 1000
        );
        saveDataToStorage(resData.idToken, resData.localId, expirationDate);
    }
}

export const logout = () => {
    clearLogoutTimer();
    AsyncStorage.removeItem('userData');
    return { type: LOGOUT };
  };
  
  const clearLogoutTimer = () => {
    if (timer) {
      clearTimeout(timer);
    }
  };
  
  const setLogoutTimer = expirationTime => {
    return dispatch => {
      timer = setTimeout(() => {
        dispatch(logout());
      }, expirationTime);
    };
  };

const saveDataToStorage = (token, userId, expirationDate) => {
    AsyncStorage.setItem(
      'userData',
      JSON.stringify({
        token: token,
        userId: userId,
        expiryDate: expirationDate.toISOString()
      })
    );
  };
  