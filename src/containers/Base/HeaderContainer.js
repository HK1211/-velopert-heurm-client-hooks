import React from 'react';
import Header, { LoginButton } from 'components/Base/Header';
import { useSelector } from 'react-redux';

const HeaderContainer = () => {
    const { visible } = useSelector(state=>state.base.header);
    if(!visible) return null;

    return (
        <Header>
            <LoginButton/>
        </Header>
    );
}

export default HeaderContainer;