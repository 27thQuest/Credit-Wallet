import { generatePrivateKey, privateKeyToAccount }    from "viem/accounts";
const privateKey = generatePrivateKey()
const account = privateKeyToAccount(privateKey)
// console.log(account.address)
console.log("0xaE7281756568e9093AB4129F57123681E085a354")
