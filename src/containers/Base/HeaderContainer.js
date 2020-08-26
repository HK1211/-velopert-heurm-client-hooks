import React, { useCallback, useRef } from 'react';
import Header, { LoginButton, UserThumbnail } from 'components/Base/Header';
import { useSelector, useDispatch } from 'react-redux';
import { setUserMenuVisibility } from 'redux/modules/base';
import UserMenuContainer from './UserMenuContainer';
import useOnClickOutside from 'hooks/useOnClickOutside';

const HeaderContainer = () => {
    const { visible } = useSelector(state=>state.base.header);
    const { logged, loggedInfo } = useSelector(state=>state.user);
    const dispatch = useDispatch();

    const ref = useRef();
    const onClickOutside = useCallback(()=>{
        dispatch(setUserMenuVisibility(false));
    }, [dispatch]);

    useOnClickOutside(ref, () => onClickOutside());
    
    
    const handleThumbnailClick = useCallback(()=>{
        dispatch(setUserMenuVisibility(true));
    }, [dispatch]);
    if(!visible) return null;

    return (
        <Header>
            { logged
                ? <UserThumbnail thumbnail={loggedInfo.thumbnail} onClick={handleThumbnailClick}/>
                : <LoginButton/> 
            }
            <div ref={ref}>
                <UserMenuContainer />
            </div>
            
        </Header>
    );
}

export default HeaderContainer;