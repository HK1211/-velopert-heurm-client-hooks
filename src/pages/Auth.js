import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setHeaderVisibility } from 'redux/modules/base';
import { AuthWrapper } from 'components/Auth';
import { Route } from 'react-router-dom';
import { Login, Register } from 'containers/Auth';

const Auth = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setHeaderVisibility(false));

        return (()=>{
            console.log('setHeaderVisibility => true');
            dispatch(setHeaderVisibility(true));
        })
    }, [dispatch]);

    return (
        <AuthWrapper>
            <Route path="/auth/login" component={Login}/>
            <Route path="/auth/register" component={Register}/>
        </AuthWrapper>
    );
}

export default Auth;