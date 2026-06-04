def encode_feedback(feedback):
    value = 0

    for digit in feedback:
        value = value * 3 + digit

    return value
