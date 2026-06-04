from app.solver.encoding import encode_feedback

def get_feedback(guess: str, target: str) -> list[str]:
    guess = guess.lower()
    target = target.lower()

    feedback = [0] * len(guess)
    target_letter_count = {}

    for letter in target:
        target_letter_count[letter] = target_letter_count.get(letter, 0) + 1

    for i in range(len(guess)):
        if guess[i] == target[i]:
            feedback[i] = 1
            target_letter_count[guess[i]] -= 1

    for i in range(len(guess)):
        if feedback[i] == 0:
            letter = guess[i]
            if letter in target_letter_count and target_letter_count[letter] > 0:
                feedback[i] = 2
                target_letter_count[letter] -= 1

    return feedback

def get_pattern_id(
    guess: str,
    target: str
) -> int:

    feedback = get_feedback(guess, target)

    return encode_feedback(feedback)

# print(get_feedback("allay", "apple"))