import * as actionsType from './actionTypes';
import axios from 'axios';
import { baseUrl, headerAuthConfig } from "../utilities/apiConfig";

const fetchUserSuccess = (users) => {
    return {
        type: actionsType.FETCH_USER_SUCCESS,
        users: users
    }
}

export const fetchUsers= (token) => {
    return dispatch => {
        dispatch({type: actionsType.USER_START});
        const header = headerAuthConfig(token);
        axios.get(`${baseUrl}auth/users`, header)
            .then(res => dispatch(fetchUserSuccess(res.data.data)))
            .catch(err => console.log(err.message));
    }
}

export const createUser = (payload, token) => {
    return dispatch => {
        dispatch({type: actionsType.USER_START});
        const header = headerAuthConfig(token);
        axios.post(`${baseUrl}users/sign-up`, payload,header)
            .then(res => dispatch(fetchUserSuccess(res.data.data)))
            .catch(err => console.log(err.message));
    }
}