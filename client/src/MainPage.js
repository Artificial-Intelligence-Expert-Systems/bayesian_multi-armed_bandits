import {connect} from 'react-redux'
import {createNewTask, getTasks,
    getBestInterface, removeTask
} from "./actions";
import {useEffect, useState} from "react";
import {
    MDBInput, MDBBtn,
    MDBContainer, MDBRow, MDBCol,
    MDBListGroup, MDBListGroupItem, MDBIcon
} from 'mdb-react-ui-kit';
import Loader from "react-loader-spinner";

const MainPage = ({ getTasks, tasks, getBestInterface, bestInterface, taskLoader, interfaceLoader }) => {
    const [activeTask, setActiveTask] = useState(null);
    const [currentTaskName, changeTaskName] = useState('');

    useEffect(() => getAllTasks(), []);

    const getAllTasks = (activeTaskId) => {
        return getTasks().then(tasks => {
            chooseTask(activeTaskId || tasks[0].id);
        });
    }

    const chooseTask = (taskId) => {
        setActiveTask(taskId);
        getBestInterface(taskId);
    }

    const createTask = () => {
        changeTaskName('');
        createNewTask(currentTaskName).then(getAllTasks);
    };

    const removeTaskHandler = (event, taskId) => {
        event.stopPropagation();
        removeTask(taskId).then(() => getAllTasks(taskId !== activeTask ? activeTask : undefined));
    }

    return (
        <MDBContainer className='p-3'>
            <MDBRow>
                <MDBCol size='md-4'>
                    <MDBInput
                        value={currentTaskName}
                        onChange={(e) => changeTaskName(e.target.value)}
                        id='taskCreation' type='text' label='Введите название задачи'/>
                </MDBCol>
                <MDBBtn className='col-md-2' onClick={createTask}>Создать задачу</MDBBtn>
            </MDBRow>
            <hr style={{ width: '100%', color: 'black', height: '1px', backgroundColor: 'black' }} />
            <MDBRow className='pt-3 justify-content-between'>
                <MDBCol size='md-5'>
                    <h1>Текущие задачи</h1>
                    {
                        taskLoader ? <Loader
                            className='d-flex justify-content-center pt-3'
                            type="Puff"
                            color="#1266F1"
                            height={50}
                            width={50}
                        /> :
                        <MDBListGroup style={{ minWidth: '22rem' }}>
                            {
                                tasks.map((task) => (
                                    <div onClick={() => chooseTask(task.id)}>
                                        <MDBListGroupItem
                                            className={`taskItem ${task.id === activeTask ? 'active-task' : ''}`}
                                            key={task.id}
                                            active={task.id === activeTask}
                                            aria-current={task.id === activeTask ? 'true' : 'false'}
                                        >
                                            <MDBRow className='justify-content-between'>
                                                <MDBCol size='md-10'>{ task.name }</MDBCol>
                                                <MDBIcon className='col-md-1 remove-icon'
                                                         data-mdb-toggle="tooltip" title="Удалить задачу"
                                                         onClick={(e) => removeTaskHandler(e, task.id)}
                                                         color='danger'
                                                         icon='trash-alt'/>
                                            </MDBRow>
                                        </MDBListGroupItem>
                                    </div>
                                ))
                            }
                        </MDBListGroup>
                    }
                </MDBCol>
                <MDBCol size='md-6'>
                    <h3 className='pt-2'>Лучший интерфейс</h3>
                    <InterfaceCard bestInterface={bestInterface} loading={taskLoader || interfaceLoader}/>
                </MDBCol>
            </MDBRow>
        </MDBContainer>
    )
};

export const InterfaceCard = ({bestInterface, loading}) => {
    if (loading) return <p className='lead'>
        Загрузка задачи...
    </p>

    if (bestInterface) {
        return (
            <div className="card">
                <div className="card-body">
                    <h5 className="card-title">Card title</h5>
                    <p className="card-text">
                        Some quick example text to build on the card title and make up the bulk of the
                        card's content.
                    </p>
                    <button type="button" className="btn btn-primary">Button</button>
                </div>
            </div>
        );
    }

    return <p className='lead'>
        Пока у задачи нет интерфейсов. Прикрепите несколько, чтобы увидеть, какой из них лучше всего решит поставленную задачу
    </p>
}

export default connect((state) => ({
    tasks: state.tasks,
    bestInterface: state.interface,
    taskLoader: state.loaders.tasks,
    interfaceLoader: state.loaders.interface
}), {getTasks, getBestInterface})(MainPage);