# from app.solver.scorer import get_feedback

# print(get_feedback("apple", "apple"))
# print(get_feedback("crane", "slate"))
# print(get_feedback("allay", "apple"))

# from app.solver.scorer import get_feedback
# from app.solver.strategy import filter_possible_answers

# possible = [
#     "apple",
#     "angle",
#     "amble"
# ]

# feedback = get_feedback("apple", "angle")

# filtered = filter_possible_answers(
#     possible,
#     "apple",
#     feedback
# )

# print("Feedback:", feedback)
# print("Filtered:", filtered)

# import numpy as np

# table = np.load("app/data/pattern_table.npy")

# print("Shape:", table.shape)
# print("Min:", table.min())
# print("Max:", table.max())
# print(table[:5, :5])

from app.solver.encoding import encode_feedback
from app.solver.simulator import get_feedback
from app.solver.pattern_table import get_pattern_id

guess= "mouth"
answer = "abide"

print(encode_feedback(get_feedback(guess, answer)))
print(get_pattern_id(guess, answer))