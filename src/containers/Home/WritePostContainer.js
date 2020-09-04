import React, { useCallback, useEffect, useRef } from 'react';
import WritePost from 'components/Home/WritePost';
import { useSelector, useDispatch } from 'react-redux';
import { changeWritePostInput, writePost } from 'redux/modules/home';
import { toast } from 'react-toastify';


function WritePostContainer() {
    const { value } = useSelector(state=>state.home.writePost);
    const { data, error } = useSelector(state=>state.home.ajax.writePost);
    const dispatch = useDispatch();
    const inputRef = useRef(null);
    const handleChange = useCallback((e)=>{
        dispatch(changeWritePostInput(e.target.value));
    }, [dispatch]);
    // 알림에서 보여줄 DOM
    const message = (message) => (<div style={{fontSize: '1.1rem'}}>{message}</div>);
    const handlePost = useCallback(()=>{
        inputRef.current.blur();
        setTimeout(
            () => {
                inputRef.current.focus();
            }, 100
        );
        // 사전 오류 핸들링
        if(value.length < 5) {
            dispatch(changeWritePostInput(''));
            return toast(message('너무 짧습니다. 5자 이상 입력하세요.'), { type: 'error' });
        };
        
        if(value.length > 1000) {
            dispatch(changeWritePostInput(''));
            return toast(message('최대 1000자까지 입력 할 수 있습니다.'), { type: 'error' });
        }
        // 게이지가 다 차면 실행되는 메소드
        dispatch(writePost(value));
    }, [dispatch, value]);

    useEffect(()=>{
        if(data) {
            toast(message('생각이 작성되었습니다.'), { type: 'success' });
        };

        if(error) {
            toast(message('오류가 발생했습니다.'), { type: 'error' });
        };
    }, [data, error]);
    
    return (
        <WritePost 
            value={value}
            onChange={handleChange}
            onPost={handlePost}
            inputRef={inputRef}
        />
    );
}

export default WritePostContainer;