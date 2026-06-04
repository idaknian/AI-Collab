from pathlib import Path
import numpy as np

from app.solver.scorer import get_feedback
from app.solver.encoding import encode_feedback
import time

start = time.perf_counter()

ROOT = Path(__file__).resolve().parents[1]

with open(ROOT / "app/data/answers.txt") as f:
    ANSWERS = [
        w.strip()
        for w in f
    ]

with open(ROOT / "app/data/guesses.txt") as f:
    GUESSES = [
        w.strip()
        for w in f
    ]

# GUESSES = GUESSES[:100]
# ANSWERS = ANSWERS[:100]

table = np.zeros(
    (
        len(GUESSES),
        len(ANSWERS)
    ),
    dtype=np.uint8
)


for guess_idx, guess in enumerate(GUESSES):

    if guess_idx % 500 == 0: 
        print(
            f"{guess_idx}/{len(GUESSES)}"
        )

    for answer_idx, answer in enumerate(ANSWERS):

        pattern = encode_feedback(
            get_feedback(
                guess,
                answer
            )
        )

        table[
            guess_idx,
            answer_idx
        ] = pattern

output = ROOT / "app/data/pattern_table.npy"

np.save(
    output,
    table
)

print(
    "Elapsed:",
    time.perf_counter() - start
)

print(
    f"Saved to {output}"
)