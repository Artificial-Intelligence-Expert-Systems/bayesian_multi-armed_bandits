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
    url = db.Column(db.String(), nullable=False)
    name = db.Column(db.String())
    task_id = db.Column(db.Integer, db.ForeignKey('task.id'), nullable=False)
    consistency = db.Column(db.Float)
    a_param = db.Column(db.Integer)
    b_param = db.Column(db.Integer)

    def __init__(self, name, url, task_id):
        self.name = name
        self.url = url
        self.task_id = task_id
        self.a_param = 1
        self.b_param = 1
        self.consistency = self.calc_consistency()

    def __repr__(self):
        return '<id {}>'.format(self.id)
    
    def calc_consistency(self):
        probabilities = np.linspace(0, 1, 100)
        distribution = beta(self.a_param, self.b_param).pdf(probabilities)
        return probabilities[ np.argmax(distribution) ]

    def serialize(self):
        return {
            'id': self.id, 
            'name': self.name,
            'url': self.url,
            'task_id': self.task_id,
            'consistency': self.consistency,
            'a_param': self.a_param,
            'b_param': self.b_param
        }
