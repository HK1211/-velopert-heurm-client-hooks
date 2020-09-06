import React, { useCallback } from 'react';
import UserMenu, { UserMenuItem, Username } from 'components/Base/UserMenu';
// import storage from 'lib/storage';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from 'redux/modules/user';
import { setUserMenuVisibility } from 'redux/modules/base';
import { withRouter } from 'react-router-dom';

const UserMenuContainer = ({ history }) => {
    const { visible } = useSelector(state=>state.base.userMenu);
    const { username } = useSelector(state=>state.user.loggedInfo);
    const dispatch = useDispatch();
    
    const handleLogout = useCallback(()=>{
        dispatch(logout());
        // storage.remove('loggedInfo');
        // window.location.href = '/';
    }, [dispatch]);

    const handleOpenMyHeurm = useCallback(() => {
        history.push(`/@${username}`);
        dispatch(setUserMenuVisibility(false));
    }, [dispatch, history, username])


    if(!visible) {
        return null;
    }

    return (
        <UserMenu>
            <Username username={username}/>
            <UserMenuItem onClick={handleOpenMyHeurm}>나의 흐름</UserMenuItem>
            <UserMenuItem>설정</UserMenuItem>
            <UserMenuItem onClick={handleLogout}>로그아웃</UserMenuItem>
        </UserMenu>
    );
}

export default withRouter(UserMenuContainer);