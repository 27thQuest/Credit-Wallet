import { Routes, Route } from "react-router-dom";
import Main from "./src/style/layout/assets/assetspage";
import SendPage from "./src/style/layout/sendpage/sendpage";
import ReceivingAddressPage from "./src/style/layout/ReceivingAddressPage/ReceivingAddressPage";

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Main />} />
      <Route path="/send" element={<SendPage />} />
      <Route path="/receivingaddress" element={<ReceivingAddressPage/>}/>
    </Routes>
  );
};

export default App;
