import React from 'react';
import PageWrapper from 'components/Base/PageWrapper';
import { WritePostContainer } from 'containers/Home';
import { PostListContainer } from 'containers/Shared/PostList';

const Home = () => {
    return (
        <PageWrapper>
            <WritePostContainer/>
            <PostListContainer/>
        </PageWrapper>
    );
}

export default Home;