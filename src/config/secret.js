
//前台加密主要是为了防止post请求明文传递密码


//使用例子
// var CryptoJS = require("crypto-js");

// var data = [{id: 1}, {id: 2}]

// // Encrypt
// var ciphertext = CryptoJS.AES.encrypt(JSON.stringify(data), 'secret key 123').toString();

// // Decrypt
// var bytes  = CryptoJS.AES.decrypt(ciphertext, 'secret key 123');
// var decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

// console.log(decryptedData); // [{id: 1}, {id: 2}]

export const SECRETKEY = '1234567890ABCDEF1234567890ABCDEf' //密钥
export const iv = '0123456789ABCDEF' //偏移量