import React from 'react';


class Square extends React.Component {
	test_return() {
		return 'className="divinely_inspired"';
	}
	
	render() {
		let td_class_names = '';
		let div_class_names = '';
		let div_contents = '';
		
		if (this.props.contents) {
			div_class_names += this.props.contents[0];
			if (this.props.contents[1] === 'red') {
				div_class_names += ' baboon ';
				div_contents = '🐒';
			} else if (this.props.contents[1] === 'black') {
				div_class_names += ' hippo ';
				div_contents = '🦛';
			}
			if (this.props.contents[2] === 'divinely inspired') {
				td_class_names += ' divinely_inspired ';
			}
		}
		
		return (
			<td className={td_class_names} onClick={() => {
				// let test = this.props.row_index;
				// alert ("test var to pass="+test);
				this.props.on_click(this.props.row_index, this.props.column_index);
			}}>
				<div className={div_class_names}>
					{div_contents}
				</div>
		    </td>
		);
	}
	
}

export default Square;