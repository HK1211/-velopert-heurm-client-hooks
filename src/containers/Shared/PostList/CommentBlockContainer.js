import React, { useCallback } from 'react'
import CommentBlock from 'components/Shared/PostList/CommentBlock';
import { useSelector, useDispatch } from 'react-redux';
import { changeCommentInput, comment } from 'redux/modules/posts';

const CommentBlockContainer = ({ post }) => {
    const status = useSelector(state=>state.posts.comments[post._id]);
    const { visible, value } = status ? status : { }; // status 가 존재하지 않는 경우를 위한 예외 케이스
    const dispatch = useDispatch();

    const handleChange = useCallback((e)=>{
        const { value } = e.target;
        dispatch(changeCommentInput({
            postId: post._id,
            value
        }))
    }, [dispatch, post._id]);

    const handleComment = useCallback(()=>{
        if( value === '') return;
        dispatch(comment({
            postId: post._id,
            text: value
        }));
    }, [dispatch, post._id, value]);

    const handleKeyPress = useCallback((e)=>{
        if(e.key === 'Enter') {
            handleComment();
        }
    }, [handleComment]);

    if(!visible) return null; // visible 이 false 면 아무것도 렌더링하지 않기
    
    return (
        <CommentBlock 
            value={value}
            onChange={handleChange}
            onKeyPress={handleKeyPress}
            comments={post.comments}
        />
    )
}

export default CommentBlockContainer;
