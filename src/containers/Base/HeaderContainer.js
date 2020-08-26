import React, { useCallback } from 'react';
import Header, { LoginButton } from 'components/Base/Header';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from 'redux/modules/user';
import storage from 'lib/storage';

const HeaderContainer = () => {
    const { visible } = useSelector(state=>state.base.header);
    const { logged, loggedInfo } = useSelector(state=>state.user);
    const dispatch = useDispatch();
    const handleLogout = useCallback(async()=>{
        dispatch(logout());
        storage.remove('loggedInfo');
        window.location.href = '/'; // 홈페이지로 새로고침
    }, [dispatch])
    if(!visible) return null;
    console.log(loggedInfo);


    return (
        <Header>
            { logged
                ? (<div>
                    {loggedInfo.username} <div onClick={handleLogout}>(로그아웃)</div>
                </div> )
                : <LoginButton/> 
            }
        </Header>
    );
}

export default HeaderContainer;