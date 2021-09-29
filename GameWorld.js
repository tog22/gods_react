import React from 'react';

import Square from './Square';

import './GameWorld.css';


class GameWorld extends React.Component {

	render() {
		const rows_array = this.state.otw.map(this.render_row);
		
		return (
			<table className="board">
				{rows_array}
			</table>
		);
	}
	
	render_row(row, row_index, array) {
		const key_name = "row_"+row_index.toString();
		return (
			<tr key={key_name}>
				{array[row_index].map(
					(column, column_index) => {
						const square_key_name = "square_"+row_index.toString()+"_"+column_index.toString();
						return(
							<Square 
								key={square_key_name} 
								row_index={row_index} 
								column_index={column_index} 
								contents={this.state.otw[row_index][column_index]}
								on_click={this.square_click}
							/>
						)
					}
				)} 
			</tr>
		);
	}
	
	square_click (row, col) {
		
		let clicked = this.state.otw[row][col];

		
		/********************
		*********************
		**				   **
		**   VUE VERSION   **
		**				   **
		
		let clicked = this.state.otw[row][col];
		
		let is_something_selected;
		if (this.selected_row !== null && this.selected_col !== null) {
			is_something_selected = true;
		} else {
			is_something_selected = false;
		}
		
		// 1) SELECTING PIECES
		if (!is_something_selected) {
			
			// Check if the active side has a piece to select
			
			if (clicked.occupant === null) {
				return;
			}
			
			if (clicked.side !== this.current_player) {
				alert ("It's not this player's turn");
				// ↑ Ideally make the turn indicator flash red instead
				return;
			}
			
			// Check if the relevant thing (a mortal/angel, or divine inspiration) hasn't moved yet
			
			if (clicked.divinely_inspired && this.inspiration_has_moved) {
				return;
			}
			
			if (!clicked.divinely_inspired && this.piece_has_moved) {
				return;
			}
			
			// If conditions above are met, make the selection
			
			this.selected_row = row;
			this.selected_col = col;
			
			this.state.otw[row][col].is_selected = 'selected ';
			
		// 2) MOVING SELECTED PIECES
		} else if (is_something_selected) {
			
			let to_row = row;
			let to_col = col;
			let from_row = this.selected_row;
			let from_col = this.selected_col;
			
			// Re-clicking the selected piece, to unselect it
			
			if (to_row === from_row && to_col === from_col) {
				this.unselect_piece();
			}
			
			
			// Check if it's a valid move
			// ...starting by calculating the deltas for later use
			if (to_row > from_row) {
				this.row_delta = to_row - from_row;
			} else {
				this.row_delta = from_row - to_row;
			}
			if (to_col > from_col) {
				this.col_delta = to_col - from_col;
			} else {
				this.col_delta = from_col - to_col;
			}
			
			let selected = this.state.otw[from_row][from_col];
			
			if (this.is_valid_move(this.selected_row, this.selected_col, to_row, to_col)) {
				
				// Make the move
				
				if (selected.divinely_inspired) {
					this.inspiration_has_moved = true;
					selected.divinely_inspired = false;
					clicked.divinely_inspired = true;
				} else if (selected.occupant === 'mortal') {
					this.piece_has_moved = true;
					selected.occupant = null;
					selected.side = null;
					clicked.occupant = 'mortal';
					clicked.side = this.current_player;
				} else if (selected.occupant === 'angel'){
					this.piece_has_moved = true;
					selected.occupant = null;
					selected.side = null;
					clicked.occupant = 'angel';
					clicked.side = this.current_player;
				}
				
				this.unselect_piece();
				
				// End turn/switch to the other player if appropriate
				
				if (this.piece_has_moved && this.inspiration_has_moved) {
					this.end_turn();
				}
			
			} else {
				alert("Not a valid move");
			}
			
		}
		*/
	}
	
