import _ from 'lodash';
//@ts-ignore
export const propsToCommands = (fullProps) => {
 const filledCommands = _.flatten(_.keys(fullProps).map((columnName) => {
  	const colState = fullProps[columnName]
	if(colState.drop === false && colState.fillna === false){
	    return []
	}
	const commands: any[] = [];
	if (colState.drop) {
	   commands.push([{symbol:'drop'}, columnName])
	}
	if (colState.fillNa) {
	      commands.push([{symbol:'fillna'}, columnName, colState.fillNaVal])
	}
	return commands
  }))
 return filledCommands
}
