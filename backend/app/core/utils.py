str_to_int = {
    "gray": 0,
    "green": 1,
    "yellow": 2
}

int_to_str = {
    0: "gray",
    1: "green",
    2: "yellow"
}


def feedback_str_to_int(feedback: list[str]) -> list[int]:
    return [str_to_int[f] for f in feedback]

def feedback_int_to_str(feedback: list[int]) -> list[str]:
    return [int_to_str[f] for f in feedback]