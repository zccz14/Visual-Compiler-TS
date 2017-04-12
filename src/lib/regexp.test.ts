import {parseRegExp} from './regexp';

it('turn regexp "1(0|1)*101" to AST', () => {
    let st = parseRegExp('1(0|1)*101');
    let ans = `{"symbol":"E","next":[{"symbol":"1"},{"symbol":"B","next":[{"symbol":"A","next":[{"symbol":"E","next":[{"symbol":"("},{"symbol":"E","next":[{"symbol":"0"},{"symbol":"B","next":[{"symbol":"A","next":[{"symbol":"|"},{"symbol":"E","next":[{"symbol":"1"},{"symbol":"B","next":[]}]}]},{"symbol":"B","next":[]}]}]},{"symbol":")"}]}]},{"symbol":"B","next":[{"symbol":"A","next":[{"symbol":"*"}]},{"symbol":"B","next":[{"symbol":"A","next":[{"symbol":"E","next":[{"symbol":"1"},{"symbol":"B","next":[{"symbol":"A","next":[{"symbol":"E","next":[{"symbol":"0"},{"symbol":"B","next":[{"symbol":"A","next":[{"symbol":"E","next":[{"symbol":"1"},{"symbol":"B","next":[]}]}]},{"symbol":"B","next":[]}]}]}]},{"symbol":"B","next":[]}]}]}]},{"symbol":"B","next":[]}]}]}]}]}`;
    if (JSON.stringify(st) !== ans) {
        throw Error();
    }
});
