import {connect} from 'react-redux'
import {
    createNewTask, getTasks,
    getBestInterface, removeTask, attachInterface, removeInterface, getInterfaces, getInterfaceStats
} from "./actions";
import {useEffect, useState} from "react";
import {
    MDBInput,
    MDBBtn,
    MDBContainer,
    MDBRow,
    MDBCol,
    MDBListGroup,
    MDBListGroupItem,
    MDBIcon,
    MDBModal,
    MDBModalDialog,
    MDBModalContent,
    MDBModalHeader,
    MDBModalTitle,
    MDBModalBody
} from 'mdb-react-ui-kit';
import Loader from "react-loader-spinner";
import Iframe from 'react-iframe'
import { useHistory } from 'react-router-dom';

const MainPage = ({ getTasks, tasks, getBestInterface,
                    bestInterface, taskLoader, interfaceLoader,
                    createNewTask, removeTask, getInterfaceStats, stats,

                    interfaces, attachInterface, removeInterface, getInterfaces
                  }) => {
    const [activeTask, setActiveTask] = useState(null);
    const [taskEditing, setTaskEditing] = useState({});
    const [currentTaskName, changeTaskName] = useState('');

    // region Tasks

    useEffect(() => {
        getTasks().then(tasks => {
            chooseTask(tasks[0].id);
        });
    }, []);

    const chooseTask = (taskId) => {
        setActiveTask(taskId);
        getBestInterface(taskId);
        getInterfaceStats(taskId);
    }

    const createTask = () => {
        changeTaskName('');
        createNewTask(currentTaskName).then((task) => {
            chooseTask(task.id);
        })
    }

    const removeTaskHandler = (event, taskId) => {
        event.stopPropagation();
        removeTask(taskId).then(() => {
            if (activeTask === taskId) {
                chooseTask(tasks[0].id);
            }
        });
    }

    const editTask = (event, task) => {
        if (task.id === activeTask) {
            event.stopPropagation();
        }
        setTaskEditing(task);
    }

    // endregion Tasks

    return (
        <MDBContainer className='p-3'>
            <CreateForm create={{
                action: createTask,
                buttonText: 'Создать задачу'
            }}>
                <MDBInput
                    value={currentTaskName}
                    onChange={(e) => changeTaskName(e.target.value)}
                    id='taskCreation' type='text' label='Введите название задачи'/>
            </CreateForm>

            <hr style={{ width: '100%', color: 'black', height: '1px', backgroundColor: 'black' }} />

            <MDBRow className='pt-3 justify-content-between'>
                <MDBCol size='md-5'>
                    <h1>Текущие задачи</h1>
                    {
                        taskLoader
                            ? <Loader
                                className='d-flex justify-content-center pt-3'
                                type="Puff"
                                color="#1266F1"
                                height={50}
                                width={50}/>
                            : <ListGroup
                                list={tasks}
                                activeItem={activeTask}
                                clickHandler={chooseTask}
                                edit={{ enabled: true, handler: editTask }}
                                remove={{ enabled: true, handler: removeTaskHandler }}/>

                    }
                </MDBCol>
                <MDBCol size='md-6'>
                    <h3 className='pt-2'>Лучший интерфейс</h3>
                    <InterfaceCard
                        taskName={tasks.find((task) => task.id === activeTask)?.name}
                        bestInterface={bestInterface}
                        loading={taskLoader || interfaceLoader}/>
                </MDBCol>
            </MDBRow>
            <MDBRow>
                <MDBCol size='md-6'></MDBCol>
                <MDBCol size='md-6'>
                    <h3 className='pt-5'>Статистика по интерфейсам</h3>
                    {
                        (stats || []).map((info) => {
                            return <div className='d-flex justify-content-between'>
                                <div style={{ width: '60%' }}>{ info.name }</div>
                                <div style={{ width: '20%' }}>Решена { info.amount_task_done } раз</div>
                                <div style={{ width: '20%' }}>Нерешена { info.amount_task_failed } раз</div>
                            </div>
                        })
                    }
                </MDBCol>
            </MDBRow>

            <TaskModal setTaskEditing={setTaskEditing}
                       task={taskEditing}
                       interfaces={interfaces}
                       removeInterface={removeInterface}
                       attachInterface={attachInterface}
                       getInterfaces={getInterfaces}
            />
        </MDBContainer>
    )
};

export const CreateForm = ({ children, create, size }) => {
    return (
        <MDBRow>
            <MDBCol size={size || 'md-4'}>
                { children }
            </MDBCol>
            <MDBBtn className={`${create.size || 'col-md-2'} me-2`}
                    style={ create.style || { height: '100%' } }
                    onClick={() => create.action()}>
                { create.buttonText }
            </MDBBtn>
        </MDBRow>
    )
}

