import React from 'react'
import styled from 'styled-components';
import oc from 'open-color';

import { GoHeart as HeartIcon } from 'react-icons/go';
import { RiChat3Fill as CommentIcon } from "react-icons/ri";

const Wrapper = styled.div`
    padding: 1rem;
    border-top: 1px solid ${oc.gray[1]};
    display: flex;
    color: ${oc.gray[5]};
    svg {
        font-size: 1.75rem;
        cursor: pointer;
    }
    span {
        margin-left: 0.25rem;
        font-size: 0.8rem;
        padding: 0 0 0.25 0;
    }
`;
const Likes = styled.div`
    display: flex;
    align-items: center;
    svg {
        &: hover {
            color: ${oc.gray[6]};
        }
        &: active {
            color: ${oc.pink[6]};
        }
    }
    ${({active})=>active&&`
        svg {
            color: ${oc.pink[6]};
            &:hover {
                color: ${oc.pink[5]};
            }
        }
    `};
`;
const Comments = styled.div`
        margin-left: auto;
        display: flex;
        align-items: center;
        svg {
            transform: rotate(-90deg);
            &:hover {
                color: ${oc.gray[6]};
            }
            &:active {
                color: ${oc.cyan[6]};
            }
        }
`;

const PostFooter = ({liked, likesCount=0, comments=[], onToggleLike, onCommentClick}) => (
    <Wrapper>
        <Likes active={liked}>
            <HeartIcon onClick={onToggleLike}/>
            <span>좋아요 {likesCount}개</span>
        </Likes>
        <Comments>
            <CommentIcon onClick={onCommentClick} />
            <span>덧글 {comments.length}개</span>
        </Comments>
    </Wrapper>
);

export default PostFooter;
