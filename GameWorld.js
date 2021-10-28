import React from 'react';
import update from 'immutability-helper';
// ↑ Doco at https://github.com/kolodny/immutability-helper 
//	 		 (or https://reactjs.org/docs/update.html)


import Square from './Square';

import './GameWorld.css';

class GameWorld extends React.Component {

	
	render() {
		const rows_array = this.state.otw.map(this.render_row);
		
		return (
			<table className="board">
				<tbody>
					{rows_array}
				</tbody>
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
								square={this.state.otw[row_index][column_index]}
								on_click={this.square_click}
								is_selected={this.state.otw[row_index][column_index].is_selected}
								test_in_parent_state={this.state.test_in_parent_state}
							/>
						)
					}
				)} 
			</tr>
		);
	}
	
	square_click (row, col, that_square = 'default') {
		
		//console.log(this)
		console.log('square clicked')
		let clicked = this.state.otw[row][col];
		
		let is_something_selected;
		if (this.state.selected_row !== null && this.state.selected_col !== null) {
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
			
			if (clicked.side !== this.state.current_player) {
				alert ("It's not this player's turn");
				// ↑ Ideally make the turn indicator flash red instead
				return;
			}
			
			// Check if the relevant thing (a mortal/angel, or divine inspiration) hasn't moved yet
			
			if (clicked.divinely_inspired && this.state.inspiration_has_moved) {
				return;
			}
			
			if (!clicked.divinely_inspired && this.state.piece_has_moved) {
				return;
			}
			
			// If conditions above are met, make the selection
			
			this.setState({selected_row: row})
			this.setState({selected_col: col})
			
			// this.state.otw[row][col].is_selected = 'selected ';
			this.setState({
				otw: update(
					this.state.otw, {0: {1: {is_selected: {$set: 'selected '}}}}
				)
			});
			// this.setState({
			// 	otw: update(
			// 		this.state.otw, {[row]: {[col]: {is_selected: {$set: 'selected '}}}}
			// 	)
			// });
			console.log(this)
			console.log(this.state.otw)
			//this.setState({otw: update(this.state.otw, {$push: [4]})});
			
			this.setState({test_in_parent_state: 'sel'})
			
			that_square.setState({test_in_child_state: 'sel'})
			
		// 2) MOVING SELECTED PIECES
		}// else if (is_something_selected) { 
		
		/********************
		*********************
		**				   **
		**   VUE VERSION   **
		**				   **
			
		} else if (is_something_selected) {
			
			let to_row = row;
			let to_col = col;
			let from_row = this.state.selected_row;
			let from_col = this.state.selected_col;
			
			// Re-clicking the selected piece, to unselect it
			
			if (to_row === from_row && to_col === from_col) {
				this.state.unselect_piece();
			}
			
			
			// Check if it's a valid move
			// ...starting by calculating the deltas for later use
			if (to_row > from_row) {
				this.state.row_delta = to_row - from_row;
			} else {
				this.state.row_delta = from_row - to_row;
			}
			if (to_col > from_col) {
				this.state.col_delta = to_col - from_col;
			} else {
				this.state.col_delta = from_col - to_col;
			}
			
			let selected = this.state.otw[from_row][from_col];
			
			if (this.state.is_valid_move(this.state.selected_row, this.state.selected_col, to_row, to_col)) {
				
				// Make the move
				
				if (selected.divinely_inspired) {
					this.state.inspiration_has_moved = true;
					selected.divinely_inspired = false;
					clicked.divinely_inspired = true;
				} else if (selected.occupant === 'mortal') {
					this.state.piece_has_moved = true;
					selected.occupant = null;
					selected.side = null;
					clicked.occupant = 'mortal';
					clicked.side = this.state.current_player;
				} else if (selected.occupant === 'angel'){
					this.state.piece_has_moved = true;
					selected.occupant = null;
					selected.side = null;
					clicked.occupant = 'angel';
					clicked.side = this.state.current_player;
				}
				
				this.state.unselect_piece();
				
				// End turn/switch to the other player if appropriate
				
				if (this.state.piece_has_moved && this.state.inspiration_has_moved) {
					this.state.end_turn();
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
			test_in_parent_state: 'initial value',
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
		
		// Bind this in all methods
		this.render_row = this.render_row.bind(this);
		this.square_click = this.square_click.bind(this);
	}
}

export default GameWorld;
