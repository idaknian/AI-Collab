from fastapi import APIRouter
import time

from app.api.schemas import (
    HumanGuessRequest,
    StartGameRequest
)

from app.game.game_manager import (
    create_game,
    get_game,
    submit_human_guess,
    play_ai_turn,
    game_to_dict
)
from app.solver.simulator import play_game


router = APIRouter()

@router.post("/simulate")
def simulate_game():
    result = play_game()
    return result

@router.get("/simulate-many")
def simulate_many(n: int = 100):
    # results = []

    wins = 0
    total_attempts = 0

    start = time.perf_counter()
    for _ in range(n):
        game = play_game()
        # results.append(game)

        if game["result"] == "win":
            wins += 1
            total_attempts += game["attempts"]

    avg_attempts = total_attempts / wins if wins > 0 else None

    print(f"Time elapsed: {time.perf_counter() - start}")

    return {
        "games_played": n,
        "wins": wins,
        "win_rate": wins / n,
        "average_attempts": avg_attempts
    }

@router.post("/game/start")
def start_game(
    request: StartGameRequest
):

    return create_game(
        request.username,
        request.mode
    )

@router.get("/game/{game_id}")
def get_game_state(game_id: str):

    game = get_game(game_id)

    return game_to_dict(game)

@router.post("/game/human-move")
def human_move(
    request: HumanGuessRequest
):

    return submit_human_guess(
        request.game_id,
        request.guess.lower()
    )

@router.post("/game/ai-move/{game_id}")
def ai_move(game_id: str):

    return play_ai_turn(game_id)

@router.post("/game/play-turn")
def play_turn(
    request: HumanGuessRequest
):

    human_result = submit_human_guess(
        request.game_id,
        request.guess.lower()
    )

    game = get_game(
        request.game_id
    )

    if game.winner:
        return {
            "human": human_result,
            "ai": None,
            "winner": game.winner
        }

    ai_result = play_ai_turn(
        request.game_id
    )

    return {
        "human": human_result,
        "ai": ai_result,
        "winner": game.winner
    }