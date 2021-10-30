import {useHistory, useLocation} from "react-router-dom";
import {sendInterfaceStatus} from "./actions";

const InterfacePage = () => {
    const pageLocation = useLocation();
    const history = useHistory();
    const query = new URLSearchParams(pageLocation.search);

    const sendInterfaceResult = (status) => {
        sendInterfaceStatus(pageLocation.pathname.split('/').pop(), status).then(() => {
            history.goBack();
        });
    }

    return (
        <div className='container'>
            <div className="row mt-5">
                <h2>Задача '{query.get('taskName')}'... интерфейс '{query.get('interfaceName')}'</h2>
                <div className="col-md-4">
                    <h3>Выбор за Вами!</h3>
                    <div className="choice-buttons d-flex justify-content-between mt-4">
                        <button className='btn btn-success' onClick={() => sendInterfaceResult(1)}>Задача выполнена</button>
                        <button className='btn btn-danger' onClick={() => sendInterfaceResult(0)}>Задача невыполнена</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default InterfacePage;