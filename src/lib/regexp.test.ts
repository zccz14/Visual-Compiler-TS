import { parseRegExp } from './regexp';
var test0 = require('../test/0.json');
var test1 = require('../test/1.json');

it('turn regexp "1(0|1)*101" to AST', () => {
    let st = parseRegExp('1(0|1)*101');
    let res = JSON.stringify(st);
    let ans = JSON.stringify(test0);
    if (res !== ans) {
        throw new Error();
    }
});

it('turn regexp "(1)*" to AST', () => {
    let st = parseRegExp('(1)*');
    let ans = JSON.stringify(test1);
    let res = JSON.stringify(st);
    if (res !== ans) {
        throw new Error();
    }
})