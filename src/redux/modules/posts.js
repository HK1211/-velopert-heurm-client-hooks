import { createAction, handleActions } from 'redux-actions';

import * as PostsAPI from 'lib/api/posts';
import { pender } from 'redux-pender';

const LOAD_POST = 'posts/LOAD_POST'; // 포스트 리스트 초기 로딩
const PREFETCH_POST = 'posts/PREFETCH_POST'; // 포스트 미리 로딩
const SHOW_PREFETCHED_POST = 'posts/SHOW_PREFETCHED_POST'; // 미리 로딩된 포스트 화면에 보여주기
const RECEIVE_NEW_POST = 'posts/RECEIVE_NEW_POST'; // 새 데이터 수신
const LIKE_POST = 'posts/LIKE_POST'; // 포스트 좋아요
const UNLIKE_POST = 'posts/UNLIKE_POST'; // 포스트 좋아요 취소
const TOGGLE_COMMENT = 'posts/TOGGLE_COMMENT'; // 덧글 창 열고 닫기
const CHANGE_COMMENT_INPUT = 'posts/CHANGE_COMMENT_INPUT'; // 덧글 인풋 수정
const COMMENT = 'posts/COMMENT'; // 덧글 작성

export const loadPost = createAction(LOAD_POST, PostsAPI.list);
export const prefetchPost = createAction(PREFETCH_POST, PostsAPI.next); // URL
export const showPrefetchedPost = createAction(SHOW_PREFETCHED_POST);
export const likePost = createAction(LIKE_POST, PostsAPI.like, (payload) => payload)
export const unlikePost  = createAction(UNLIKE_POST, PostsAPI.unlike, (payload) => payload)
export const toggleComment = createAction(TOGGLE_COMMENT); // postId
export const changeCommentInput = createAction(CHANGE_COMMENT_INPUT); // { postId, value }
export const comment = createAction(COMMENT, PostsAPI.comment, ({postId})=>postId); // { postId, text }

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
    resultPostList: [],
    comments: {
        _postId: {
            visible: false,
            value: ''
        }
    }
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
    [RECEIVE_NEW_POST]: (state, action) => {
        // 전달받은 포스트를 데이터의 앞부분에 넣어줍니다.
        const unshiftData = [
            action.payload,
            ...state.resultPostList,
        ];
        return {
            ...state,
            resultPostList: unshiftData
        }
    },
    [TOGGLE_COMMENT] : (state, action) => {
        // comments에 해당 아이디가 존재하는지 확인
        const comment = state.comments.hasOwnProperty(action.payload);
        console.log(comment);
        if(comment) {
            // 존재한다면 visible 값을 현재의 반대값으로 수정
            return {
                ...state,
                comments: {
                    ...state.comments,
                    [action.payload]: {
                        ...state.comments[action.payload],
                        visible: !state.comments[action.payload].visible
                    }
                }
            }
        }
        return {
            ...state,
            comments: {
                ...state.comments,
                [action.payload]: {
                    visible: true,
                    value: ''
                }
            }
        }
    },
    [CHANGE_COMMENT_INPUT]: (state, action) => {
        // 주어진 postId 의 덧글 인풋 값을 수정
        const { postId, value }   = action.payload;
        return {
            ...state,
            comments: {
                ...state.comments,
                [postId]: {
                    ...state.comments[postId],
                    value: value
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
    ...pender({
        type: LIKE_POST,
        onPending: (state, action) => {
            const result = state.resultPostList.map(
                post => post._id === action.meta
                        ? {
                            ...post,
                            liked: true,
                            likesCount: post.likesCount + 1
                        }
                        : post
            )
            return {
                ...state,
                resultPostList: result
            }
        },
        onSuccess: (state, action) => {
            const result = state.resultPostList.map(
                post => post._id === action.meta
                        ? {
                            ...post,
                            likesCount: action.payload.data.likesCount
                        }
                        : post
            )
            return {
                ...state,
                resultPostList: result
            }
        },
    }),
    ...pender({
        type: UNLIKE_POST,
        onPending: (state, action) => {
            const result = state.resultPostList.map(
                post => post._id === action.meta
                        ? {
                            ...post,
                            liked: false,
                            likesCount: post.likesCount - 1
                        }
                        : post
            )
            return {
                ...state,
                resultPostList: result
            }
        },
        onSuccess: (state, action) => {
            const result = state.resultPostList.map(
                post => post._id === action.meta
                        ? {
                            ...post,
                            likesCount: action.payload.data.likesCount
                        }
                        : post
            )
            return {
                ...state,
                resultPostList: result
            }
        },
    }),
    ...pender({
        type: COMMENT,
        onPending: (state, action) => {
            // 인풋값을 비워줍니다
            console.log(action.meta);
            return {
                ...state,
                comments: {
                    ...state.comments,
                    [action.meta]: {
                        ...state.comments[action.meta],
                        value: ''
                    }
                }
            }
        },
        onSuccess: (state, action) => {
            // meta 에 있는 postId 를 가진 포스트를 찾아서 덧글 목록을 업데이트 합니다.
            const result = state.resultPostList.map(
                post=> post._id !== action.meta
                       ? post
                       : {
                            ...post,
                            comments: action.payload.data
                        }
            );
           
            return {
                ...state,
                resultPostList: result
            }
        }
    })
}, initialState);