import random
import numpy as np

from app.solver.scorer import get_feedback
from app.solver.pattern_table import guess_idx as guess_to_idx
from app.solver.pattern_table import guess_word as idx_to_guess
from app.solver.encoding import encode_feedback
# from app.solver.pattern_table import get_pattern_by_idx
from app.solver.strategy import (
    rank_guesses,
    filter_possible_answers,
)

from app.data.word_data import (
    ANSWERS,
    GUESSES,
)

ENDGAME_THRESHOLD = 50
OPENING_WORD = "raise"

def play_game() -> dict:

    target_idx = random.randrange(
        len(ANSWERS)
    )
    target_word = ANSWERS[target_idx]

    possible_answer_indices = np.arange(
        len(ANSWERS),
        dtype=np.int32
    )


    history = []

    max_attempts = 6

    for attempt in range(1, max_attempts + 1):

        print(
            "possible answers:",
            len(possible_answer_indices)
        )
        top_guess_data = []

        if len(possible_answer_indices) > ENDGAME_THRESHOLD:
            allowed_guess_indices = list(range(len(GUESSES)))
        else:
            allowed_guess_indices = [
                guess_to_idx(
                    ANSWERS[answer_idx]
                )
                for answer_idx in possible_answer_indices
            ]

        if attempt == 1:
            guess_word = OPENING_WORD
            guess_idx = guess_to_idx(OPENING_WORD)
        else:
            top_rankings = rank_guesses(
                possible_answer_indices,
                allowed_guess_indices,
                top_n=5
            )
            guess_idx = top_rankings[0][0]

            top_guess_data = [
                {
                    "word": idx_to_guess(idx),
                    "entropy": round(entropy, 3)
                }
                for idx, entropy in top_rankings
            ]
            
            guess_word = idx_to_guess(guess_idx)        

        feedback = get_feedback(guess_word, target_word)

        history.append({
            "guess": guess_word,
            "feedback": feedback,
            "remaining_candidates_before_guess": len(possible_answer_indices),
            "top_guesses": top_guess_data
        })

        if guess_word == target_word:
            return {
                "result": "win",
                "attempts": attempt,
                "target": target_word,
                "history": history
            }
        # pattern_from_feedback = encode_feedback(feedback)

        # pattern_from_table = get_pattern_by_idx(
        #     guess_idx,
        #     target_idx
        # )

        # print(
        #     pattern_from_feedback,
        #     pattern_from_table
        # )

        pattern = encode_feedback(
            feedback
        )

        possible_answer_indices = filter_possible_answers(
            possible_answer_indices,
            guess_idx,
            pattern
        )
        history[-1]["remaining_candidates_after_guess"] = len(possible_answer_indices)

        print(
            f"Attempt {attempt}: "
            f"guess={guess_word} "
            f"remaining={len(possible_answer_indices)}"
        )

    return {
        "result": "lose",
        "attempts": max_attempts,
        "target": target_word,
        "history": history
    }