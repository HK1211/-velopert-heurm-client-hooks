import React, { useCallback } from 'react';
import UserMenu, { UserMenuItem, Username } from 'components/Base/UserMenu';
// import storage from 'lib/storage';

import { useDispatch, useSelector } from 'react-redux';
import { logout } from 'redux/modules/user';

const UserMenuContainer = () => {
    const { visible } = useSelector(state=>state.base.userMenu);
    const { username } = useSelector(state=>state.user.loggedInfo);
    const dispatch = useDispatch();
    
    const handleLogout = useCallback(()=>{
        dispatch(logout());
        // storage.remove('loggedInfo');
        // window.location.href = '/';
    }, [dispatch]);


    if(!visible) {
        return null;
    }

    return (
        <UserMenu>
            <Username username={username}/>
            <UserMenuItem>나의 흐름</UserMenuItem>
            <UserMenuItem>설정</UserMenuItem>
            <UserMenuItem onClick={handleLogout}>로그아웃</UserMenuItem>
        </UserMenu>
    );
}

export default UserMenuContainer;