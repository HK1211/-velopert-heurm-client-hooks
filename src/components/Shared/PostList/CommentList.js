import React, { useState, useCallback } from 'react';
import styled from 'styled-components';
import oc from 'open-color';
import Comment from './Comment';
import withRelayout from 'lib/withRelayout';
import { useReLayout } from 'containers/Shared/PostList/PostListContainer';

const CommentListwrapper = styled.div`
    margin-top: 0.75rem;
`;
const ReadMore = styled.div`
    color: ${oc.gray[6]};
    font-size: 0.9rem;
    text-align: center;
    cursor: pointer;

    &:hover {
        color: ${oc.cyan[6]};
        font-weight: 500;
    }
`
const CommentList = ({ comments, onRelayout }) => {
    const [limit, setLimit] = useState(5);
    const reLayout =  useReLayout();

    const handleReadMore = useCallback(()=>{
        setLimit((limit)=>limit + 10);
        reLayout(); // useContext 방식으로 reLayout 방법
        //onRelayout(); // Hoc 방식으로 reLayout 방법
    }, [reLayout]);

    if (comments.length === 0) return null; // 덧글이 비어있다면 아무것도 렌더링하지 않습니다.

    const commentList = comments.slice(0,limit).map(
        (comment) => (
            <Comment {...comment} key={comment._id}/>
        )
    );

    return (
        <CommentListwrapper>
            {commentList}
            { limit < comments.length && <ReadMore onClick={handleReadMore}>{comments.length - limit}개 더 보기</ReadMore> }
        </CommentListwrapper>
    );
}

export default withRelayout(CommentList);
