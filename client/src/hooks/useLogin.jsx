import Cookies from 'js-cookie';
import { useState } from 'react';
import { useAuthContext } from "./useAuthContext";
import axios from 'axios';
import apiService from '../utilities/httpservices';

export const useLogin = () => {
    const [error, setError] = useState(null)
    const [isLoading, setIsLoading] = useState(null)
    const { dispatch } = useAuthContext()


    const login = async (username, password) => {

        setIsLoading(true)
        setError(null)
        
        const result = await apiService.createData('users/login',{username,password})
        console.log(result);

        if(result){
            dispatch({ type: 'LOGIN', payload: result })
            Cookies.set('user', JSON.stringify(result), { expires: 1 })
            Cookies.set('token', result.token, { expires: 1 });
            Cookies.set('username',result.user.username, { expires: 1 })
        }
    }

    return { login, isLoading, error }

}