import './style/index.scss';
import React, { useState } from 'react';
import { TokenSelector } from './component/TokenSelector';
import { ResultTokenSelector } from './component/ResultTokenSelector';
import balanceData from './balance.json';
import valueData from './value.json';


type Currency = keyof typeof balanceData.balances;




const Main: React.FC = () => {
  const [isTokenSelectorOpen, setIsTokenSelectorOpen] = useState(false);
  const [isReceiveTokenSelectorOpen, setIsReceiveTokenSelectorOpen] = useState(false);

  const toggleTokenSelectorOpen = () => setIsTokenSelectorOpen(!isTokenSelectorOpen);
  const toggleReceiveTokenSelectorOpen = () => setIsReceiveTokenSelectorOpen(!isReceiveTokenSelectorOpen);

  const [payCurrency, setPayCurrency] = useState<Currency>('CTC');
  const [receiveCurrency, setReceiveCurrency] = useState<Currency>('CTC');

  const payBalance = balanceData.balances[payCurrency];
  const receiveBalance = balanceData.balances[receiveCurrency];

  const [payAmount, setPayAmount] = useState("");


  const payCurrencyValue = valueData.values[payCurrency];
  const receiveCurrencyValue = valueData.values[receiveCurrency];

  const receiveAmount = Number(payAmount) * (Number(payCurrencyValue) / Number(receiveCurrencyValue));




  return (
    <>
      <div>
        <section className="page swap-page">
          <div className="box-content">
            <div className="heading">
              <h2>Currency Swap</h2>
            </div>

            <div className="swap-dashboard">
              <div className="swap-item active">
                <div className="title">
                  <h3>You pay</h3>
                </div>

                <div className="amount-input">
                  <div className="input">
                    <input type="number"
                      placeholder='0'
                      value={payAmount}
                      onChange={(e) => setPayAmount(e.target.value)} />
                  </div>

                  <button type="button" className="currency-label" onClick={toggleTokenSelectorOpen}>
                    <div className={`token ${String(payCurrency)}`} data-token-size="28"></div>
                    <strong className="name">{String(payCurrency)}</strong>
                  </button>
                </div>

                <div className="amount item-flex">
                  <div className="lt">
                  </div>
                  <div className="rt">
                    <div className="balance">
                      <span>Balance: {payBalance}</span>
                    </div>
                  </div>
                </div>
              </div>

              <button type="button" className="mark" onClick={() => { }}>
                <i className="blind">swap</i>
              </button>

              <div className="swap-item">
                <div className="title">
                  <h3>You receive</h3>
                </div>

                <div className="amount-input">
                  <div className="input">
                    <span className="amount-value"> {receiveAmount || 0} </span>
                  </div>
                  <button type="button" className="currency-label select" onClick={toggleReceiveTokenSelectorOpen}>
                    <div className={`token ${String(receiveCurrency)}`} data-token-size="28"></div>
                    <strong className="name">{String(receiveCurrency)}</strong>
                  </button>
                </div>

                <div className="item-flex amount">
                  <div className="rt">
                    <div className="balance">
                      <span>Current Balance: {receiveBalance}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="button-wrap">
                <button type="button" className="normal" disabled={true} onClick={() => { }}>
                  Swap
                </button>

                {/* THIS IS THE FIRST STEP, WHERE YOU MUST FIGURE OUT HOW TO MAKE THIS BUTTON WORK
                  SO THAT MEANS THAT YOU NEED TO 
                  1. FIGURE OUT THE FORMULA FOR THE CURRENCY SWAPPING
                  2. FIGURE OUT HOW TO MAKE THE BUTTON FUNCTIONAL 
                  3. IF ENTERED > BALANCE ==> SWAP BUTTON SHOULD BE DISABLED*/}

              </div>

            </div>
          </div>
        </section>
      </div>

      {isTokenSelectorOpen && (
        <TokenSelector
          onClose={() => setIsTokenSelectorOpen(false)}
          onSelectToken={token => {
            setPayCurrency(token);
            setIsTokenSelectorOpen(false);
          }} />
      )}

      {isReceiveTokenSelectorOpen && (
        <ResultTokenSelector
          onClose={() => setIsReceiveTokenSelectorOpen(false)}
          onSelectReceiveToken={receiveToken => {
            setReceiveCurrency(receiveToken);
            setIsReceiveTokenSelectorOpen(false);
          }} />
      )}
    </>
  );
}

export { Main as default };
