from dataclasses import dataclass, field
import numpy as np

@dataclass
class TurnRecord:

    player: str

    guess: str

    feedback: list[int]

    remaining_before: int

    remaining_after: int

    top_guesses: list[dict] = field(
        default_factory=list
    )

@dataclass
class GameState:
    game_id: str
    username: str
    target_word: str
    target_idx: int
    mode: str
    possible_answer_indices: np.ndarray

    current_player: str = "human"
    human_attempts: int = 0
    ai_attempts: int = 0

    winner: str | None = None

    history: list[TurnRecord] = field(
        default_factory=list
    )
