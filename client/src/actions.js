import axios from "axios";
const baseUrl = 'http://localhost:5000';

export const GET_TASKS = 'TASKS/ALL';
export const TOGGLE_LOADER_TASKS = 'TOGGLE_LOADER/TASKS';

export const ADD_TASK = 'TASK/ADD';
export const REMOVE_TASK = 'TASK/REMOVE';

export const GET_INTERFACE = 'INTERFACE/GET_THE_BEST';
export const TOGGLE_LOADER_INTERFACE = 'TOGGLE_LOADER/INTERFACE';
export const GET_INTERFACE_STATS = 'INTERFACE/GET_INTERFACE_STATS';

export const GET_INTERFACES = 'INTERFACES/ALL';
export const TOGGLE_LOADER_ALL_INTERFACES = 'TOGGLE_LOADER/ALL_INTERFACES';

export const ADD_INTERFACE = 'INTERFACE/ADD';
export const REMOVE_INTERFACE = 'INTERFACE/REMOVE';

export const getTasks = () => {
    return async (dispatch) => {
        dispatch({type: TOGGLE_LOADER_TASKS});
        const response = await axios.get(`${baseUrl}/api/task/get_all`);
        dispatch({type: TOGGLE_LOADER_TASKS});

        dispatch({
            type: GET_TASKS,
            payload: response.data
        });

        return response.data;
    }
}

export const createNewTask = (taskName) => {
    return (dispatch) => {
        return axios.get(`${baseUrl}/api/task/create/${taskName}`)
            .then(response => {
                dispatch({ type: ADD_TASK, payload: response.data })
                return response.data;
            })
    }
}

export const removeTask = (taskId) => {
    return (dispatch) => {
        return axios.get(`${baseUrl}/api/task/remove/${taskId}`)
            .then(() => {
                dispatch({ type: REMOVE_TASK, payload: taskId });
            })
    }
}

export const getInterfaces = (taskId) => {
    return async (dispatch) => {
        dispatch({type: TOGGLE_LOADER_ALL_INTERFACES});
        const response = await axios.get(`${baseUrl}/api/task/${taskId}/get_all_interfaces`);
        dispatch({type: TOGGLE_LOADER_ALL_INTERFACES});

        dispatch({
            type: GET_INTERFACES,
            payload: response.data
        });

        return response.data;
    }
}

export const attachInterface = (name, taskId) => {
    return (dispatch) => {
        return axios.get(`${baseUrl}/api/interface/attach`, {
            params: { taskId, name }
        }).then((response) => {
            dispatch({ type: ADD_INTERFACE, payload: response.data })
            return response.data;
        });
    };
}

export const removeInterface = (interfaceId) => {
    return (dispatch) => {
        return axios.get(`${baseUrl}/api/interface/${interfaceId}/remove`)
            .then(() => {
                dispatch({ type: REMOVE_INTERFACE, payload: interfaceId })
            })
    };
}

export const getBestInterface = (taskId) => {
    return async (dispatch) => {
        dispatch({type: TOGGLE_LOADER_INTERFACE});
        const response = await axios.get(`${baseUrl}/api/task/${taskId}/get_suitable_interface`)
        dispatch({type: TOGGLE_LOADER_INTERFACE});

        dispatch({
            type: GET_INTERFACE,
            payload: response.data
        })
    }
}

export const getInterfaceStats = (taskId) => {
    return async (dispatch) => {
        const response = await axios.get(`${baseUrl}/api/task/${taskId}/get_interface_stats`)

        dispatch({
            type: GET_INTERFACE_STATS,
            payload: response.data
        })
    }
}

export const sendInterfaceStatus = (interfaceId, status) => {
    return axios.get(`${baseUrl}/api/interface/${interfaceId}/set_status/${status}`)
}