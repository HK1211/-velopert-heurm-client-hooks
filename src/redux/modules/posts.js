import { createAction, handleActions } from 'redux-actions';

import * as PostsAPI from 'lib/api/posts';
import { pender } from 'redux-pender';

const LOAD_POST = 'posts/LOAD_POST'; // 포스트 리스트 초기 로딩
const PREFETCH_POST = 'posts/PREFETCH_POST'; // 포스트 미리 로딩
const SHOW_PREFETCHED_POST = 'posts/SHOW_PREFETCHED_POST'; // 미리 로딩된 포스트 화면에 보여주기

export const loadPost = createAction(LOAD_POST, PostsAPI.list);
export const prefetchPost = createAction(PREFETCH_POST, PostsAPI.next); // URL
export const showPrefetchedPost = createAction(SHOW_PREFETCHED_POST);

const initialState = {
    next: '',
    ajax: {
        postList: {
            loading: false,
            data: null,
            error: null
        },
        nextData: {
            loading: false,
            data: null,
            error: null
        }
    },
    resultPostList: []
}

export default handleActions({
    [SHOW_PREFETCHED_POST]: (state) => {
        // data 의 뒷부분에 nextData 를 붙여주고,
        // 기존의 nextData 는 비워줍니다.

        const nextData = state.ajax.nextData.data;
        const concatData = state.resultPostList.concat(nextData);
        return {
            ...state,
            resultPostList: concatData,
            ajax: {
                ...state.ajax,
                nextData: {
                    loading: false,
                    data: null,
                    error: null
                }
            }
        }
    },
    ...pender({
        type: LOAD_POST,
        onPending: (state) => ({
            ...state,
            ajax: {
                ...state.ajax,
                postList: {
                    loading: true,
                    data: state.ajax.data ? state.ajax.data : null,
                    error: null
                }
            }
        }),
        onSuccess: (state, action) => {
            const { next, data } = action.payload.data;
            return {
                ...state,
                next: next,
                ajax: {
                    ...state.ajax,
                    postList: {
                        loading: false,
                        data: data,
                        error: null
                    }
                },
                resultPostList: data
            }
        },
        onFailure: (state) => ({
            ...state,
            ajax: {
                ...state.ajax,
                postList: {
                    loading: false,
                    data: null,
                    error: true
                }
            }
        })
    }),
    ...pender({
        type: PREFETCH_POST,
        onPending: (state) => ({
            ...state,
            ajax: {
                ...state.ajax,
                nextData: {
                    loading: true,
                    data: null,
                    error: null
                }
            }
        }),
        onSuccess: (state, action) => {
            const { next, data } = action.payload.data;
            return {
                ...state,
                next: next,
                ajax: {
                    ...state.ajax,
                    nextData: {
                        loading: false,
                        data: data,
                        error: null
                    }
                },
            }
        },
        onFailure: (state) => ({
            ...state,
            ajax: {
                ...state.ajax,
                nextData: {
                    loading: false,
                    data: null,
                    error: true
                }
            }
        })
    }),
    
}, initialState);