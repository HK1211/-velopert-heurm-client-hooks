import React, { useCallback, useEffect } from 'react';
import { AuthContent, InputWithLabel, AuthButton, RightAlignedLink, AuthError   } from 'components/Auth';
import { useDispatch, useSelector } from 'react-redux';
import { changeInput,initializeForm,setError, checkEmailExists, checkUsernameExists, localRegister } from 'redux/modules/auth';
import { setLoggedInfo, setValidated } from 'redux/modules/user';
import {isEmail, isLength, isAlphanumeric} from 'validator';
import debounce from 'lodash/debounce';
import storage from 'lib/storage';

const Register = ({history}) => {
    const error = useSelector(state=>state.auth.register.error);
    const { email, username, password, passwordConfirm  } = useSelector(state=>state.auth.register.form);
    const {data: checkEmail} = useSelector(state=>state.auth.register.existsEmail);
    const {data: checkUsername} = useSelector(state=>state.auth.register.existsUsername);
    const {data: result, error: resultError} = useSelector(state=>state.auth.result);

    const dispatch = useDispatch();

    // 에러메세지 저장 함수
    const handleSetError = useCallback((message)=>{
        dispatch(setError({
            form: 'register',
            message
        }));
    },[dispatch]);
    // 이메일 중복체크 .3초뒤 실행
    const debounceEmailExists = debounce(async (email)=>{
        dispatch(checkEmailExists(email));
    }, 300);
    // 이메일 중복체크 액션
    const handleCheckEmailExists = useCallback(
        (email) => {
            debounceEmailExists(email)
        },
        [debounceEmailExists],
    );
    // 유저네임 중복체크 .3초뒤 실행
    const debounceUsernameExists = debounce(async (username)=>{
        dispatch(checkUsernameExists(username));
    }, 300);
    // 유저네임 중복체크 액션
    const handleCheckUsernameExists = useCallback(
        (username) => {
            debounceUsernameExists(username)
        },
        [debounceUsernameExists],
    )
    // 이메일 중복 확인 결과
    useEffect(()=>{
        if(checkEmail) {
            handleSetError('이미 존재하는 이메일입니다.');
        } else {
            handleSetError(null);
        }
    }, [checkEmail, dispatch, handleSetError]);
    // 유저네임 중복 확인 결과
    useEffect(()=>{
        if(checkUsername) {
            handleSetError('이미 존재하는 아이디입니다.');
        } else {
            handleSetError(null);
        }
    }, [checkUsername, dispatch, handleSetError]);
    // input value 검증
    const validate = {
        email: (value) => {
            if(!isEmail(value)) {
                console.log('시작');
                handleSetError('잘못된 이메일 형식 입니다.');
                return false;
            }
            
            return true;
        },
        username: (value) => {
            if(!isAlphanumeric(value) || !isLength(value, { min:4, max: 15 })) {
                handleSetError('아이디는 4~15 글자의 알파벳 혹은 숫자로 이뤄져야 합니다.');
                return false;
            }
            
            return true;
        },
        password: (value) => {
            if(!isLength(value, { min: 6 })) {
                handleSetError('비밀번호를 6자 이상 입력하세요.');
                return false;
            }
            handleSetError(null); // 이메일과 아이디는 에러 null 처리를 중복확인 부분에서 하게 됩니다
            return true;
        },
        passwordConfirm: (value) => {
            if(password !== value) {
                handleSetError('비밀번호확인이 일치하지 않습니다.');
                return false;
            }
            handleSetError(null); 
            return true;
        }
    }
    // input Change Event
    const handleChange = useCallback((e)=>{
        const { name, value } = e.target;
        dispatch(changeInput({
            name, value, form: 'register'
        }));

        
        
        // 검증작업 진행
        const validation = validate[name](value);
        if(name.indexOf('password') > -1 || !validation) return; // 비밀번호 검증이거나, 검증 실패하면 여기서 마침

        // TODO: 이메일, 아이디 중복 확인
        const check = name === 'email' ? handleCheckEmailExists : handleCheckUsernameExists; // name 에 따라 이메일체크할지 아이디 체크 할지 결정
        check(value);
    }, [dispatch, handleCheckEmailExists, handleCheckUsernameExists, validate]);
    // register Form 초기화
    useEffect(()=>{
        return(()=>{
            dispatch(initializeForm('register'));
        });
    }, [dispatch]);

    // 회원가입 통신 이벤트 액션핸들러
    const handleLocalRegister = async () => {
        if(error) return; // 현재 에러가 있는 상태라면 진행하지 않음
        if(!validate['email'](email) 
            || !validate['username'](username) 
            || !validate['password'](password) 
            || !validate['passwordConfirm'](passwordConfirm)) { 
            // 하나라도 실패하면 진행하지 않음
            return;
        }

        dispatch(localRegister({
            email, username, password
        }));
    };
    const handleSetLoggedInfo = useCallback((loggedInfo)=>{
        dispatch(setLoggedInfo(loggedInfo));
    }, [dispatch]);
    const handleSetValidated = useCallback(()=>{
        dispatch(setValidated(true))
    }, [dispatch]);
    
    useEffect(()=>{
        console.log(result);
        if(result) {
            console.log(result);
            const loggedInfo = result;
            storage.set('loggedInfo', loggedInfo);
            handleSetLoggedInfo(loggedInfo);
            handleSetValidated();
            history.push('/'); // 회원가입 성공시 홈페이지로 이동
        }
    }, [handleSetLoggedInfo, handleSetValidated, history, result]);

    useEffect(()=>{
        if(resultError) {
            const { key } = resultError;
            const message = key === 'email' ? '이미 존재하는 이메일입니다.' : '이미 존재하는 아이디입니다.';
            if(key) {
                return handleSetError(message);
            } else {
                return handleSetError('알 수 없는 에러가 발생했습니다.');
            }
        }
    })

    return (
        <AuthContent title="회원가입">
                <InputWithLabel 
                    label="이메일"
                    name="email"
                    placeholder="이메일" 
                    value={email} 
                    onChange={handleChange}
                />
                <InputWithLabel 
                    label="아이디" 
                    name="username" 
                    placeholder="아이디" 
                    value={username} 
                    onChange={handleChange}
                />
                <InputWithLabel 
                    label="비밀번호" 
                    name="password" 
                    placeholder="비밀번호"
                    type="password" 
                    value={password} 
                    onChange={handleChange}
                />
                <InputWithLabel 
                    label="비밀번호 확인" 
                    name="passwordConfirm" 
                    placeholder="비밀번호 확인" 
                    type="password" 
                    value={passwordConfirm}
                    onChange={handleChange}
                />
                {
                    error && <AuthError>{error}</AuthError>
                }
                <AuthButton onClick={handleLocalRegister}>회원가입</AuthButton>
                <RightAlignedLink to="/auth/login">로그인</RightAlignedLink>
            </AuthContent>
    );
}

export default Register;