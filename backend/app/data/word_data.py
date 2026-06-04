from pathlib import Path
import numpy as np

ROOT = Path(__file__).resolve().parent

with open(ROOT / "answers.txt") as f:
    ANSWERS = [
        w.strip()
        for w in f
    ]

with open(ROOT / "guesses.txt") as f:
    GUESSES = [
        w.strip()
        for w in f
    ]

PATTERN_TABLE = np.load(
    ROOT / "pattern_table.npy"
)