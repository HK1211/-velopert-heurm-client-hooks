import React, { useCallback, useEffect } from 'react';
import { Route } from 'react-router-dom';
import { Home, Auth } from 'pages';
import HeaderContainer from 'containers/Base/HeaderContainer';

import storage from 'lib/storage';
import { setLoggedInfo, checkStatus } from 'redux/modules/user';
import { useDispatch } from 'react-redux';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';

const App = () => {
  const dispatch = useDispatch();
  
  const initializeUserInfo = useCallback(async()=>{
    const loggedInfo = storage.get('loggedInfo');
    if(!loggedInfo) return; // 로그인 정보가 없다면 여기서 멈춥니다.
    dispatch(setLoggedInfo(loggedInfo));
    dispatch(checkStatus());
  }, [dispatch]);
  useEffect(() => {
    initializeUserInfo();
  }, [initializeUserInfo]);

  return (
    <div>
        <HeaderContainer />
        <Route exact path="/" component={Home}/>
        <Route path="/auth" component={Auth}/>
        <ToastContainer style={{zIndex: 20}} hideProgressBar={false} position="bottom-right"/>
    </div>
);
}

export default App;