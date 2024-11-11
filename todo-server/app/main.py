from fastapi import FastAPI, HTTPException, Depends, Response, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import Generator, List

import todo_crud
from models import Base, Todo
from schemas import TodoSchema
from database import SessionLocal, engine

Base.metadata.create_all(bind=engine)

app = FastAPI()

origins = [
    "http://localhost:3000",
    "http://localhost:8000",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def get_database() -> Generator[Session, None, None]:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.post("/todos", response_model=TodoSchema)
def create_todo(todo: TodoSchema, db: Session = Depends(get_database)) -> Todo:
    created_todo = todo_crud.create_todo(db, todo)
    return created_todo


@app.get("/todos", response_model=list[TodoSchema])
def get_todos(db: Session = Depends(get_database)) -> List[Todo]:
    return todo_crud.get_todos(db)


@app.get("/todos/{todo_id}", response_model=TodoSchema)
def get_todo(todo_id: int, db: Session = Depends(get_database)) -> Todo:
    todo = todo_crud.get_todo_by_id(db, todo_id)
    if todo is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Todo not found")
    return todo


@app.put("/todos/{todo_id}", response_model=TodoSchema)
def update_todo(todo_id: int, new_todo: TodoSchema, db: Session = Depends(get_database)) -> Todo:
    todo = todo_crud.get_todo_by_id(db, todo_id)
    if not todo:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Todo not found")
    todo_crud.update_todo(db, todo_id, new_todo)
    db.refresh(todo)
    return todo


@app.delete("/todos/{todo_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_todo(todo_id: int, db: Session = Depends(get_database)) -> Response:
    todo = todo_crud.get_todo_by_id(db, todo_id)
    if not todo:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Todo not found")
    todo_crud.delete_todo(db, todo_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
