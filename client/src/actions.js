import axios from "axios";
const baseUrl = 'http://localhost:5000';

export const GET_TASKS = 'TASKS/ALL';
export const TOGGLE_LOADER_TASKS = 'TOGGLE_LOADER/TASKS';

export const GET_INTERFACE = 'INTERFACE/GET_THE_BEST';
export const TOGGLE_LOADER_INTERFACE = 'TOGGLE_LOADER/INTERFACE';

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
    return axios.get(`${baseUrl}/api/task/create/${taskName}`).then(response => response.data.id);
}

export const removeTask = (taskId) => {
    return axios.get(`${baseUrl}/api/task/remove/${taskId}`);
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