export const ListGroup = ({ list, activeItem, clickHandler, edit = {}, remove = {} }) => {
    return (
        <MDBListGroup style={{ minWidth: '22rem' }}>
            {
                list.map((item) => (
                    <div onClick={() => clickHandler(item.id)} key={item.id}>
                        <MDBListGroupItem
                            className={`taskItem ${item.id === activeItem ? 'active-task' : ''}`}
                            active={item.id === activeItem}
                            aria-current={item.id === activeItem ? 'true' : 'false'}
                        >
                            <MDBRow className='justify-content-between'>
                                <MDBCol size='md-9'>{ item.name }</MDBCol>
                                <div className="col-md-2 d-flex justify-content-between">
                                    { edit.enabled &&
                                    <MDBIcon className='item-icon'
                                             data-mdb-toggle="tooltip" title="Редактировать интерфейсы"
                                             onClick={(e) => edit.handler(e, item)}
                                             color='secondary'
                                             icon='pen'/>
                                    }
                                    { remove.enabled &&
                                    <MDBIcon className='item-icon'
                                             data-mdb-toggle="tooltip" title="Удалить задачу"
                                             onClick={(e) => remove.handler(e, item.id)}
                                             color='danger'
                                             icon='trash-alt'/>
                                    }
                                </div>
                            </MDBRow>
                        </MDBListGroupItem>
                    </div>
                ))
            }
        </MDBListGroup>
    )
}

export const TaskModal = ({ setTaskEditing, task, interfaces, getInterfaces, removeInterface, attachInterface }) => {
    const [interfaceName, setInterfaceName] = useState('');
    const [active, setActive] = useState(null);

    useEffect(() => {
        if (task.id) {
            getInterfaces(task.id).then((data) => {
                if (data.length) {
                    setActive(data[0].id);
                }
            })
        }
    }, [task.id]);

    const removeHandler = (event, interfaceId) => {
        event.stopPropagation();
        removeInterface(interfaceId).then(() => {
            if (active === interfaceId) {
                setActive(interfaces[0].id);
            }
        });
    }

    const createHandler = () => {
        setInterfaceName('');
        attachInterface(interfaceName, task.id).then((newInterface) => {
            setActive(newInterface.id);
        });
    }

    return (
        <MDBModal show={task.name} tabIndex='-1'>
            <MDBModalDialog size='lg'>
                <MDBModalContent>
                    <MDBModalHeader>
                        <MDBModalTitle>
                            <h3>{ task.name }</h3>
                        </MDBModalTitle>
                        <MDBBtn className='btn-close' color='none' onClick={() => setTaskEditing({})}></MDBBtn>
                    </MDBModalHeader>
                    <MDBModalBody>
                        <CreateForm create={{
                            action: createHandler,
                            buttonText: 'Добавить интерфейс',
                            size: 'col-md-4'
                        }} size='md'>
                            <MDBInput
                                value={interfaceName}
                                onChange={(e) => setInterfaceName(e.target.value)}
                                id='interfaceName' type='text' label='Введите название интерфейса'/>
                        </CreateForm>

                        <h5 className='pt-4'>Прикрепленные интерфейсы</h5>
                        <ListGroup list={interfaces}
                                   activeItem={active}
                                   clickHandler={(id) => setActive(id)}
                                   remove={{
                                       enabled: true,
                                       handler: removeHandler
                                   }}
                        />
                    </MDBModalBody>
                </MDBModalContent>
            </MDBModalDialog>
        </MDBModal>
    );
}


export const InterfaceCard = ({bestInterface, loading, taskName}) => {
    const history = useHistory();

    if (loading) return <p className='lead'>
        Загрузка задачи...
    </p>

    if (bestInterface) {
        return (
            <div className="card">
                <div className="card-body">
                    <h5 className="card-title">Предпросмотр (кликать нельзя)</h5>
                    <Iframe url={ `${bestInterface.url}?taskName=${taskName}&interfaceName=${bestInterface.name}` }
                            height="250px"
                            id="myId"
                            className="interface-iframe"
                            display="initial"
                            position="relative"/>
                    <button onClick={() =>
                        history.push(`${bestInterface.url}?taskName=${taskName}&interfaceName=${bestInterface.name}`)
                    }
                            type="button"
                            className="btn btn-primary mt-3">Перейти к интерфейсу</button>
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
    interfaceLoader: state.loaders.interface,
    interfaces: state.interfacesForTask,
    stats: state.stats
}), {
    getTasks, getBestInterface,
    createNewTask, removeTask,
    removeInterface, attachInterface,
    getInterfaces, getInterfaceStats
})(MainPage);