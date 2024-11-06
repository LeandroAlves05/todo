from typing import Optional
from pydantic import BaseModel


class TodoSchema(BaseModel):
    id: Optional[int] = None
    text: str
    completed: bool = False
