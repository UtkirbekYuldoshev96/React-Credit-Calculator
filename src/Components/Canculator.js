import React, {Component} from 'react';
import InputRange from "react-input-range";
import Modal from "react-responsive-modal";

import "./Canculator.css";
import "react-input-range/lib/css/index.css";

class Conculator extends Component {
    constructor(props){
        super(props);
        this.state = {
            amount: 500000,
            years: 36,
            rate: 15,
            payment: 17333,
            totalSum: 623976,
            totalPercents: 123976,
            amountStep: 50000,
            yearsStep: 12,
            amountPayment: 623976,
            overpayment: 123976,
            open: false
        };
    }

    handleInputChange (e) {
        this.setState({[e.target.name]: e.target.value })
        this.calculate();
    }

    calculate(name, value) {
        let { amount, years, rate } = this.state;
        let totalPercents = 0;
        let totalSum = 0;
        // Расчет ежемесячного платежа
        rate = rate / 1200;
        const paymentValue = Math.round(
            (amount * rate) / (1 - Math.pow(1 + rate, -years))
        );
        // Расчет суммы займа при изменении платежа
        if (name === "payment") {
            const summa = Math.round(
                (value * (1 - Math.pow(1 + rate, -years))) / rate
            );
            if (summa > 5000000) {
                this.setState({ amount: 5000000, payment: 173327 });
            } else {
                this.setState({ amount: summa });
            }
            if (summa < 300000) {
                this.setState({ amount: 300000, payment: paymentValue });
            }
        }
        totalSum = paymentValue * years;
        totalPercents = totalSum - amount;
        this.setState({
            payment: paymentValue,
            totalSum: totalSum,
            totalPercents: totalPercents
        });
    }

    handRangeChange(name, value) {
        name === "rate"
            ?   this.setState({[name]: value.toFixed(1)}) : this.setState({[name]: value})

        if (name === "amount") {
            let resultSet = 0;
            if  (value < 1000000){
                resultSet = 50000;
            }else resultSet = 100000;
            this.setState({amountStep: resultSet});
        }
        if (name === "years"){
            let yearsStep = 0;
            if (value < 12){
                yearsStep = 1;
            }else if (value <= 18){
                yearsStep = 6;
            }else if (value >= 24){
                yearsStep = 12;
            }
            this.setState({yearsStep: yearsStep});
        }
    }
    createTable = () => {
        const {years, payment, amount, rate} = this.state;
        let tableValue = [];
        let mainAmount = amount;
        let amountStyle = 100;
        let mainPaymentStyle = 0;

        for (let i = 1; i <= years; i++){
            amountStyle = amountStyle - 100 / years;
            mainAmount += 100 / years;
            let paymentPercent = (mainAmount * (rate / 100) * 30 ) / 365;
            let mainPayment = payment - mainPaymentStyle;
            mainAmount = mainAmount - mainPayment;

            tableValue.push(
                <tr>
                    <td>{i}</td>
                    <td>{Math.round(payment)}</td>
                    <td>
                        <div className="table_percent" style={{width: `${amountStyle}%`}}>
                            {Math.round(paymentPercent)}
                        </div>
                    </td>
                    <td>
                        <div className="table_main__payment" style={{ width: `${mainPaymentStyle}%` }}>
                            {Math.round(mainPayment)}
                        </div>
                    </td>
                    <td>
                        <div className="table_main__amount" style={{ width: `${amountStyle}%` }}>
                            {mainAmount > 0 ? Math.round(mainAmount) : 0}
                        </div>
                    </td>
                </tr>
            );
        }
        return tableValue;
    };

    onOpenModal = () => {
        this.setState({ open: true });
    };

    onCloseModal = () => {
        this.setState({open: false});
    };


