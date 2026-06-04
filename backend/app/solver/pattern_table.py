from pathlib import Path
import numpy as np

ROOT = Path(__file__).resolve().parents[1]

from app.data.word_data import (
    ANSWERS,
    GUESSES,
    PATTERN_TABLE,
)

GUESS_TO_IDX = {
    word: i
    for i, word in enumerate(GUESSES)
}

ANSWER_TO_IDX = {
    word: i
    for i, word in enumerate(ANSWERS)
}

def guess_idx(word: str) -> int:
    return GUESS_TO_IDX[word]

def answer_idx(word: str) -> int:
    return ANSWER_TO_IDX[word]

def answer_word(idx: int) -> str:
    return ANSWERS[idx]

def guess_word(idx: int) -> str:
    return GUESSES[idx]

def get_pattern_id(
    guess: str,
    answer: str
) -> int:

    return int(
        PATTERN_TABLE[
            GUESS_TO_IDX[guess],
            ANSWER_TO_IDX[answer]
        ]
    )

def get_pattern_by_idx(
    guess_idx: int,
    answer_idx: int
) -> int:

    return PATTERN_TABLE[
        guess_idx,
        answer_idx
    ]

if __name__ == "__main__":
    print(
        len(GUESSES),
        len(ANSWERS),
        PATTERN_TABLE.shape
    )