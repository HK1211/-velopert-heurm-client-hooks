import React, { useEffect, useCallback, useRef, createContext, useContext } from 'react'
import PostList from 'components/Shared/PostList';
import { loadPost, prefetchPost, showPrefetchedPost, likePost, unlikePost, toggleComment } from 'redux/modules/posts';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { setRelayoutHandler } from 'lib/withRelayout';

const ReLayout = createContext();

const PostListContainer = ({username}) => {
    const next = useSelector(state=>state.posts.next);
    // const loading = useSelector(state=>state.posts.ajax.postList.loading);
    const posts = useSelector(state=>state.posts.resultPostList);
    const nextData = useSelector(state=>state.posts.ajax.nextData.data);
    const logged = useSelector(state=>state.user.logged);

    const dispatch = useDispatch();

    const prev = useRef(null);
    const prevNext = useRef(false);
    const masonry = useRef(null);
    const willMount = useRef(true);

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

    const handleToggleLike = useCallback(({postId, liked})=>{
       const message = (message) => (<div style={{fontSize: '1.1rem'}}>{message}</div>);
        if(!logged) {
            return toast(message('로그인 후 이용할 수 있습니다.'), { type: 'error' });
        }
        if(liked) {
            dispatch(unlikePost(postId));
        } else {
            dispatch(likePost(postId));
       }
    }, [dispatch, logged]);

    const handleCommentClick = useCallback((postId)=>{
        dispatch(toggleComment(postId));
        setTimeout(() => masonry.current.masonry.layout(), 0);
    }, [dispatch]);

    const handleRelayout = useCallback(()=>{
        setTimeout(() => masonry.current.masonry.layout(), 0);
    }, []);

    useEffect(()=>{
        // 최초 포스트 호출 + username 변경되었을때 호출
        dispatch(loadPost(username));
    }, [dispatch, username]);

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
    }, [dispatch, next]);

    useEffect(()=>{
        if(willMount.current) {
            setRelayoutHandler(handleRelayout);
            willMount.current = false;
        }
    }, [handleRelayout]);

    return (
        <ReLayout.Provider value={handleRelayout}>
            <PostList
                posts={posts}
                onToggleLike={handleToggleLike}
                onCommentClick={handleCommentClick}
                masonryRef={masonry}
            />
        </ReLayout.Provider>
    );
}

export function useReLayout() {
    const context = useContext(ReLayout);
    if (!context) {
      throw new Error('Cannot find ReLayout');
    }
    return context;
  }

export default PostListContainer;
