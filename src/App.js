import React, {Component} from 'react'
import './App.css';
import Modal from 'react-responsive-modal';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Brush,
} from 'recharts';
import Draggable from 'react-draggable';

const box = {
    padding: 20,
    height: 100,
    width: 100,
    backgroundColor: 'red',
    cursor: 'move',
    position: 'absolute',
    zIndex: 1000,
}


class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            Date: {
                Year: "",
                Month: "",
                Day: "",
            },
            SENSORData: "",
            ModalFlag: false,
            GraphData: "",

        };

    }

    // モーダルウィンドウのハンドラー
    onOpenModal = (e) => {
        const key = e.currentTarget.dataset.distance;
        let data;
        this.state.SENSORData.map(function (item, index) {
            if (index == key) {
                data = item.data;
            }
        });
        this.setState({ModalFlag: true, GraphData: data});
    };

    onCloseModal = () => {
        this.setState({ModalFlag: false});
    };



    componentWillMount() {
        const date = new Date();
        const year = date.getFullYear();	// 年
        const month = date.getMonth() + 1;	// 月
        const day = date.getDate();	// 日
        this.setState({
            Date: {
                Year: year,
                Month: month,
                Day: day,
            },
        });

    }

    componentDidUpdate(prevProps, prevState) {
        if (this.state.Date !== prevState.Date) {
            const json = require('./test.json');
            this.setState({...this.state, SENSORData: json.data});
        }
    }

    //月変更のハンドラー
    DateSelect(e) {
        const data = e.currentTarget.innerText.replace(/\s+/g, "")
            .replace("月", "");
        this.setState({
            ...this.state,
            Date: {...this.state.Date, Month: data}
        });
    }

    //年変更のハンドラー
    ChangeYear(e) {
        const data = e.currentTarget;
        const ClassName = data.className;
        if (ClassName === "ago_year") {
            this.setState({
                ...this.state,
                Date: {...this.state.Date, Year: this.state.Date.Year - 1}
            });
        } else {
            this.setState({
                ...this.state,
                Date: {...this.state.Date, Year: this.state.Date.Year + 1}
            });
        }
    }


    render() {

        return (
            <div>
                <Draggable>
                <header>
                    <h1><img src={`${process.env.PUBLIC_URL}/syokubutsu_nae.png`}/>Plant Factory</h1>
                </header>
                </Draggable>
                <div className={"title"}>
                    <h1>日時の選択</h1>
                    <div className="month_select">
                        <><p className="ago_year" onClick={(e) => this.ChangeYear(e)}>◀︎</p></>
                        <div className="display_year">
                            <p className="content_display">{this.state.Date.Year}</p><p
                            className="content_display_tag">年</p>
                        </div>
                        {(() => {
                            const items = [];
                            for (let i = 1; i < 13; i++) {
                                if (this.state.Date.Month == i) {
                                    items.push(
                                        <div className="display_month_check" onClick={(e) => this.DateSelect(e)}>
                                            <p className="content_display">{i}</p><p
                                            className="content_display_tag">月</p>
                                        </div>
                                    )
                                } else {
                                    items.push(
                                        <div className="display_month" onClick={(e) => this.DateSelect(e)}>
                                            <p className="content_display">{i}</p><p
                                            className="content_display_tag">月</p>
                                        </div>
                                    )
                                }

                            }
                            return <>{items}</>;
                        })()}
                        <><p className="next_year" onClick={(e) => this.ChangeYear(e)}>▶︎</p></>
                    </div>
                </div>
                <div className="step1">
                    {this.state.SENSORData ? <img src={`${process.env.PUBLIC_URL}/0167.png`}/> : <></>}

                </div>

                {/*↓データを表示する部分*/}
                <div className={"title"}>
                    {(() => {
                        if (this.state.SENSORData !== "") {
                            return <h1>データの選択</h1>
                        }
                    })()}
                    {(() => {
                        let items = [];
                        if (this.state.SENSORData !== "") {
                            this.state.SENSORData.map((item, index) => (
                                items.push(
                                    <div className="display_senser_data" data-distance={index}
                                         onClick={(e) => this.onOpenModal(e)}>
                                        <div className="date">
                                            <p>日時:</p>
                                            <p>{item.date}</p>
                                        </div>
                                        <div className="machinename">
                                            <p>端末名:</p>
                                            <p>{item.device}</p>
                                        </div>
                                        <div className="place">
                                            <p>場所:</p>
                                            <p>{item.place}</p>
                                        </div>
                                    </div>
                                )
                            ))
                        }
                        return (
                            <div className="data_table">
                                {items}
                            </div>
                        );

                    })()}

                    {/*モーダル処理の部分*/}
                    <Modal open={this.state.ModalFlag} onClose={e => this.onCloseModal(e)} closeIconSize={0} center>
                        <LineChart
                            width={500}
                            height={300}
                            data={this.state.GraphData}
                            margin={{
                                top: 5, right: 30, left: 20, bottom: 5,
                            }}
                        >
                            <CartesianGrid strokeDasharray="3 3"/>
                            <XAxis dataKey="name"/>
                            <YAxis/>
                            <Tooltip/>
                            <Legend/>
                            <Line type="monotone" dataKey="pv" stroke="#8884d8" activeDot={{r: 8}}/>
                            <Line type="monotone" dataKey="uv" stroke="#82ca9d"/>
                            <Brush/>
                        </LineChart>
                    </Modal>

                </div>


            </div>
        )
    }
}

export default App;
// export default App;
