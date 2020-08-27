import React, { useCallback } from 'react';
import styled from 'styled-components';
import oc from 'open-color';
import Textarea from 'react-textarea-autosize';
import Progress from './Progress';
import { shadow, media } from 'lib/styleUtils';
import { toast } from 'react-toastify';

const Wrapper = styled.div`
    width: 768px;
    margin: 0 auto;
    padding: 1rem;
    background: ${oc.gray[7]};
    position: relative;
    ${shadow(1)};
    ${media.desktop`
        width: 736px;
    `};
    ${media.tablet`
        width: 100%;
    `};
`;

const StyledTextarea = styled(Textarea)`
    width: 100%;
    background: transparent;
    border: none;
    resize: none;
    outline: none;
    font-size: 1.5rem;
    font-weight: 300;
    color: white;
    ::placeholder {
        color: ${oc.gray[3]};
    };
    ${media.tablet`
        font-size: 1rem;
    `};
`;

const WritePost = ({onChange, onPost, value}) => {
    const message = (message) => (<div style={{fontSize: '1.1rem'}}>{message}</div>);
    const handleOnPaste = useCallback((e)=>{
        e.preventDefault();
        toast(message('생각의 흐름대로 직접 작성해 주세요.'));
    }, []);

    return (
        <Wrapper>
            <StyledTextarea
                minRows={3}
                maxRows={10}
                value={value}
                onChange={onChange}
                placeholder={`의식의 흐름대로 당신의 생각을 적어보세요.\n5초이상 아무것도 입력하지 않으면 자동으로 포스팅됩니다.`}
                onPaste={handleOnPaste}
            />
            <Progress onPost={onPost}/>
        </Wrapper>
    )
};

export default WritePost;