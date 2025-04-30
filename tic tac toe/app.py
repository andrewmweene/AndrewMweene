""""
This tic tac toe is using the  inheritance implementation by Kylie YIng
The routing and the UI by Stanford Sakhile 

"""
from flask import Flask, render_template, jsonify, request
from tic_tac_toe import TicTacToe
from player import HumanPlayer, RandomComputerPlayer, SmartComputerPlayer

app = Flask(__name__)

# Initialize the game variables
game = TicTacToe()
x_player = SmartComputerPlayer('X')
o_player = HumanPlayer('O')

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/move', methods=['POST'])
def make_move():
    data = request.json
    square, letter = data['square'], data['letter']
    success = game.make_move(square, letter)

    if not success:
        return jsonify({'error': 'Invalid move'}), 400

    if game.current_winner:
        return jsonify({'winner': letter})

    if not game.empty_squares():
        return jsonify({'result': 'tie'})

    # Computer's turn (Smart Player)
    square = x_player.get_move(game)
    game.make_move(square, 'X')

    if game.current_winner:
        return jsonify({'winner': 'X'})
    
    return jsonify({'board': game.board, 'current_player': 'O' if letter == 'X' else 'X'})

@app.route('/restart', methods=['POST'])
def restart_game():
    global game
    game = TicTacToe()
    return jsonify({'board': game.board})

if __name__ == '__main__':
    app.run(debug=True)