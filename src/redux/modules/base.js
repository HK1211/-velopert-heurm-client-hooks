import { handleActions, createAction } from 'redux-actions';

const SET_HEADER_VISIBILITY = 'base/SET_HEADER_VISIBILITY'; // 헤더 렌더링 여부 설정
const SET_USER_MENU_VISIBILITY = 'base/SET_USER_MENU_VISIBILITY'; // 유저메뉴 렌더링 여부 설정

export const setHeaderVisibility = createAction(SET_HEADER_VISIBILITY); // visible
export const setUserMenuVisibility = createAction(SET_USER_MENU_VISIBILITY); // visible

const initialState = {
    header: {
        visible: true
    },
    userMenu: {
        visible: false
    }
}

export default handleActions({
    [SET_HEADER_VISIBILITY]: (state, action) => {
        return {
            ...state,
            header: {
                ...state.header,
                visible: action.payload
            }
        }
    },
    [SET_USER_MENU_VISIBILITY]: (state, action) => {
        return {
            ...state,
            userMenu: {
                ...state.userMenu,
                visible: action.payload
            }
        }
    }
    
}, initialState);