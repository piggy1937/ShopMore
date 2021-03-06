import CryptoJS from 'crypto-js'
import { SECRETKEY,iv as gIV } from '../config/secret'
import { Form } from 'antd'
import sha256  from 'sha256'


/**
 * 生成指定区间的随机整数
 * @param min
 * @param max
 * @returns {number}
 */
export function randomNum(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

/**
 * 加密函数，加密同一个字符串生成的都不相同
 * @param {*} str 
 */
export function encrypt(str) {
    
    let wordArray = CryptoJS.enc.Utf8.parse(SECRETKEY) //字符串转16进制编码 密钥
    let ivArray   = CryptoJS.enc.Utf8.parse(gIV) //字符串转16进制编码 偏移量

   let  key = CryptoJS.enc.Hex.parse(wordArray.toString())
   let iv = CryptoJS.enc.Hex.parse(ivArray.toString())
   var enc = CryptoJS.AES.encrypt(str ,key,{
    iv:iv,
    mode: CryptoJS.mode.CBC,  
    padding: CryptoJS.pad.Pkcs7
})

var enced = enc.ciphertext.toString()
return enced;

}

/**
 * 解密函数
 * @param {*} enced 
 */
export function decrypt(enced) {
    let wordArray = CryptoJS.enc.Utf8.parse(SECRETKEY)
    let ivArray   = CryptoJS.enc.Utf8.parse(gIV)

    let  key = CryptoJS.enc.Hex.parse(wordArray.toString())
    let iv = CryptoJS.enc.Hex.parse(ivArray.toString())
    var dec = CryptoJS.AES.decrypt(CryptoJS.format.Hex.parse(enced), key,{
        iv:iv,
        mode: CryptoJS.mode.CBC,  
        padding: CryptoJS.pad.Pkcs7
    })
    return CryptoJS.enc.Utf8.stringify(dec);
}

/**
 * 判断是否是对象
 * @param {*} obj 
 */
export function isObject(obj) {
    return Object.prototype.toString.call(obj) === '[object Object]'
}

/**
 * 创建表单回显的对象
 * @param {*} obj 
 */
export function createFormField(obj) {
    let target = {}
    if (isObject(obj)) {
        for (let [key, value] of Object.entries(obj)) {
            target[key] = Form.createFormField({
                value
            })
        }
    }
    return target
}

/**
 * 将img标签转换为【图片】
 * @param {string} str 
 */
export function replaceImg(str){
    if(typeof str === 'string'){
        str = str.replace(/<img(.*?)>/g, "[图片]")
    }
    return str
}

/**
 * 图片预加载
 * @param arr
 * @constructor
 */
export function preloadingImages(arr) {
    if(Array.isArray(arr)){
        arr.forEach(item=>{
            const img = new Image()
            img.src = item
          })
    }
  }


export function treeTransArray(treeObj, rootid) {
    const temp = [];  // 设置临时数组，用来存放队列
    const out = [];    // 设置输出数组，用来存放要输出的一维数组
    temp.push(...treeObj);
    // 首先把根元素存放入out中
    let pid = rootid;
    for(var i=0;i<treeObj.length;i++){
        const obj = deepCopy(treeObj[i]);
        obj.pid = pid;
        delete obj['children'];
        out.push(obj)
    }
   
    // 对树对象进行广度优先的遍历
    while(temp.length > 0) {
        const first = temp.shift();
        const children = first.children;
        if(children && children.length > 0) {
            pid = first.id;
            const len = first.children.length;
            for(let i=0;i<len;i++) {
                temp.push(children[i]);
                const obj = deepCopy(children[i]);
                obj.pid = pid;
                delete obj['children'];
                out.push(obj)
            }
        } 
    }
    return out
 }
 // 深拷贝
 function deepCopy(o) {
    if (o instanceof Array) {  //先判断Array
        var n = [];
        for (var i = 0; i < o.length; ++i) {
            n[i] = deepCopy(o[i]);
        }
        return n;

    } else if (o instanceof Object) {
        var n = {}
        for (var i in o) {
            n[i] = deepCopy(o[i]);
        }
        return n;
    } else {
        return o;
    }
}
