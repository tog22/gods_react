import React from 'react';

import Square from './Square';

import './GameWorld.css';


class GameWorld extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			of_the_world: [
				[null,['angel','red',null],['angel','red','divinely inspired'],['angel','red',null],['angel','red',null],null],
				[null,['mortal','red',null],['mortal','red',null],['mortal','red',null],['mortal','red',null],null],
				[null,null,null,null,null,null],
				[null,null,null,null,null,null],
				[null,null,null,null,null,null],
				[null,null,null,null,null,null],
				[null,null,null,null,null,null],
				[null,['mortal','black',null],['mortal','black',null],['mortal','black',null],['mortal','black',null],null],
				[null,['angel','black',null],['angel','black',null],['angel','black','divinely inspired'],['angel','black',null],null]
			]
		};
		this.render_row = this.render_row.bind(this);
		
		
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
								contents={this.state.of_the_world[row_index][column_index]}
								on_click={
									() => {this.square_click();}
								}
							/>
						)
					}
				)} 
			</tr>
		);
	}
	
	square_click (row_index, column_index) {
		alert(row_index);
	}
	
	render() {
		const rows_array = this.state.of_the_world.map(this.render_row);
		
		return (
			<table className="board">
				{rows_array}
			</table>
		);
		
		/*
		let board_representation = [];
		
		for (var row = 0; row < this.state.of_the_world.length; row++) {
			let row_to_add = [];
			for (var column = 0; column < this.state.of_the_world[row].length; column++) {
				let key_name = "square_"+row.toString()+"_"+column.toString();
				row_to_add.push(<div key={key_name}>{row},{column}</div>);
			}
			board_representation.push(row_to_add);
		}
		
		return board_representation;
		*/
	}
}

export default GameWorld;
