import React, { useEffect, useCallback, useRef } from 'react'
import PostList from 'components/Shared/PostList';
import { loadPost, prefetchPost, showPrefetchedPost } from 'redux/modules/posts';
import { useSelector, useDispatch } from 'react-redux';

const PostListContainer = () => {
    const next = useSelector(state=>state.posts.next);
    // const loading = useSelector(state=>state.posts.ajax.postList.loading);
    const posts = useSelector(state=>state.posts.resultPostList);
    const nextData = useSelector(state=>state.posts.ajax.nextData.data);
    const dispatch = useDispatch();
    const prev = useRef(null);
    const prevNext = useRef(false);

    const handleScroll = useCallback(()=> {
        if(!nextData) return;
        const { scrollHeight } = document.body;
        const { innerHeight } = window;
        // IE 에서는 body.scrollTop 대신에 document.documentElement.scrollTop 사용해야함
        const scrollTop = (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop;
        
        if(scrollHeight - innerHeight - scrollTop < 100) {
            dispatch(showPrefetchedPost()); // 미리 불러왔던걸 보여준 다음에

            if(next === prev.current || !next) return; // 이전에 했던 요청과 동일하면 요청하지 않는다.
            prev.current = next;

            // 다음 데이터 요청
            dispatch(prefetchPost(next));
            handleScroll();
        }
    }, [dispatch, next, nextData]);

    useEffect(()=>{
        // 최초 포스트 호출
        dispatch(loadPost());
    }, [dispatch]);

    useEffect(()=>{
        // 이벤트 리스너 생성
        window.addEventListener('scroll', handleScroll);
        return(()=>{
            window.removeEventListener('scroll', handleScroll);
        });
    }, [handleScroll]);

    useEffect(()=>{
        // next가 있으면 최초 1회만 nextPost 통신시도
        if(!prevNext.current) {
            if(next) {
                dispatch(prefetchPost(next));
                prevNext.current = true;
            }
        }
    }, [dispatch, next])

    // if(loading) {
    //     return <div>로딩중</div>
    // }

    return (
        <PostList posts={posts}/>
    );
}

export default PostListContainer
