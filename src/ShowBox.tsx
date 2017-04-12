// tslint:disable
import * as React from 'react';
import { parseRegExp } from './lib/regexp';
import {drawAST} from './lib/tree';
import * as d3 from 'd3';

interface ShowBoxState {
    AST: AST | null;
    msg: string;
};

class ShowBox extends React.Component<null, ShowBoxState> {
    state = {
        AST: null,
        msg: ''
    };
    render() {
        return (
            <div style={{textAlign: 'left'}}>
                <input type="text" placeholder="regexp" onChange={
                    (e) => {
                        let exp = e.target.value;
                        try {
                            d3.selectAll('svg.g').remove();
                            let st = parseRegExp(exp);
                            this.setState({ AST: st, msg: '' });
                            drawAST(st);
                        } catch (e) {
                            this.setState({ msg: e.toString() });
                        }
                    }
                } style={{width: '100%', lineHeight: '2em', height: '2em'}} />
                <br/>
                <p>{this.state.msg? this.state.msg: null}</p>
                <br/>
                <h3>Syntax Tree of the Regular Expression</h3>
                <svg width="1000" height="1000" viewBox="0 0 1000 1000" style={{width: '100%'}}/>
                <br />
                <h4>JSON</h4>
                <pre>
                    <code>
                        {
                            this.state.msg? null: JSON.stringify(this.state.AST, null, 2)
                        }
                    </code>
                </pre>
            </div>
        );
    }
}

export default ShowBox;
