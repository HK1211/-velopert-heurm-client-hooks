import React, { useCallback, useEffect, useRef } from 'react';
import UserHead from 'components/User/UserHead';
import { getUserInfo } from 'redux/modules/userPage';
import { useDispatch, useSelector } from 'react-redux';

function UserHeadContainer({ username }) {
    const thumbnail = useSelector(state=>state.userPage.info.profile.thumbnail);
    const thoughtCount = useSelector(state=>state.userPage.info.thoughtCount);
    const fetched = useSelector(state=>state.pender.success['userPage/GET_USER_INFO']);

    const didMount = useRef('');
    const dispatch = useDispatch();

    const handleGetUserInfo = useCallback(async () => {
        if(didMount.current !== username) {
            dispatch(getUserInfo(username));
            didMount.current = username;    
        }
    }, [dispatch, username]);

    useEffect(()=>{
        handleGetUserInfo();
    }, [handleGetUserInfo]);

    return (
        <UserHead username={username} thumbnail={thumbnail} thoughtCount={thoughtCount}/>
    );
}

export default UserHeadContainer;