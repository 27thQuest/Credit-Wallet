import "../../index.scss";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import tokenImages, { DEFAULT_TOKEN_IMAGE } from "../assets/tokenlogos";
import CurrencyNames from "./CurrencyNames";

// Asset type matches CurrencyNames
type Asset = {
  symbol: string;
  name: string;
  amount: string;
  logo?: string;
};

const SendPage: React.FC = () => {

  const navigate = useNavigate();
  const [amount, setAmount] = useState("");
  const appendDigit = (d: string) => {
    setAmount((prev) => {
      // allow only digits or "."
      if (d === ".") {
        if (prev.includes(".")) return prev; // only one decimal
        // if empty, start with 0.
        return prev === "" ? "0." : prev + ".";
      }

      // digit 0-9
      if (!/^\d$/.test(d)) return prev;

      // avoid leading zeros like "00" (but allow "0." case)
      if (prev === "0" && d !== "0" && !prev.includes(".")) return d;
      if (prev === "0" && d === "0" && !prev.includes(".")) return prev;

      return prev + d;
    });
  };

  const backspace = () => {
    setAmount((prev) => prev.slice(0, -1));
  };


  // open/close dropdown
  const [isCurrencyOpen, setIsCurrencyOpen] = useState(false);

  // selected token (starts empty)
  const [selectedToken, setSelectedToken] = useState<Asset | null>(null);

  //Button Logic
  const numericAmount = Number(amount);
  const availableAmount = Number(selectedToken?.amount ?? 0);

  const isValidAmount =
    selectedToken !== null &&
    amount !== "" &&
    numericAmount > 0 &&
    numericAmount <= availableAmount;

  return (
    <>
      <div className="body">
        <section className="page home-page">
          {/* HEADER */}
          <div className="heading">
            <button className="backbutton" onClick={() => navigate("/")}>
              <img src="src/assets/image/icon_back.png" />
            </button>
            <div>Send Amount</div>
            <div></div>
          </div>

          {/* TOKEN DROPDOWN BUTTON */}
          <button
            type="button"
            className="currency-btn"
            onClick={() => setIsCurrencyOpen(true)}
          >
            {/* Token Logo */}
            <img
              className="token-logo"
              src={
                tokenImages[(selectedToken?.symbol ?? "null").toUpperCase()] ??
                DEFAULT_TOKEN_IMAGE
              }
              alt={selectedToken?.symbol ?? "token"}
            />

            {/* Token Name */}
            <div className="name">
              {selectedToken?.symbol ?? "Select Token"}
            </div>

            <img src="src/assets/image/dropdown_icon.svg" />
          </button>


          {/* AMOUNT DISPLAY */}
          <input
            className="send-amount"
            value={amount}
            placeholder="0"
            inputMode="decimal"
            onChange={(e) => {
              let val = e.target.value;

              // allow only digits + one decimal point
              if (/^\d*\.?\d*$/.test(val)) {
                setAmount(val);
              }
            }}
          />

          <div className="balance">
            {selectedToken?.amount ?? "0"}{" "}
            {selectedToken?.symbol ?? ""} available • Max
          </div>

          {/* NUMPAD */}
          <div className="numpad">
            <button className="num" onClick={() => appendDigit("1")}>1</button>
            <button className="num" onClick={() => appendDigit("2")}>2</button>
            <button className="num" onClick={() => appendDigit("3")}>3</button>
            <button className="num" onClick={() => appendDigit("4")}>4</button>
            <button className="num" onClick={() => appendDigit("5")}>5</button>
            <button className="num" onClick={() => appendDigit("6")}>6</button>
            <button className="num" onClick={() => appendDigit("7")}>7</button>
            <button className="num" onClick={() => appendDigit("8")}>8</button>
            <button className="num" onClick={() => appendDigit("9")}>9</button>
            {/* your UI shows "•" but we should append "." */}
            <button className="num" onClick={() => appendDigit(".")}>•</button>
            <button className="num" onClick={() => appendDigit("0")}>0</button>
            <button className="num" onClick={backspace}>←</button>
          </div>

          {/* NEXT BUTTON */}
          <button
            className={`next-btn ${!isValidAmount ? "disabled" : ""}`}
            onClick={() => navigate("/receivingaddress", {
              state: {
                token: selectedToken, 
                amount,
              },
            })}
            disabled={!isValidAmount}
          >
            <div>Next</div>
          </button>
        </section>
      </div>

      {/* ONLY CurrencyNames DROPDOWN */}
      {isCurrencyOpen && (
        <CurrencyNames
          onClose={() => setIsCurrencyOpen(false)}
          onSelectToken={(token) => {
            setSelectedToken(token); // store full token object
            setIsCurrencyOpen(false);
          }}
        />
      )}
    </>
  );
};

export default SendPage;
