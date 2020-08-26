import React, { useCallback, useEffect } from 'react';
import { AuthContent, InputWithLabel, AuthButton, RightAlignedLink, AuthError  } from 'components/Auth';
import { useDispatch, useSelector } from 'react-redux';
import {changeInput,initializeForm, localLogin, setError} from 'redux/modules/auth';
import storage from 'lib/storage';
import { setLoggedInfo } from 'redux/modules/user';
import queryString from 'query-string';

const Login = ({ history, location }) => {
    const error = useSelector(state=>state.auth.login.error);
    const { email, password } = useSelector(state=>state.auth.login.form);
    const { data: localLoginResult } = useSelector(state=>state.auth.localLogin);
    const dispatch = useDispatch();
    // input change 이벤트핸들러
    const handleChange = useCallback((e)=>{
        const { name, value } = e.target;
        dispatch(changeInput({
            name, value, form: 'login'
        }));
    }, [dispatch]);
    // 에러메세지 저장 함수
    const handleSetError = useCallback((message)=>{
        dispatch(setError({
            form: 'login',
            message
        }));
    },[dispatch]);

    useEffect(()=>{
        // ?expired 있을시 에러메세지 redux에 저장
        const query = queryString.parse(location.search);
        if(query.expired !== undefined) {
            handleSetError('세션이 만료되었습니다. 다시 로그인하세요.')
        }
        
        return(()=>{
            // 컴퍼넌트 unMount시 폼 초기화
            dispatch(initializeForm('login'));
        });
    }, [dispatch, handleSetError, location.search]);

    // 로그인액션
    const handleLocalLogin = useCallback(()=>{
        dispatch(localLogin({email,password}));
    }, [dispatch, email, password]);
    // localLogin 통신 후 data 성공시 액션처리 또는 실패시 에러처리
    useEffect(()=>{
        if(!localLoginResult) return;
        dispatch(setLoggedInfo(localLoginResult));
        history.push('/');
        storage.set('loggedInfo', localLoginResult);
    }, [dispatch, history, localLoginResult]);

    return (
        <AuthContent title="로그인">
            <InputWithLabel label="이메일" name="email" placeholder="이메일" value={email} 
                    onChange={handleChange}/>
            <InputWithLabel label="비밀번호" name="password" placeholder="비밀번호" type="password" value={password} 
                    onChange={handleChange}/>
            {
                error && <AuthError>{error}</AuthError>
            }
            <AuthButton onClick={handleLocalLogin}>로그인</AuthButton>
            <RightAlignedLink to="/auth/register">회원가입</RightAlignedLink>
        </AuthContent>
    );
}

export default Login;