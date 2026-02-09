import '../../index.scss';
import { useState } from "react";
import WalletBalance from "./WalletBalance";
import { useNavigate } from "react-router-dom";





const Main: React.FC = () => {
  const navigate = useNavigate(); 


  //DROPDOWN THANG
  const [open, setOpen] = useState(false);

  function openSheet() {
    setOpen(true);
    console.log("bruh");
  }

  function closeSheet() {
    setOpen(false);
  }



  //WEBSITE THINg
  const [copied, setCopied] = useState(false);
  const textToCopy = "0xc294d6bdB0a7F3c88F56Bea4cE3Ca7ee1fE370D2";


  const handleCopy = async () => {
    await navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 1000);
  };



  return (
    <>

      <div>


        <section className="page home-page">

          <div className='heading-nav'>
            <div className='tab-bar'>
              <button className='tab-bar-option'>
                <div><img className="tab-bar-img" src="src\assets\image\tab.svg"></img></div>
                <div className='tab-bar-selected-option'>Assets</div>
              </button>
              <button className='tab-bar-option'>
                <div><img className="tab-bar-img" src="src\assets\image\tab-1.svg"></img></div>
                <div>Transaction</div>
              </button>
              <button className='tab-bar-option'>
                <div><img className="tab-bar-img" src="src\assets\image\tab-2.svg"></img></div>
                <div>More</div>
              </button>
            </div>
          </div>

          <div className="box-content">
            <header className="heading">
              <div className='address-copy'>
                <button className="wallets" onClick={openSheet}>
                  <img src="src\assets\image\graphic.svg"></img>
                  <p>Address 1</p>
                  <img src="src\assets\image\dropdown_icon.svg"></img>
                  <div>|</div>
                </button>

                <div className='copybutton'>
                  <button onClick={handleCopy}>
                    <img src="src\assets\image\icon_square2_stacked.svg"></img>
                    {copied ? <text className='copy-message'>"Wallet Address Copied!"</text> : ""}
                  </button>
                </div>

              </div>

              <div className='scan-alarm'>
                <button><img src="src\assets\image\icon_notification_on.svg"></img></button>
                <button><img src="src\assets\image\icon_horizline_viewfinder.svg"></img></button>
              </div>
            </header>

            <div className="body">
              <div className="balance-button" >
                <div className='total-ctc-balance'>Total CTC Balance <img src="src\assets\image\icon_infomark_circle.svg"></img></div>
                <div className='balancedisplay'>0 CTC</div>
                <div className='balancebuttondiv'>
                  <button className='balancebutton'   onClick={() => navigate("/send")} >Send</button>
                  <button className='balancebutton'>Receive</button>

                </div>
              </div>

              <div className='banner-div'>
                <div className='banner'>
                  <div className='banner-text'>
                    <div className='bannertext1'>Introducing the Credit Wallet!</div>
                    <div className='bannertext2'>Learn to use your new crypto <br></br>wallet.</div>
                  </div>
                  <img className="banner-image" src="src\assets\image\banner.svg"></img>
                </div>
                <img className="banner-pagination" src="src\assets\image\pagenation.svg"></img>
              </div>

              <div className='tab-absolute'>
                <button className='selected-tab-option'>Crypto</button>
                <button className='unselected-tab-option'>NFT</button>
                <button className='unselected-tab-option'>Approvals</button>
              </div>
              <div></div>

              <div className='list-empty'>
                <WalletBalance />
              </div>

              <div className='dragupmenudiv'>
                {open &&
                  <button className='backgrounddim' onClick={closeSheet}>
                  </button>}

                <div className={`dragupmenu ${open ? "open" : ""}`}>
                  <button className='drag-btn-div'>
                    <div className='drag-btn'></div>
                  </button>

                  <div className='wallet-manage'>
                    <div className='walletstitle'>Wallets</div>
                    <button className='manage-wallets'>
                      <img src = "src/assets/image/icon_gear.png"></img>
                      <div>Manage Wallets</div>
                      </button>
                  </div>
                  <div className='divider-div'>
                    <div className='divider'></div>
                  </div>
                  <div className='walletblock'>
                    <div className='wallet'>
                      <div className='walletname'>Wallet A</div>
                      <div className='notbackedup'>● Not backed up</div>
                    </div>
                    <div className='addressblock'>
                      <img className="address-img" src="src/assets/image/graphic.svg"></img>
                      <div className='address-text'>
                        <div className='address-name'>Address 1</div>
                        <div className='ctc-balance'>0 CTC</div>
                      </div>
                    </div>

                  </div>
                  <button className='add-wallets-div'>
                    <div className='add-wallets'>Add wallets</div>
                  </button>

                </div>


              </div>
            </div>

          </div>
        </section>
      </div>
    </>
  );
}

export { Main as default };
