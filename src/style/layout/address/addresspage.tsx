import '../../index.scss';

const Main: React.FC = () => {
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
                <button className="wallets" aria-haspopup="dialog" aria-expanded="false">
                  <img src="src\assets\image\graphic.svg"></img>
                  <p>Address 1</p>
                  <img src="src\assets\image\dropdown_icon.svg"></img>
                  <div>|</div>
                </button>

                <button><img src="src\assets\image\icon_square2_stacked.svg"></img></button>
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
                  <button className='balancebutton'>Send</button>
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
                <img className='list-empty-graphic' src="src\assets\image\graphicEmpty.svg"></img>
                <div className='empty-cryptos'>There are no cryptos.</div>
                <button className='add-token-button'>Add ssss</button>
              </div>

              


            </div>
          </div>
        </section>
      </div>
    </>
  );
}

export { Main as default };
