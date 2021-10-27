import os
from functools import reduce
from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS

app = Flask(__name__)
cors = CORS(app)

app.config.from_object(os.environ['APP_SETTINGS'])
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)
migrate = Migrate(app, db)

from models import Task, Interface


@app.route("/api/task/create/<task_name>")
def create_task(task_name):
    try:
        task = Task(name=task_name)
        db.session.add(task)
        db.session.commit()
        return jsonify({ 'id': task.id })
    except Exception as e:
        return(str(e))


@app.route("/api/task/remove/<task_id>")
def remove_task(task_id):
    try:
        task = Task.query.get(task_id)
        db.session.delete(task)
        db.session.commit()
        return 'Success'
    except Exception as e:
        return (str(e))


@app.route("/api/task/get_all")
def get_all_tasks():
    try:
        tasks = Task.query.all()
        return jsonify([ task.serialize() for task in tasks ])
    except Exception as e:
        return(str(e))


@app.route("/api/task/<task_id>/get_suitable_interface")
def get_suitable_interface(task_id):
    try:
        # Пересчитываем вероятность того, что интерфейс подходит
        #   на основе обновленных параметров
        interfaces_for_task = Interface.query.filter_by(task_id=task_id).all()
        for interface in interfaces_for_task:
            interface.consistency = interface.calc_consistency()

        most_suitable_interface = None
        if len(interfaces_for_task):
            db.session.commit()

            # Ищем наиболее подходящий интерфейс (у которого consistency максимально)
            most_suitable_interface = reduce(
                lambda most_const_int, cur_int:
                    cur_int if cur_int.consistency > most_const_int.consistency else most_const_int,
                interfaces_for_task,
                interfaces_for_task[0]
            )

        return jsonify(most_suitable_interface.serialize() if most_suitable_interface else None)
    except Exception as e:
        return(str(e))


@app.route("/api/interface/attach", methods=['POST'])
def attach_interfaces_to_task():
    interfaces = request.args.get('interfaces')
    task_id = request.args.get('taskId')
    try:
        for name, url in interfaces.items():
            interface = Interface(name=name, url=url, task_id=task_id)
            db.session.add(interface)

        db.session.commit()
        return 'Success'
    except Exception as e:
        return(str(e))


@app.route("/api/interface/<interface_id>/set_status/<status>", methods=['POST'])
def update_interface_params(interface_id, status):
    try:
        interface = Interface.query.get(interface_id)
        interface.a_param += status
        interface.b_param = interface.b_param + 1 - status
        db.session.commit()
        return 'Success'
    except Exception as e:
        return(str(e))


if __name__ == '__main__':
    app.run()
