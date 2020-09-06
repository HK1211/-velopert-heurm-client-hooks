import React, { useEffect } from 'react';
import PageWrapper from 'components/Base/PageWrapper';
import UserHeadContainer from 'containers/User/UserHeadContainer';
import PostListContainer from 'containers/Shared/PostList/PostListContainer';
import socket from 'lib/socket';

function User({ match }) {
    const { username } = match.params;

    useEffect(()=>{
        socket.ignore();
        return(()=>{
            socket.listen();
        })
    }, [])

    return (
        <PageWrapper>
            <UserHeadContainer username={username}/>
            <PostListContainer username={username}/>
        </PageWrapper>
    );
}

export default User;