from pydantic import BaseModel
from typing import Literal
# from typing import List

class GuessRequest(BaseModel):
    guess: str
    feedback: list[Literal["gray", "yellow", "green"]]

class HumanGuessRequest(BaseModel):
    game_id: str
    guess: str