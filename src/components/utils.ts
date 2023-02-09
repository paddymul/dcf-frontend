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


//@ts-ignore
export const requestDf = async(url, setCallBack) => {
  const retPromise =
    fetch('http://localhost:8080/static-json/base-df.json')
      .then(async (response) => {
	console.log(response)
	const tableDf = await response.json()
	setCallBack(tableDf)
      });
  return retPromise
}
