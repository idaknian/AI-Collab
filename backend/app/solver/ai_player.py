from app.solver.strategy import (
    rank_guesses,
)


def choose_ai_guess(
    possible_answer_indices,
    allowed_guess_indices,
):

    rankings = rank_guesses(
        possible_answer_indices,
        allowed_guess_indices,
        top_n=5
    )

    best_guess_idx = rankings[0][0]

    return (
        best_guess_idx,
        rankings
    )