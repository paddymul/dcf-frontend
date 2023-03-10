import _ from 'lodash';

export const sym = (symbolName:string) => {
  return {'symbol':symbolName}
}
export const bakedCommands = [
  [sym("dropcol"), sym('df'), 'col1'],
  [sym("fillna"), sym('df'), 'col2', 5],
  [sym("resample"), sym('df'), 'month', 'daily']
]
