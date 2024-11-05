from sqlalchemy.orm import Session
from models import Todo
from schemas import TodoCreate


def get_todos(db: Session):
    return db.query(Todo).all()


def get_todo_by_id(db: Session, todo_id: int):
    return db.query(Todo).filter(Todo.id == todo_id).first()


def create_todo(db: Session, todo: TodoCreate):
    todo = Todo(title=todo.title, completed=todo.completed)
    db.add(todo)
    db.commit()
    db.refresh(todo)
    return todo


def update_todo(db: Session, todo_id: int, new_todo: TodoCreate):
    todo = db.query(Todo).filter(Todo.id == todo_id).first()
    if todo:
        todo.title = new_todo.title
        todo.completed = new_todo.completed
        db.commit()
        db.refresh(todo)
    return todo


def delete_todo(db: Session, todo_id: int):
    todo = db.query(Todo).filter(Todo.id == todo_id).first()
    if todo:
        db.delete(todo)
        db.commit()
    return todo
