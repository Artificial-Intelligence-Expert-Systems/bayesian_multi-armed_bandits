import os
from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
from functools import reduce
import numpy as np

app = Flask(__name__)
CORS(app)

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
        return jsonify(task.serialize())
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


@app.route("/api/task/<task_id>/get_all_interfaces")
def get_all_interfaces(task_id):
    try:
        interfaces = Interface.query.filter_by(task_id=task_id).all()
        return jsonify([ interface.serialize() for interface in interfaces ])
    except Exception as e:
        return(str(e))


# @app.route("/api/task/<task_id>/get_suitable_interface")
# def get_suitable_interface(task_id):
#     try:
#         interfaces_for_task = Interface.query.filter_by(task_id=task_id).all()
#
#         if not len(interfaces_for_task):
#             return jsonify(None)
#
#         done = list(map(lambda interface: interface.amount_task_done, interfaces_for_task))
#         failed = list(map(lambda interface: interface.amount_task_failed, interfaces_for_task))
#         best_interface_index = np.argmax(np.random.beta(done, failed))
#
#         return jsonify(interfaces_for_task[best_interface_index].serialize())
#     except Exception as e:
#         return(str(e))

@app.route("/api/task/<task_id>/get_suitable_interface")
def get_suitable_interface(task_id):
    try:
        # ?????????????????????????? ?????????????????????? ????????, ?????? ?????????????????? ????????????????
        #   ???? ???????????? ?????????????????????? ????????????????????
        interfaces_for_task = Interface.query.filter_by(task_id=task_id).all()
        for interface in interfaces_for_task:
            interface.set_consistency()

        most_suitable_interface = None
        if len(interfaces_for_task):
            db.session.commit()

            # ???????? ???????????????? ???????????????????? ?????????????????? (?? ???????????????? consistency ??????????????????????)
            most_suitable_interface = reduce(
                lambda most_const_int, cur_int:
                    cur_int if cur_int.consistency > most_const_int.consistency else most_const_int,
                interfaces_for_task,
                interfaces_for_task[0]
            )

        return jsonify(most_suitable_interface.serialize() if most_suitable_interface else None)
    except Exception as e:
        return(str(e))


@app.route("/api/task/<task_id>/get_interface_stats")
def get_interface_stats(task_id):
    try:
        interfaces_for_task = Interface.query.filter_by(task_id=task_id).all()

        if not len(interfaces_for_task):
            return jsonify(None)

        ready = [interface.serialize() for interface in interfaces_for_task]
        return jsonify(ready)
    except Exception as e:
        return(str(e))


@app.route("/api/interface/attach")
def attach_interface_to_task():
    name = request.args.get('name')
    task_id = request.args.get('taskId')
    try:
        interface = Interface(
            name=name,
            task_id=task_id
        )
        db.session.add(interface)
        db.session.commit()

        interface.create_url()
        db.session.commit()
        return jsonify(interface.serialize())
    except Exception as e:
        return(str(e))


@app.route("/api/interface/<interface_id>/remove")
def remove_interface(interface_id):
    try:
        interface = Interface.query.get(interface_id)
        db.session.delete(interface)
        db.session.commit()
        return 'Success'
    except Exception as e:
        return (str(e))


@app.route("/api/interface/<interface_id>/set_status/<status>")
def update_interface_params(interface_id, status):
    try:
        interface = Interface.query.get(interface_id)
        interface.amount_task_done += int(status)
        interface.amount_task_failed = interface.amount_task_failed + 1 - int(status)
        db.session.commit()
        return 'Success'
    except Exception as e:
        return(str(e))


if __name__ == '__main__':
    app.run()
