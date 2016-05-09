import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Dispatcher } from 'flux';
import EventEmitter from 'eventemitter2';

//Dispather
let dispatcher = new Dispatcher();
console.log(dispatcher);


/**
 * Action
 */
class ItemAction {
    constructor(dispatcher){
        this.dispatcher = dispatcher;
    }
    /**
     * Dispatcherにデータを渡す
     * @param data
     */
    sendData(data){
        this.dispatcher.dispatch({
            actionType: 'sendData',
            data: data
        });
    }
}

/**
 * Store
 * EventEmitterを継承
 */
class ItemStore extends EventEmitter {
    constructor(dispatcher){
        super();
        this.state = {};
        /**
         * dispatcherにデータが渡ったら
         * stateが更新される
         */
        dispatcher.register((payload) => {
            if (payload.actionType === 'sendData') {
                this.state.data = payload.data;
                /**
                 * Emitterのチェンジイベントが発行される
                 */
                this.emit('change');
            }
        });
    }
    getState(){
        return this.state;
    }
    //storeのチェンジイベントが実行されたらcallbackを実行
    addChangeListener(callback){
        this.on('change', callback);
    }
}

const propTypes = {
    data: React.PropTypes.string
};

const defaultProps = {
    data: 'ここに入力した内容がはいります'
};

/**
 * Display
 * Formの値を表示する
 */

class Display extends React.Component {
    render(){
        let { data } = this.props;
        return (
           <div>{data}</div>
        );
    }
}

Display.propTypes = propTypes;
Display.defaultProps = defaultProps;

/**
 * Form
 * Actionでデータを渡すのみ
 */
class Form extends React.Component {
    constructor(props){
        super(props);
        this.onClickButton = this.onClickButton.bind(this);
        this.action = new ItemAction(dispatcher);
    }
    onClickButton(e){
        e.preventDefault();
        let value = ReactDOM.findDOMNode(this.refs.input).value;
        this.action.sendData(value);
    }
    render(){
        return (
            <form action="">
                <input type="text" ref="input" />
                <button type="submit" ref="button" onClick={this.onClickButton}>submit</button>
            </form>
        );
    }
}

/**
 * App
 * Storeで変更を監視してstateの値を取得
 */
class App extends React.Component {
    constructor(props){
        super(props);
        this.store = new ItemStore(dispatcher);
        this.state = {
            message: 'ここに入力した結果が入ります'
        };
    }
    componentDidMount() {
        this.store.addChangeListener(() => {
            this.setState(this.store.getState());
        });
    }
    render(){
        return (
            <div>
                <Form />
                <Display message={this.state.message} />
            </div>
        );
    }
}

ReactDOM.render(<App />, document.getElementById('app'));