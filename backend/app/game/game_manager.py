import uuid
import random
import numpy as np
from app.game.models import GameState
from app.game.models import TurnRecord

from fastapi import HTTPException

from app.solver.scorer import (
    get_feedback,
)

from app.solver.encoding import (
    encode_feedback,
)

from app.solver.strategy import (
    filter_possible_answers,
)

from app.solver.ai_player import (
    choose_ai_guess,
)

from app.solver.pattern_table import (
    guess_idx,
    guess_word,
)

from app.data.word_data import (
    ANSWERS,
    GUESSES,
)

GAMES: dict[str, GameState] = {}

def create_game():

    target_idx = random.randrange(
        len(ANSWERS)
    )

    target_word = ANSWERS[target_idx]

    game_id = str(
        uuid.uuid4()
    )

    state = GameState(
        game_id=game_id,
        target_idx=target_idx,
        target_word=target_word,
        possible_answer_indices=np.arange(
            len(ANSWERS),
            dtype=np.int32
        )
    )

    GAMES[game_id] = state

    return {
        "game_id": game_id
    }

def get_game(
    game_id: str
):

    if game_id not in GAMES:
        raise ValueError(
            "Invalid game id"
        )

    return GAMES[game_id]

def submit_human_guess(
    game_id: str,
    guess_word_input: str,
):

    game = get_game(
        game_id
    )

    if game.current_player != "human":
        raise ValueError(
            "Not human turn"
        )
    
    if(game.human_attempts > 6):
        raise ValueError(
            "Human has no attempts left"
        )

    if guess_word_input not in GUESSES:
        raise HTTPException(
            status_code=400,
            detail="Invalid word"
        )
        raise ValueError(
            "Invalid guess"
        )

    if game.winner:
        return game

    target_word = game.target_word
    remaining_before = len(game.possible_answer_indices)

    feedback = get_feedback(
        guess_word_input,
        target_word
    )

    pattern = encode_feedback(
        feedback
    )

    game.possible_answer_indices = filter_possible_answers(
        game.possible_answer_indices,
        guess_idx(
            guess_word_input
        ),
        pattern
    )

    game.human_attempts += 1
    remaining_after = len(game.possible_answer_indices)
    game.current_player = "ai"

    game.history.append(
        TurnRecord(
            player="human",
            guess=guess_word_input,
            feedback=feedback,
            remaining_before=remaining_before,
            remaining_after=remaining_after,
        )
    )

    if guess_word_input == target_word:

        game.winner = "human"

    if (
        game.human_attempts >= 6
        and game.ai_attempts >= 6
        and game.winner is None
    ):
        game.winner = "draw"

    return {
        "feedback": feedback,
        "winner": game.winner
    }

def play_ai_turn(
    game_id: str
):

    game = get_game(
        game_id
    )

    if game.current_player != "ai":
        raise ValueError(
            "Not AI turn"
        )

    if game.winner:
        return game
    
    if(game.ai_attempts > 6):
        raise ValueError(
            "AI has no attempts left"
        )

    candidates = game.possible_answer_indices
    remaining_before = len(game.possible_answer_indices)

    if len(candidates) > 50:

        allowed_guess_indices = list(
            range(len(GUESSES))
        )

    else:

        allowed_guess_indices = [
            guess_idx(
                ANSWERS[idx]
            )
            for idx in candidates
        ]

    guess_index, rankings = (
        choose_ai_guess(
            candidates,
            allowed_guess_indices
        )
    )

    ai_guess_word = guess_word(
        guess_index
    )

    target_word = game.target_word

    feedback = get_feedback(
        ai_guess_word,
        target_word
    )

    pattern = encode_feedback(
        feedback
    )

    game.possible_answer_indices = filter_possible_answers(
        game.possible_answer_indices,
        guess_index,
        pattern
    )

    remaining_after = len(game.possible_answer_indices)
    game.ai_attempts += 1

    game.history.append(
        TurnRecord(
            player="ai",
            guess=ai_guess_word,
            feedback=feedback,
            remaining_before=remaining_before,
            remaining_after=remaining_after,
            top_guesses=[
                {
                    "word": guess_word(idx),
                    "score": round(score, 3)
                }
                for idx, score in rankings
            ]
        )
    )

    if ai_guess_word == target_word:

        game.winner = "ai"

    game.current_player = "human"

    if (
        game.human_attempts >= 6
        and game.ai_attempts >= 6
        and game.winner is None
    ):
        game.winner = "draw"

    return {
        "guess": ai_guess_word,
        "feedback": feedback,
        "winner": game.winner
    }

def game_to_dict(game: GameState):

    return {
        "game_id": game.game_id,
        "current_player": game.current_player,
        "human_attempts": game.human_attempts,
        "ai_attempts": game.ai_attempts,
        "winner": game.winner,
        "history": [
            {
                "player": turn.player,
                "guess": turn.guess,
                "feedback": turn.feedback,
                "remaining_before": turn.remaining_before,
                "remaining_after": turn.remaining_after,
                "top_guesses": turn.top_guesses,
            }
            for turn in game.history
        ]
    }