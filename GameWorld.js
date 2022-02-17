import React from 'react';
import update from 'immutability-helper';
// ↑ Doco at https://github.com/kolodny/immutability-helper 
//	 		 (or https://reactjs.org/docs/update.html)


import Square from './Square';

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
								
								is_selected={this.state.otw
									[row_index][column_index].is_selected}
								
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
			
			this.setState({
				otw: update(
					this.state.otw, {[row]: {[col]: {is_selected: {$set: 'selected '}}}}
				)
			});
			
		// 2) MOVING SELECTED PIECES
		} else if (is_something_selected) {
			
			let to_row = row;
			let to_col = col;
			let from_row = this.state.selected_row;
			let from_col = this.state.selected_col;
			
			// Re-clicking the selected piece, to unselect it
			
			if (to_row === from_row && to_col === from_col) {
				this.unselect_piece();
			}
			
			
			/***************************
			**						  **
			** ⚠️ Problem with React: **
			
				setState() doesn't update instantly, you need to make the syntax even *more* complicated with: 
			
			https://reactjs.org/docs/faq-state.html#what-is-the-difference-between-passing-an-object-or-a-function-in-setstate
			
			**						  **
			***************************/
			
			// Check if it's a valid move
			// ...starting by calculating the deltas for later use
			if (to_row > from_row) {
				this.setState({row_delta: to_row - from_row})
			} else {
				this.setState({row_delta: from_row - to_row})
			}
			if (to_col > from_col) {
				this.setState({col_delta: to_col - from_col})
			} else {
				this.setState({col_delta: from_col - to_col})
			}
			
			let selected = this.state.otw[from_row][from_col];
			
			if (this.is_valid_move(this.state.selected_row, this.state.selected_col, to_row, to_col)) {
				
				// Make the move
				
				if (selected.divinely_inspired) {
					
					this.inspiration_has_moved = true
					selected.divinely_inspired = false
					clicked.divinely_inspired = true
					this.check_for_trap(this.selected_row, this.selected_col)
					this.check_for_reaching_heartland(clicked)
					
				} else if (selected.occupant === 'mortal') {
					
					this.piece_has_moved = true
					selected.occupant = null
					selected.side = null
					clicked.occupant = 'mortal'
					clicked.side = this.current_player
					this.check_for_trap(to_row, to_col)
					
				} else if (selected.occupant === 'angel'){
					this.piece_has_moved = true
					selected.occupant = null
					selected.side = null
					clicked.occupant = 'angel'
					clicked.side = this.current_player
					this.check_for_trap(to_row, to_col)
					
				}
				this.unselect_piece()
				
				// End turn/switch to the other player if appropriate
				
				if (this.piece_has_moved && this.inspiration_has_moved) {
					this.end_turn();
				}
			
			} else {
				alert("Not a valid move");
			}
			
		}
	}
	
	/***************************
	****************************
	**						  **
	**	 IS THE MOVE VALID?   **
	**						  **
	****************************
	***************************/
	is_valid_move(from_row, from_col, to_row, to_col) {
		
		let selected = this.state.otw[from_row][from_col];
		let dest = this.state.otw[to_row][to_col];
		
		// Don't count clicks on the same square, to make logic simpler
		
		if ((from_row === to_row) && (from_col === to_col)) {
			return false;
		}
		
		//  1) MOVING MORTALS & ANGELS
		
		if (!selected.divinely_inspired && !this.state.piece_has_moved) {
			if (dest.occupant !== null) {
				return false;
			}
			if (selected.occupant === 'mortal') {
				if (this.is_adjacent()) {
					return true;
				}
				if (this.is_adjacent_diagonally()) {
					return true;
				}
				if (this.is_hop(from_row, from_col, to_row, to_col)) {
					return true;
				} 
			} else if (selected.occupant === 'angel') {
				if (this.is_along_clear_straight_line(from_row, from_col, to_row, to_col)) {
					return true;
				}
				if (this.is_hop(from_row, from_col, to_row, to_col)) {
					return true;
				} 
			}
		}
		
		//  2) MOVING DIVINE INSPIRATION
		
		if (selected.divinely_inspired && !this.state.inspiration_has_moved) {
			if (!dest.side === this.state.current_player) {
				return false;
			}
			if (this.is_along_an_inspiration_path(from_row, from_col, to_row, to_col)) {
				return true;
			}
		}
	}
	
	
	is_adjacent_diagonally() {
		if (this.state.row_delta === 1 && this.state.col_delta === 1) {
			return true;
		} else {
			return false;
		}
	}
	
	
	is_adjacent() {
		if (this.state.row_delta === 1 && this.state.col_delta === 0) {
			return true;
		} else if (this.state.row_delta === 0 && this.state.col_delta === 1) {
			return true;
		} else {
			return false;
		}
	}
	
	
	is_along_clear_straight_line(from_row, from_col, to_row, to_col) {
		// Check if it's not a straight line
		if (this.state.row_delta !== 0 && this.state.col_delta !== 0) {
			return false;
		}
		// Check for pieces in between
		if (this.state.row_delta > 0) {
			let lowest_intermediate;
			let highest_intermediate;
			if (to_row > (from_row+1)) {
				highest_intermediate = to_row - 1;
				lowest_intermediate = from_row + 1;
			} else if (from_row > (to_row+1)) {
				highest_intermediate = from_row - 1;
				lowest_intermediate = to_row + 1;
			} else { // It's just moving 1 square
				return true;
			}
			for (
				let intermediate = lowest_intermediate;
				intermediate <= highest_intermediate;
				intermediate++
			) {
				let intermediate_square = this.state.otw[intermediate][from_col];
				if (intermediate_square.occupant) {
					return false;
				}
			}
			return true;
		} else if (this.state.col_delta > 0) {
			let lowest_intermediate;
			let highest_intermediate;
			if (to_col > (from_col+1)) {
				highest_intermediate = to_col - 1;
				lowest_intermediate = from_col + 1;
			} else if (from_col > (to_col+1)) {
				highest_intermediate = from_col - 1;
				lowest_intermediate = to_col + 1;
			} else { // It's just moving 1 square
				return true;
			}
			for (
				let intermediate = lowest_intermediate;
				intermediate <= highest_intermediate;
				intermediate++
			) {
				let intermediate_square = this.state.otw[from_row][intermediate];
				if (intermediate_square.occupant) {
					return false;
				}
			}
			return true;
		}
	}
	
	
	is_along_solid_straight_line(from_row, from_col, to_row, to_col) {
		// Check if it's not a straight line
		if (this.state.row_delta !== 0 && this.state.col_delta !== 0) {
			return false;
		}
		// Check for pieces in between
		if (this.state.row_delta > 0) {
			let lowest_intermediate;
			let highest_intermediate;
			if (to_row > (from_row+1)) {
				highest_intermediate = to_row - 1;
				lowest_intermediate = from_row + 1;
			} else if (from_row > (to_row+1)) {
				highest_intermediate = from_row - 1;
				lowest_intermediate = to_row + 1;
			} else { // It's just moving 1 square
				return true;
			}
			for (
				let intermediate = lowest_intermediate;
				intermediate <= highest_intermediate;
				intermediate++
			) {
				let intermediate_square = this.state.otw[intermediate][from_col];
				if (!intermediate_square.occupant) {
					return false;
				}
			}
			return true;
		} else if (this.state.col_delta > 0) {
			let lowest_intermediate;
			let highest_intermediate;
			if (to_col > (from_col+1)) {
				highest_intermediate = to_col - 1;
				lowest_intermediate = from_col + 1;
			} else if (from_col > (to_col+1)) {
				highest_intermediate = from_col - 1;
				lowest_intermediate = to_col + 1;
			} else { // It's just moving 1 square
				return true;
			}
			for (
				let intermediate = lowest_intermediate;
				intermediate <= highest_intermediate;
				intermediate++
			) {
				let intermediate_square = this.state.otw[from_row][intermediate];
				if (!intermediate_square.occupant) {
					return false;
				}
			}
			return true;
		}
	}
	
	
	
	is_along_an_inspiration_path(from_row, from_col, to_row, to_col) {
		
		let path_trace_tracker = {}
		
		// Create tracker for visited places
		
		let visited = []
		for (var row = 0; row <= 8; row++) {
			visited[row] = []
			for (var col = 0; col <= 5; col++) {
				visited[row][col] = false
			}
		}
		path_trace_tracker.visited = visited
		
		// Start from to row and trace all possible courses, until we're either done or have reached divine inspiration
		
		path_trace_tracker.reached_inspiration = false
		this.trace_adjacent_cells(to_row, to_col, path_trace_tracker)
		
		if (path_trace_tracker.reached_inspiration) {
			return true
		} else {
			return false
		}
		
	}
	
	
	
	trace_adjacent_cells(row, col, path_trace_tracker) {
		
		let adjacent_cells = this.get_adjacent_cells(row, col)
		
		// l('____ TRACE ADJACENT TO '+row+'-'+col)
		
		for (var adj of adjacent_cells) {
			
			// l('__IN LOOP FOR '+row+'-'+col)
			// l('checking '+adj.row+'-'+adj.col)
			if (path_trace_tracker.visited[adj.row][adj.col]) { // f1
				// l('…visited')
				continue
			}
			path_trace_tracker.visited[adj.row][adj.col] = true
			
			if (this.state.otw[adj.row][adj.col].side !== this.state.current_player) { // f2
				// l('…empty')
				continue
			}
			
			if (this.state.otw[adj.row][adj.col].divinely_inspired) {
				path_trace_tracker.reached_inspiration = true
				// l('••• DIVINE INSPIRATION FOUND •••')
			}
			
			// Otherwise…
			// l('…neither visited nor empty, so starting subtrace')
			this.trace_adjacent_cells(adj.row, adj.col, path_trace_tracker)
			
		}
	}
	
	
	
	get_adjacent_cells(row, col) {
		let adjacent_cells = []
		
		if (row !== 0) {
			adjacent_cells.push(
				{
					row: row - 1,
					col: col
				}
			)
		}
		
		if (row !== 8) {
			adjacent_cells.push(
				{
					row: row + 1,
					col: col
				}
			)
		}
		
		if (col !== 0) {
			adjacent_cells.push(
				{
					row: row,
					col: col - 1
				}
			)
		}
		
		if (col !== 5) {
			adjacent_cells.push(
				{
					row: row,
					col: col + 1
				}
			)
		}
					
		return adjacent_cells
		
	}
	
	
	
	is_hop(from_row, from_col, to_row, to_col) {
		
		if (this.state.row_delta > 0 && this.state.col_delta > 0) {
			return false
		}
		
		var intermediate_piece
		var is_along_column
		var col_direction
		
		if (this.state.row_delta === 2) {
			var intermediate_row
			if (to_row > from_row) {
				intermediate_row = to_row - 1;
			} else {
				intermediate_row = from_row - 1;
			}
			intermediate_piece = this.state.otw[intermediate_row][from_col]
		} else if (this.state.col_delta === 2) {
			is_along_column = true
			var intermediate_col
			if (to_col > from_col) {
				intermediate_col = to_col - 1;
				col_direction = 'down'
			} else {
				intermediate_col = from_col - 1;
				col_direction = 'up'
			}
			intermediate_piece = this.state.otw[from_row][intermediate_col]
		} else {
			return false
		}
		
		if (intermediate_piece.divinely_inspired) {
			return false;
		}
		
		switch (this.state.current_player) {
			
			case 1:
				if (is_along_column && col_direction === 'up') {
					return false
				}
				if (intermediate_piece.side === 2) {
					return true
				} else {
					return false
				}
			case 2:
			default:
				if (is_along_column && col_direction === 'down') {
					return false
				}
				if (intermediate_piece.side === 1) {
					return true
				} else {
					return false
				}
		}
		
	}
	
	
	/***************************
	****************************
	**						  **
	**	   POST-TURN STUFF    **
	**						  **
	****************************
	***************************/
	unselect_piece() {
		// Deselect the square moved from
		this.setState({
			otw: update(
				this.state.otw, {[this.state.selected_row]: {[this.state.selected_col]: {is_selected: {$set: ''}}}}
			)
		});
		
		// AFTER all other deselection steps, unset the world's selected_row/col state
		
		this.setState({selected_row: null})
		this.setState({selected_col: null})
		
		// Reset the deltas for neatness
		this.setState({row_delta: null})
		this.setState({col_delta: null})
	}
	
	
	check_for_reaching_heartland(moved_to) {
		if (moved_to.heartland === undefined) {
			return
		}
		switch (moved_to.heartland) {
			case 1:
				if (this.state.current_player === 2) {
					this.setState({winner: 2})
					this.setState({win_type: 'Heartland reached'})
					// bus.$emit('Winner', {
					// 	winner: 2,
					// 	win_type: 'Heartland reached'
					// })
				}
				break
			case 2:
			default:
				if (this.state.current_player === 1) {
					this.setState({winner: 1})
					this.setState({win_type: 'Heartland reached'})
					// bus.$emit('Winner', {
					// 	winner: 1,
					// 	win_type: 'Heartland reached'
					// })
				}
				break
		}
	}
	
	
	check_for_trap(to_row, to_col) {
		
		let squares_to_check_for_trap = this.squares_to_check_for_trap(to_row, to_col)
		
		let self = this.state.current_player
		var opponent
		if (self === 1) {
			opponent = 2
		} else {
			opponent = 1
		}
		for (var square of squares_to_check_for_trap) {
			if (this.state.otw[square.adj_row][square.adj_col].side === opponent) {
				
				if (this.state.otw[square.next_row][square.next_col].side === self && !this.state.otw[square.next_row][square.next_col].divinely_inspired) {
					
					this.setState({
						otw: update(
							this.state.otw, {[square.adj_row]: {[square.adj_col]: {occupant: {$set: null}}}}
						)
					});
					this.setState({
						otw: update(
							this.state.otw, {[square.adj_row]: {[square.adj_col]: {side: {$set: null}}}}
						)
					});
					
					if (this.state.otw[square.adj_row][square.adj_col].divinely_inspired) {
						this.setState({winner: this.state.current_player})
						this.setState({win_type: 'Faith extinguished'})
						this.setState({
							otw: update(
								this.state.otw, {[square.adj_row]: {[square.adj_col]: {divinely_inspired: {$set: false}}}}
							)
						});
						// bus.$emit('Winner', {
						// 	winner: this.state.current_player,
						// 	win_type: 'Faith extinguished'
						// })
					}
					
				}
				
			}
		}
		
	}
	
	
	squares_to_check_for_trap(row, col) {
		
		var at_top = false
		var at_bottom = false
		var at_left = false
		var at_right = false
		
		if (row === 0 || row === 1) {
			at_top = true
		}
		if (row === 8 || row === 7) {
			at_bottom = true
		}
		if (col === 5 || col === 4) {
			at_right = true
		}
		if (col === 0 || col  === 1) {
			at_left = true
		}
		
		let squares_to_check_for_trap = []
		// TODO - match new rules
		if (!at_top) {
			squares_to_check_for_trap.push({
				direction: 'row',
				adj_row: row - 1,
				adj_col: col,
				next_row: row - 2,
				next_col: col
			})
		}
		if (!at_bottom) {
			squares_to_check_for_trap.push({
				direction: 'row',
				adj_row: row + 1,
				adj_col: col,
				next_row: row +2, 
				next_col: col
			})
		}
		if (!at_left) {
			squares_to_check_for_trap.push({
				direction: 'col',
				adj_row: row,
				adj_col: col - 1,
				next_row: row,
				next_col: col - 2
			})
		}
		if (!at_right) {
			squares_to_check_for_trap.push({
				direction: 'col',
				adj_row: row,
				adj_col: col + 1,
				next_row: row,
				next_col: col + 2
			})
		}
		
		return squares_to_check_for_trap
		
	}
	
	
	
	end_turn() {
		
		switch (this.state.current_player) {
			case 1:
				this.setState({current_player: 2})
				break;
			case 2:
			default:
				this.setState({current_player: 1})
				break;
		}
		l(this.state.turn)
		this.setState({turn: this.state.turn + 1})
		this.setState({piece_has_moved: false})
		this.setState({inspiration_has_moved: false})
		if (this.state.selected_row && this.state.selected_col) {
			this.setState({
			otw: update(
				this.state.otw, {[this.state.selected_row]: {[this.state.selected_col]: {is_selected: {$set: ''}}}}
			)
		});
		}
		this.setState({selected_row: null})
		this.setState({selected_col: null})
		this.setState({row_delta: null})
		this.setState({col_delta: null})
		// Pulse animation is added in computed property current_player_image 
		/// (Adding it with jQuery here doesn't work as it then gets overridden there)
		
		if (this.state.online_game) {
			
			var server_request = new XMLHttpRequest()
			
			let get_url = 'http://gods.philosofiles.com/sync/?action=update&game='+this.state.online.game_id+'&pw='+this.state.online.game_pass+'&turn='+this.state.turn+'&current_player='+this.state.current_player+'&winner='+this.state.winner+'&win_type='+this.state.win_type+'&sotw='+JSON.stringify(this.state.otw);
			
			server_request.open("GET", get_url, false) // false = synchronous
			server_request.send()
			
		}
	}
	
	
	
	waiting_online() {
		
		if (!this.state.online_game) {
			return false
		}
		
		if (
			(this.state.current_player === 1 && this.state.online.side === 2)
			||
			(this.state.current_player === 2 && this.state.online.side === 1)
		) {
			return true
		} else {
			return false
		}
		
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
		
		// Bind this in all methods
		this.render_row = this.render_row.bind(this)
		this.square_click = this.square_click.bind(this)
		this.is_valid_move = this.is_valid_move.bind(this)
		this.is_adjacent_diagonally = this.is_adjacent_diagonally.bind(this)
		this.is_adjacent = this.is_adjacent.bind(this)
		this.is_along_clear_straight_line = this.is_along_clear_straight_line.bind(this)
		this.is_along_solid_straight_line = this.is_along_solid_straight_line.bind(this)
		this.is_along_an_inspiration_path = this.is_along_an_inspiration_path.bind(this)
		this.trace_adjacent_cells = this.trace_adjacent_cells.bind(this)
		this.get_adjacent_cells = this.get_adjacent_cells.bind(this)
		this.is_hop = this.is_hop.bind(this)
		this.unselect_piece = this.unselect_piece.bind(this)
		this.check_for_reaching_heartland = this.check_for_reaching_heartland.bind(this)
		this.check_for_trap = this.check_for_trap.bind(this)
		this.squares_to_check_for_trap = this.squares_to_check_for_trap.bind(this)
		this.end_turn = this.end_turn.bind(this)
		this.waiting_online = this.waiting_online.bind(this)
	}
}

export default GameWorld;

let l = function (to_log) { 
	console.log(to_log) 
}
let lo = l