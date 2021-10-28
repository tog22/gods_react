import React from 'react';

/************************
** THIS.PROPS.SQUARE = **

occupant: 'angel',
side: 1,
divinely_inspired: true,
is_selected: ''

************************/

class Square extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			test_in_child_state: 'initial value'
		};
		// Bind this in all methods
		// ...but there are no methods using this to bind
	}
	
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
			default:
				break;
		}
		switch (square.occupant) {
			case 'mortal':
				occupant_class += ' mortal ';
				break;
			case 'angel':
				occupant_class += ' angel ';
				break;
			default:
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
			default:
				break;
		}
		
		return (
			<td
			className={square_class} 
			onClick={() => {
				this.props.on_click(this.props.row_index, this.props.column_index, this);
			}}>
				<div className={occupant_class}>
					{occupant_image}
					<p>Parent's state: {this.props.test_in_parent_state}</p>
					<p>Child's state: {this.state.test_in_child_state}</p>
				</div>
		    </td>
		);
	}
	
}

export default Square;