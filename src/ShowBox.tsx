// tslint:disable
import * as React from 'react';
import { parseRegExp } from './lib/regexp';

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
                            let st = parseRegExp(exp);
                            this.setState({ AST: st, msg: '' });
                        } catch (e) {
                            this.setState({ msg: e.toString() });
                        }
                    }
                } />
                <br />
                <pre>
                    <code>
                        {
                            this.state.msg? this.state.msg: JSON.stringify(this.state.AST, null, 2)
                        }
                    </code>
                </pre>
            </div>
        );
    }
}

export default ShowBox;
