import { createAction, handleActions } from 'redux-actions';
import { pender } from 'redux-pender';
import * as PostsAPI from 'lib/api/posts';

// action types
const CHANGE_WRITE_POST_INPUT = 'home/CHANGE_WRITE_POST_INPUT'; // 인풋 내용 수정
const WRITE_POST = 'home/WRITE_POST'; // 포스트 작성

// action creator
export const changeWritePostInput = createAction(CHANGE_WRITE_POST_INPUT); // value
export const writePost = createAction(WRITE_POST, PostsAPI.write); // content

// initial state
const initialState = {
    writePost: {
        value: ''
    },
    ajax: {
        writePost: {
            loading: false,
            data: null,
            error: null
        }
    }
};

// reducer
export default handleActions({
    [CHANGE_WRITE_POST_INPUT]: (state, action) => ({
        ...state,
        writePost: {
            ...state.writePost,
            value: action.payload
        },
    }),
    ...pender({
        type: WRITE_POST,
        onPending: (state) => ({
            ...state,
            writePost: {
                ...state.writePost,
                value: ''
            },
            ajax: {
                ...state.ajax,
                writePost: {
                    loading: true,
                    data: null,
                    error: null
                }
            }
        }),
        onSuccess: (state) => ({
            ...state,
            ajax: {
                ...state.ajax,
                writePost: {
                    loading: false,
                    data: true,
                    error: null
                }
            }
        }),
        onFailure: (state) => ({
            ...state,
            ajax: {
                ...state.ajax,
                writePost: {
                    loading: false,
                    data: null,
                    error: true
                }
            }
        }),
    }),
}, initialState);