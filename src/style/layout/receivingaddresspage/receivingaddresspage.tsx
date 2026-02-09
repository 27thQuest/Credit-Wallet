import "../../index.scss";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { isAddress } from "ethers";
import CoinSend from "./coinsend";


const SendPage: React.FC = () => {
  const navigate = useNavigate();

  // Address state
  const [address, setAddress] = useState("");

  // Simple address validation (you can replace with real logic later)
  const isValidAddress = address.startsWith("0x") && isAddress(address);




  type Asset = {
    symbol: string;
    name: string;
    amount: string;
  };

  type SendState = {
    token: Asset;
    amount: string;
  };


  const [showSendPopup, setShowSendPopup] = useState(false);

  const location = useLocation();
  const state = location.state as SendState | null;

  // simple guard
  const token = state?.token ?? null;
  const sendAmount = state?.amount ?? "";

  const hasRequiredInfo =
    token !== null && sendAmount !== "" && Number(sendAmount) > 0;


  // FINAL button logic:  valid address
  const canSend = isValidAddress;

  console.log("Currency:", token);
  console.log("Amount:", sendAmount);


  return (
    <>
      <div className="body">
        <section className="page home-page">
          {/* HEADER */}
          <div className="heading">
            <button className="backbutton" onClick={() => navigate("/send")}>
              <img src="src/assets/image/icon_back.png" />
            </button>
            <div>Receiving address</div>
            <div></div>
          </div>

          {/* ADDRESS INPUT */}
          <textarea
            className="input-address"
            value={address}
            onChange={(e) => {
              setAddress(e.target.value);
              e.target.style.height = "auto";
              e.target.style.height = e.target.scrollHeight + "px";
            }}
            placeholder="Enter receiving address"
            rows={1}
          />



          {/* VALIDATION MESSAGE */}
          <div className={`address-validation ${isValidAddress ? "is-valid" : "is-invalid"
            }`}>
            {address === ""
              ? ""
              : isValidAddress
                ? "✓ Address is valid"
                : "X Address invalid"}
          </div>

          {/* SEND BUTTON */}
          <button
            className={`next-btn ${!canSend ? "disabled" : ""}`}
            disabled={!canSend || !hasRequiredInfo}
            onClick={() => setShowSendPopup(true)}
          >
            <div>SEND</div>
          </button>

        </section>
      </div>

      {token && (
        <CoinSend
          open={showSendPopup}
          onClose={() => setShowSendPopup(false)}
          token={token}
          amount={sendAmount}
          toAddress={address}
        />
      )}

    </>
  );
};

export default SendPage;