	constructor(props) {
		super(props);
		this.state = {
			current_player: 1,
			piece_has_moved: false,
			inspiration_has_moved: false,
			selected_row: null,
			selected_col: null,
			row_delta: null,
			col_delta: null,
			otw: [
				[
					{
						occupant: null,
						side: null,
						divinely_inspired: false,
						is_selected: ''
					},
					{
						occupant: 'angel',
						side: 1,
						divinely_inspired: false,
						is_selected: ''
					},
					{
						occupant: 'angel',
						side: 1,
						divinely_inspired: true,
						is_selected: ''
					},
					{
						occupant: 'angel',
						side: 1,
						divinely_inspired: false,
						is_selected: ''
					},
					{
						occupant: 'angel',
						side: 1,
						divinely_inspired: false,
						is_selected: ''
					},
					{
						occupant: null,
						side: null,
						divinely_inspired: false,
						is_selected: ''
					},
				],
				[
					{
						occupant: null,
						side: null,
						divinely_inspired: false,
						is_selected: ''
					},
					{
						occupant: 'mortal',
						side: 1,
						divinely_inspired: false,
						is_selected: ''
					},
					{
						occupant: 'mortal',
						side: 1,
						divinely_inspired: false,
						is_selected: ''
					},
					{
						occupant: 'mortal',
						side: 1,
						divinely_inspired: false,
						is_selected: ''
					},
					{
						occupant: 'mortal',
						side: 1,
						divinely_inspired: false,
						is_selected: ''
					},
					{
						occupant: null,
						side: null,
						divinely_inspired: false,
						is_selected: ''
					},
				],
				[
					{
						occupant: null,
						side: null,
						divinely_inspired: false,
						is_selected: ''
					},
					{
						occupant: null,
						side: null,
						divinely_inspired: false,
						is_selected: ''
					},
					{
						occupant: null,
						side: null,
						divinely_inspired: false,
						is_selected: ''
					},
					{
						occupant: null,
						side: null,
						divinely_inspired: false,
						is_selected: ''
					},
					{
						occupant: null,
						side: null,
						divinely_inspired: false,
						is_selected: ''
					},
					{
						occupant: null,
						side: null,
						divinely_inspired: false,
						is_selected: ''
					},
				],
				[
					{
						occupant: null,
						side: null,
						divinely_inspired: false,
						is_selected: ''
					},
					{
						occupant: null,
						side: null,
						divinely_inspired: false,
						is_selected: ''
					},
					{
						occupant: null,
						side: null,
						divinely_inspired: false,
						is_selected: ''
					},
					{
						occupant: null,
						side: null,
						divinely_inspired: false,
						is_selected: ''
					},
					{
						occupant: null,
						side: null,
						divinely_inspired: false,
						is_selected: ''
					},
					{
						occupant: null,
						side: null,
						divinely_inspired: false,
						is_selected: ''
					},
				],
				[
					{
						occupant: null,
						side: null,
						divinely_inspired: false,
						is_selected: ''
					},
					{
						occupant: null,
						side: null,
						divinely_inspired: false,
						is_selected: ''
					},
					{
						occupant: null,
						side: null,
						divinely_inspired: false,
						is_selected: ''
					},
					{
						occupant: null,
						side: null,
						divinely_inspired: false,
						is_selected: ''
					},
					{
						occupant: null,
						side: null,
						divinely_inspired: false,
						is_selected: ''
					},
					{
						occupant: null,
						side: null,
						divinely_inspired: false,
						is_selected: ''
					},
				],
				[
					{
						occupant: null,
						side: null,
						divinely_inspired: false,
						is_selected: ''
					},
					{
						occupant: null,
						side: null,
						divinely_inspired: false,
						is_selected: ''
					},
					{
						occupant: null,
						side: null,
						divinely_inspired: false,
						is_selected: ''
					},
					{
						occupant: null,
						side: null,
						divinely_inspired: false,
						is_selected: ''
					},
					{
						occupant: null,
						side: null,
						divinely_inspired: false,
						is_selected: ''
					},
					{
						occupant: null,
						side: null,
						divinely_inspired: false,
						is_selected: ''
					},
				],
				[
					{
						occupant: null,
						side: null,
						divinely_inspired: false,
						is_selected: ''
					},
					{
						occupant: null,
						side: null,
						divinely_inspired: false,
						is_selected: ''
					},
					{
						occupant: null,
						side: null,
						divinely_inspired: false,
						is_selected: ''
					},
					{
						occupant: null,
						side: null,
						divinely_inspired: false,
						is_selected: ''
					},
					{
						occupant: null,
						side: null,
						divinely_inspired: false,
						is_selected: ''
					},
					{
						occupant: null,
						side: null,
						divinely_inspired: false,
						is_selected: ''
					},
				],
				[
					{
						occupant: null,
						side: null,
						divinely_inspired: false,
						is_selected: ''
					},
					{
						occupant: 'mortal',
						side: 2,
						divinely_inspired: false,
						is_selected: ''
					},
					{
						occupant: 'mortal',
						side: 2,
						divinely_inspired: false,
						is_selected: ''
					},
					{
						occupant: 'mortal',
						side: 2,
						divinely_inspired: false,
						is_selected: ''
					},
					{
						occupant: 'mortal',
						side: 2,
						divinely_inspired: false,
						is_selected: ''
					},
					{
						occupant: null,
						side: null,
						divinely_inspired: false,
						is_selected: ''
					},
				],
				[
					{
						occupant: null,
						side: null,
						divinely_inspired: false,
						is_selected: ''
					},
					{
						occupant: 'angel',
						side: 2,
						divinely_inspired: false,
						is_selected: ''
					},
					{
						occupant: 'angel',
						side: 2,
						divinely_inspired: false,
						is_selected: ''
					},
					{
						occupant: 'angel',
						side: 2,
						divinely_inspired: true,
						is_selected: ''
					},
					{
						occupant: 'angel',
						side: 2,
						divinely_inspired: false,
						is_selected: ''
					},
					{
						occupant: null,
						side: null,
						divinely_inspired: false,
						is_selected: ''
					}
				]
			]
		};
		
		this.render_row = this.render_row.bind(this);
		
	}
}

export default GameWorld;
