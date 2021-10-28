import React from 'react';
import ReactDOM from 'react-dom';
import 'mdb-react-ui-kit/dist/css/mdb.min.css'
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

import thunk from 'redux-thunk';
import { createStore, applyMiddleware, compose } from 'redux';
import { Provider } from 'react-redux'
import {
    ADD_INTERFACE,
    ADD_TASK,
    GET_INTERFACE, GET_INTERFACES,
    GET_TASKS, REMOVE_INTERFACE,
    REMOVE_TASK, TOGGLE_LOADER_ALL_INTERFACES,
    TOGGLE_LOADER_INTERFACE,
    TOGGLE_LOADER_TASKS
} from "./actions";

const initialState = {
    tasks: [],
    interface: null,
    interfacesForTask: [],
    loaders: {
        tasks: false,
        interface: false,
        interfacesForTask: false
    }
}

const rootReducer = function(state = initialState, action) {
    switch(action.type) {
        case GET_TASKS:
            return {
                ...state,
                tasks: action.payload
            }
        case ADD_TASK:
            return {
                ...state,
                tasks: state.tasks.concat(action.payload)
            }
        case REMOVE_TASK:
            const newTasks = state.tasks.filter((task) => task.id !== action.payload);
            return {
                ...state,
                tasks: newTasks
            }
        case GET_INTERFACE:
            return {
                ...state,
                interface: action.payload
            }
        case TOGGLE_LOADER_TASKS:
            return {
                ...state,
                loaders: {
                    ...state.loaders,
                    tasks: !state.loaders.tasks
                }
            }
        case TOGGLE_LOADER_INTERFACE:
            return {
                ...state,
                loaders: {
                    ...state.loaders,
                    interface: !state.loaders.interface
                }
            }
        case GET_INTERFACES:
            return {
                ...state,
                interfacesForTask: action.payload
            }
        case ADD_INTERFACE:
            return {
                ...state,
                interfacesForTask: state.interfacesForTask.concat(action.payload)
            }
        case REMOVE_INTERFACE:
            debugger;
            const newInterfaces = state.interfacesForTask.filter((item) => item.id !== action.payload);
            return {
                ...state,
                interfacesForTask: newInterfaces
            }
        case TOGGLE_LOADER_ALL_INTERFACES:
            return {
                ...state,
                loaders: {
                    ...state.loaders,
                    interfacesForTask: !state.loaders.interfacesForTask
                }
            }
        default: return state;
    }
}

const store = createStore(
    rootReducer, compose(
        applyMiddleware(thunk),
        window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
    )
)

ReactDOM.render(
  <React.StrictMode>
      <Provider store={store}>
          <App />
      </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
