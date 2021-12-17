from app import db

from scipy.stats import beta
import numpy as np

class Task(db.Model):
    __tablename__ = 'task'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String())
    interfaces = db.relationship('Interface')

    def __init__(self, name):
        self.name = name

    def __repr__(self):
        return '<id {}>'.format(self.id)

    def serialize(self):
        return {
            'id': self.id,
            'name': self.name
        }


class Interface(db.Model):
    __tablename__ = 'interface'

    id = db.Column(db.Integer, primary_key=True)
    url = db.Column(db.String())
    name = db.Column(db.String())
    task_id = db.Column(db.Integer, db.ForeignKey('task.id'), nullable=False)
    consistency = db.Column(db.Integer)
    amount_task_done = db.Column(db.Integer)
    amount_task_failed = db.Column(db.Integer)

    def __init__(self, name, task_id):
        self.name = name
        self.task_id = task_id
        self.amount_task_done = 1
        self.amount_task_failed = 1
        self.consistency = self.set_consistency()

    def __repr__(self):
        return '<id {}>'.format(self.id)

    def create_url(self):
        self.url = f'/task/{self.task_id}/interface/{self.id}'

    def set_consistency(self):
        probabilities = np.linspace(0, 1, 100)
        distribution = beta(self.amount_task_done, self.amount_task_failed).pdf(probabilities)
        self.consistency = probabilities[ np.argmax(distribution) ]

    def serialize(self):
        return {
            'id': self.id,
            'name': self.name,
            'url': self.url,
            'task_id': self.task_id,
            'amount_task_done': self.amount_task_done,
            'amount_task_failed': self.amount_task_failed
        }
