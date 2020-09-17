import axios from 'axios';
import  * as actionTypes from "./actionTypes";
import { getApi } from '../utilities/apiConfig';

const fetchFilterDataSuccess = (data) => {
    return {
        type: actionTypes.FETCH_FILTER_DATA_SUCCESS,
        filterData: data
    }
}

const fetchFilterDataStart = () => {
    return {
        type: actionTypes.FETCH_FILTER_DATA_START
    }
}

const fetchFilterDataError = (errMessage) => {
    return {
        type: actionTypes.FETCH_FILTER_DATA_ERROR,
        errMessage: errMessage
    }
}

export const deleteError = () => {
    return {
        type: actionTypes.DELETE_ERROR
    }
}

export const fetchFilterData = () => {
    return dispatch => {
        dispatch(fetchFilterDataStart());
        const url = getApi('GET', 'filterData','', '');
        axios.get(url)
            .then(res => {
                return dispatch(fetchFilterDataSuccess(res.data))
            })
            .catch(err => dispatch(fetchFilterDataError(err.message)));
    }
}

const fetchCreaturesStart = () => {
    return {
        type: actionTypes.FETCH_CREATURES_START
    }
}

const fetchCreaturesSuccess = (data) => {
    return {
        type: actionTypes.FETCH_CREATURES_SUCCESS,
        creatures: data
    }
}

const fetchCreaturesError = (errMessage) => {
    return {
        type: actionTypes.FETCH_CREATURES_ERROR,
        error: errMessage
    }
}

export const fetchCreatures = (query) => {
    let queryString = null;
    if(query) {
        queryString = query;
    }
    return dispatch => {
        dispatch(fetchCreaturesStart());
        const url = getApi('GET', 'creatures', null, queryString);
        axios.get(url)
            .then(res => dispatch(fetchCreaturesSuccess(res.data.data)))
            .catch(err => fetchCreaturesError(err.message))
    }
}

const fetchCreatureByIdStart = () => {
    return {
        type: actionTypes.FETCH_CREATURES_BY_ID_START
    }
}

const fetchCreatureByIdSuccess = (creature) => {
    return {
        type: actionTypes.FETCH_CREATURES_BY_ID_SUCCESS,
        creature: creature
    }
}

const fetchCreatureByIdError = (errMessage) => {
    return {
        type: actionTypes.FETCH_CREATURES_BY_ID_ERROR,
        errMessage: errMessage
    }
}


export const fetchCreatureById = (id) => {
    return dispatch => {
        dispatch(fetchCreatureByIdStart());;
        const api = getApi('GET', 'creatures', id, null);
        axios.get(api)
            .then(res => dispatch(fetchCreatureByIdSuccess(res.data.data)))
            .catch(err => dispatch(fetchCreatureByIdError(err.message)));
    }
}