import React from 'react';

/************************
** THIS.PROPS.SQUARE = **

occupant: 'angel',
side: 1,
divinely_inspired: true,
is_selected: ''

************************/

class Square extends React.Component {
	test_return() {
		return 'className="divinely_inspired"';
	}
	
	render() {
		const square = this.props.square;
		
		let square_class = '';
		// ↓
		if (square.divinely_inspired) {
			square_class += ' divinely_inspired ';
		}
		if (square.is_selected) {
			square_class += ' selected ';
		}
		
		let occupant_class = '';
		// ↓
		switch (square.side) {
			case 1:
				occupant_class = ' baboon ';
				break;
			case 2:
				occupant_class = ' hippo ';
				break;
		}
		switch (square.occupant) {
			case 'mortal':
				occupant_class += ' mortal ';
				break;
			case 'angel':
				occupant_class += ' angel ';
				break;
		}
		
		let occupant_image = '';
		// ↓
		switch (square.side) {
			case 1:
				occupant_image = '🐒';
				break;
			case 2:
				occupant_image = '🦛';
				break;
		}
		
		return (
			<td className={square_class} onClick={() => {
				// let test = this.props.row_index;
				// alert ("test var to pass="+test);
				this.props.on_click(this.props.row_index, this.props.column_index);
			}}>
				<div className={occupant_class}>
					{occupant_image}
				</div>
		    </td>
		);
	}
	
}

export default Square;