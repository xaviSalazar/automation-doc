import {utils} from 'xlsx';
/* generate an array of column objects */
export const make_cols = refstr => {
	let o = [], C = utils.decode_range(refstr).e.c + 1;
	for(var i = 0; i < C; ++i) o[i] = {name: utils.encode_col(i), key:i}
	return o;
};