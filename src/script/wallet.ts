import { generatePrivateKey, privateKeyToAccount }    from "viem/accounts";
const privateKey = generatePrivateKey()
const account = privateKeyToAccount(privateKey)
// console.log(account.address)




console.log("ADDRESS:", account);
console.log("PRIVATE KEY:", privateKey);