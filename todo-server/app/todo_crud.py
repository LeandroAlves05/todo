from sqlalchemy.orm import Session
from models import Todo
from schemas import TodoSchema
from typing import List, Optional


def get_todos(db: Session) -> List[Todo]:
    return db.query(Todo).all()


def get_todo_by_id(db: Session, todo_id: int) -> Optional[Todo]:
    return db.query(Todo).filter(Todo.id == todo_id).first()


def create_todo(db: Session, todo: TodoSchema) -> Todo:
    new_todo = Todo(text=todo.text, completed=todo.completed)
    db.add(new_todo)
    db.commit()
    db.refresh(new_todo)
    return new_todo


def update_todo(db: Session, todo_id: int, new_todo: TodoSchema) -> None:
    db.query(Todo).filter(Todo.id == todo_id).update({"text": new_todo.text, "completed": new_todo.completed})
    db.commit()


def delete_todo(db: Session, todo_id: int) -> None:
    db.query(Todo).filter(Todo.id == todo_id).delete()
    db.commit()
