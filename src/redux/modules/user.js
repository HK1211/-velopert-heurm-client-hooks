import { createAction, handleActions } from 'redux-actions';
import * as AuthAPI from 'lib/api/auth';
import { pender } from 'redux-pender';
import storage from 'lib/storage';

const SET_LOGGED_INFO = 'user/SET_LOGGED_INFO'; // 로그인 정보 설정
const SET_VALIDATED = 'user/SET_VALIDATED'; // validated 값 설정
const LOGOUT = 'user/LOGOUT'; // 로그아웃
const CHECK_STATUS = 'user/CHECK_STATUS'; // 현재 로그인상태 확인

export const setLoggedInfo = createAction(SET_LOGGED_INFO); // loggedInfo
export const setValidated = createAction(SET_VALIDATED); // validated
export const logout = createAction(LOGOUT, AuthAPI.logout);
export const checkStatus = createAction(CHECK_STATUS, AuthAPI.checkStatus);

const initialState = {
    loggedInfo: { // 현재 로그인중인 유저의 정보
        thumbnail: '',
        username: ''
    },
    logged: false, // 현재 로그인중인지 알려준다
    validated: false, // 이 값은 현재 로그인중인지 아닌지 한번 서버측에 검증했음을 의미
    checkStatus: {
        loading: false,
        data: null,
        error: null
    }
}

export default handleActions({
    [SET_LOGGED_INFO]: (state, action) => {
        return {
            ...state,
            loggedInfo: action.payload,
            logged: true
        }
    },
    [SET_VALIDATED]: (state, action) => {
        return {
            ...state,
            validated: action.payload
        }
    },
    ...pender({
        type: CHECK_STATUS,
        onPending: (state) => {
            return {
                ...state,
                checkStatus: {
                    loading: true,
                    data: null,
                    error: null
                }
            }
        },
        onSuccess: (state, action) => {
            return {
                ...state,
                checkStatus: {
                    loading: false,
                    data: action.payload,
                    error: null
                },
                validated: true
            }
        },
        onFailure: (action) => {
            storage.remove('loggedInfo');
            window.location.href = '/auth/login?expired';
            return initialState;
        }
    }),
    ...pender({
        type: LOGOUT,
        onSuccess: (state, action) => {
            storage.remove('loggedInfo');
            window.location.href = '/'; // 홈페이지로 새로고침
        }
    })
}, initialState);