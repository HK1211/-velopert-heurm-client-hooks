import { createAction, handleActions } from 'redux-actions';
import { pender } from 'redux-pender';
import * as AuthAPI from 'lib/api/auth';

const CHANGE_INPUT = 'auth/CHANGE_INPUT'; // input 값 변경
const INITIALIZE_FORM = 'auth/INITIALIZE_FORM'; // form 초기화
const SET_ERROR = 'auth/SET_ERROR'; // 오류 설정

const CHECK_EMAIL_EXISTS = 'auth/CHECK_EMAIL_EXISTS'; // 이메일 중복 확인
const CHECK_USERNAME_EXISTS = 'auth/CHECK_USERNAME_EXISTS'; // 아이디 중복 확인
const LOCAL_REGISTER = 'auth/LOCAL_REGISTER'; // 이메일 가입
const LOCAL_LOGIN = 'auth/LOCAL_LOGIN'; // 이메일 로그인
const LOGOUT = 'auth/LOGOUT'; // 로그아웃

export const changeInput = createAction(CHANGE_INPUT); //  { form, name, value }
export const initializeForm = createAction(INITIALIZE_FORM); // form 
export const setError = createAction(SET_ERROR); // { form, message }

export const checkEmailExists = createAction(CHECK_EMAIL_EXISTS, AuthAPI.checkEmailExists); // email
export const checkUsernameExists = createAction(CHECK_USERNAME_EXISTS, AuthAPI.checkUsernameExists); // username

export const localRegister = createAction(LOCAL_REGISTER, AuthAPI.localRegister); // { email, username, password }
export const localLogin = createAction(LOCAL_LOGIN, AuthAPI.localLogin); // { email, password }
export const logout = createAction(LOGOUT, AuthAPI.logout);

const initialState = {
    register: {
        form: {
            email: '',
            username: '',
            password: '',
            passwordConfirm: ''
        },
        existsEmail: {
            loading: false,
            data: null,
            error: null
        },
        existsUsername: {
            loading: false,
            data: null,
            error: null
        },
        error: null
    },
    login: {
        form: {
            email: '',
            password: ''
        },
        error: null
    },
    result: {
        loading: false,
        data: null,
        error: null
    },
    localLogin: {
        loading: false,
        data: null,
        error: null
    }
}

export default handleActions({
    [CHANGE_INPUT]: (state, action) => {
        const { form, name, value } = action.payload;
        return {
            ...state,
            [form]: {
                ...state[form],
                form: {
                    ...state[form].form,
                    [name]: value
                }
            }
        }
    },
    [INITIALIZE_FORM]: (state, action) => {
        const initialForm = initialState[action.payload];
        return {
            ...state,
            [action.payload]: initialForm
        }
    },
    [SET_ERROR]: (state, action) => {
        const { form, message } = action.payload;
        return {
            ...state,
            [form]: {
                ...state[form],
                error: message
            }
        }
    },
    ...pender({
        type: CHECK_EMAIL_EXISTS,
        onPending: (state) => {
            return {
                ...state,
                register: {
                    ...state.register,
                    existsEmail: {
                        loading: true,
                        data: null,
                        error: null
                    }
                }
            }
        },
        onSuccess: (state, action) => {
            console.log(action.payload.exists);
            return {
                ...state,
                register: {
                    ...state.register,
                    existsEmail: {
                        loading: false,
                        data: action.payload.data.exists,
                        error: null
                    }
                }
            }
        },
        onFailure: (state, action) => {
            return {
                ...state,
                register: {
                    ...state.register,
                    existsEmail: {
                        loading: false,
                        data: null,
                        error: action.payload.data.error
                    }
                }
            }
        },
    }),
    ...pender({
        type: CHECK_USERNAME_EXISTS,
        onPending: (state) => {
            return {
                ...state,
                register: {
                    ...state.register,
                    existsUsername: {
                        loading: true,
                        data: null,
                        error: null
                    }
                }
            }
        },
        onSuccess: (state, action) => {
            return {
                ...state,
                register: {
                    ...state.register,
                    existsUsername: {
                        loading: false,
                        data: action.payload.data.exists,
                        error: null
                    }
                }
            }
        },
        onFailure: (state, action) => {
            return {
                ...state,
                register: {
                    ...state.register,
                    existsUsername: {
                        loading: false,
                        data: null,
                        error: action.payload.data.error
                    }
                }
            }
        },
    }),
    ...pender({
        type: LOCAL_LOGIN,
        onPending: (state) => {
            return {
                ...state,
                localLogin: {
                    loading: true,
                    data: null,
                    error: null
                }
            }
        },
        onSuccess: (state, action) => {
            return {
                ...state,
                localLogin: {
                    loading: false,
                    data: action.payload.data,
                    error: null
                }
            }
        },
        onFailure: (state, action) => {
            return {
                ...state,
                localLogin: {
                    loading: false,
                    data: null,
                    error: 'error'
                },
                login: {
                    ...state.login,
                    error: '잘못된 계정 정보 입니다'
                }
            }
        }
    }),
    ...pender({
        type: LOCAL_REGISTER,
        onPending: (state) => {
            return {
                ...state,
                result: {
                    loading: true,
                    data: null,
                    error: null
                }
            }
        },
        onSuccess: (state, action) => {
            return {
                ...state,
                result: {
                    loading: false,
                    data: action.payload.data,
                    error: null
                }
            }
        },
        onFailure: (state, action) => {
            console.log(action.payload);
            return {
                ...state,
                result: {
                    loading: false,
                    data: null,
                    error: action.payload.data
                }
            }
        }
    }),
    
    
}, initialState);