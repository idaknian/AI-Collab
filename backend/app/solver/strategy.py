import numpy as np

from app.data.word_data import (
    PATTERN_TABLE,
)


def filter_possible_answers(
    possible_answer_indices: np.ndarray,
    guess_idx: int,
    target_pattern: int,
) -> np.ndarray:

    patterns = PATTERN_TABLE[
        guess_idx,
        possible_answer_indices
    ]

    mask = patterns == target_pattern

    return possible_answer_indices[mask]


def calculate_entropy(
    guess_idx: int,
    possible_answer_indices: np.ndarray,
) -> float:

    patterns = PATTERN_TABLE[
        guess_idx,
        possible_answer_indices
    ]

    counts = np.bincount(
        patterns,
        minlength=243
    )

    counts = counts[counts > 0]

    probabilities = (
        counts /
        len(possible_answer_indices)
    )

    entropy = -np.sum(
        probabilities *
        np.log2(probabilities)
    )

    return float(entropy)


def calculate_solve_probability(
    guess_idx: int,
    possible_answer_indices: np.ndarray,
) -> float:

    if len(possible_answer_indices) == 0:
        return 0.0
    
    if np.any(possible_answer_indices == guess_idx):
        return 1.0 / len(possible_answer_indices)

    return 0.0


def calculate_score(
    guess_idx: int,
    possible_answer_indices: np.ndarray,
) -> float:

    remaining = len(
        possible_answer_indices
    )

    entropy = calculate_entropy(
        guess_idx,
        possible_answer_indices
    )

    solve_probability = (
        calculate_solve_probability(
            guess_idx,
            possible_answer_indices
        )
    )

    # Early game
    if remaining > 100:
        return entropy

    # Mid game
    elif remaining > 20:
        return (
            1.0 * entropy +
            2.0 * solve_probability
        )

    # End game
    else:
        return(
            1.0 * entropy +
            5.0 * solve_probability
        )


def rank_guesses(
    possible_answer_indices: np.ndarray,
    allowed_guess_indices: list[int],
    top_n: int = 5,
):

    rankings = []

    for guess_idx in allowed_guess_indices:

        score = calculate_score(
            guess_idx,
            possible_answer_indices
        )

        rankings.append(
            (
                guess_idx,
                score
            )
        )

    rankings.sort(
        key=lambda x: x[1],
        reverse=True
    )

    return rankings[:top_n]