    render() {
        const {
            amountStep,
            yearsStep,
            open,
            totalSum,
            totalPercents,
            amount
        } = this.state;
        return (
            <>
                <form action="#" className="conculator">
                    <div className="left-slider">
                        <div className="form-left">
                            <label>So'mma</label>
                            <input type="number" className="input-left"  value={this.state.amount}
                                   lang="en-150" name="amount" onChange={e => this.handleInputChange(e)}
                            />
                        </div>
                        <InputRange
                            step={amountStep}
                            formatLabel={value => `${value.toLocaleString()} ₽`}
                            maxValue={5000000}
                            minValue={3000000}
                            value={this.state.amount}
                            onChange={value => this.handRangeChange("amount", value)}
                        />
                        <div className="form-left">
                            <label className="label-left">Kredit muddati:</label>
                            <input type="number" className="input-left"
                                   name="years" value={this.state.year}
                                   onChange={e => this.handleInputChange(e)}
                            />
                        </div>
                        <InputRange
                            step={yearsStep}
                            formatLabel={value => `${value.toLocaleString()}m.`}
                            maxValue={240}
                            minValue={1}
                            value={this.state.years}
                            classNames="input_range"
                            onChange={value => this.handRangeChange("years", value)}
                        />
                        <div className="form-left">
                            <label className="label-left">Stavka foizi:</label>
                            <input type="text" className="input-left"
                                   name="rate" value={this.state.rate} onChange={e => this.handRangeChange(e)}
                            />
                        </div>
                        <InputRange
                            step={0.1}
                            formatLabel={value => `${value.toLocaleString()}% yiliga`}
                            maxValue={60}
                            minValue={6}
                            value={this.state.rate}
                            classNames="input-range"
                            onChange={value => this.handRangeChange("rate", value)}
                        />
                        <div className="form-left">
                            <p className="type-payment">To'lov turi:</p>
                            <select className="select-payment">
                                <option>annuitet</option>
                                <option>faqat qiziqish</option>
                            </select>
                        </div>
                    </div>
                    <div className="right-slider">
                        <div className="form-left">
                            <label className="label-left">Oylik to'lov:</label>
                            <input type="text" className="input-left"
                                   name="name" value={this.state.payment.toLocaleString()}
                                   onChange={e => this.handRangeChange(e)}
                            />
                        </div>
                        <InputRange
                            step={1000}
                            formatLabel={value => `${value.toLocaleString()} ₽`}
                            maxValue={200000}
                            minValue={0}
                            value={this.state.payment}
                            classNames="input_range"
                            onChange={value => this.handRangeChange("payment", value)}
                        />
                        <div className="form-left">
                            <label className="label-left">To'lanishi kerak bo'lgan miqdor:</label>
                            <input type="text"
                                   className="input-left"
                                   readOnly
                                   value={this.state.totalSum.toLocaleString() + " ₽"}
                                   name="totalSum"
                            />
                        </div>
                        <div className="form-left">
                            <label className="label-left">Foizlarni ortiqcha to'lash:</label>
                            <input
                                type="text"
                                className="input-left"
                                readOnly
                                value={this.state.totalPercents.toLocaleString() + " ₽"}
                                name={totalPercents}
                            />
                        </div>

                        <input type="button" onClick={this.onOpenModal} value="To'lov jadvali"/>
                        <input type="button" value="Arizangizni yuboring"/>

                        <Modal open={open} onClose={this.onCloseModal} center>
                            <table>
                                <option>To'lov jadvali</option>
                                <tbody>
                                <tr>
                                    <th>#</th>
                                    <th>To'lov ₽</th>
                                    <th>Foizlarni to'lash, ₽</th>
                                    <th>Asosiy to'lov, ₽</th>
                                    <th>Qolgan asosiy qarz, ₽</th>
                                </tr>
                                {this.createTable()}
                                <tr className="table__total">
                                    <td>
                                        <strong>Итого:</strong>
                                    </td>
                                    <td>
                                        <strong>{totalSum}</strong>
                                    </td>
                                    <td>
                                        <strong>{totalPercents}</strong>
                                    </td>
                                    <td>
                                        <strong>{amount}</strong>
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                        </Modal>
                    </div>
                </form>
            </>
        );
    }
}

export default Conculator;