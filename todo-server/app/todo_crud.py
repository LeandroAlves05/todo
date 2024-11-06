from sqlalchemy.orm import Session
from models import Todo
from schemas import TodoSchema


def get_todos(db: Session):
    return db.query(Todo).all()


def get_todo_by_id(db: Session, todo_id: int):
    return db.query(Todo).filter(Todo.id == todo_id).first()


def create_todo(db: Session, todo: TodoSchema):
    todo = Todo(text=todo.text, completed=todo.completed)
    db.add(todo)
    db.commit()
    db.refresh(todo)
    return todo


def update_todo(db: Session, todo_id: int, new_todo: TodoSchema):
    db.query(Todo).filter(Todo.id == todo_id).update(
        {"text": new_todo.text, "completed": new_todo.completed}
    )
    db.commit()


def delete_todo(db: Session, todo_id: int):
    db.query(Todo).filter(Todo.id == todo_id).delete()
    db.commit()
