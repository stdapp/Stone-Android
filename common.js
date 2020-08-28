//保留N位小数，整数不补全0; N不传默认为4;
const toDecimalNNoZero = (x,n) => {
  n = n ? n : 4;
  if (x === 0) {
    return 0;
  } else {
    let p = Math.pow(10,n);
    let f = Math.round(x * p) / p;
    let s = f.toString();
    return s;
  }
};

let openLoad = () => {
    let divDom = document.getElementById("loading");
    if (!divDom) {
        let div = document.createElement("div");
        div.setAttribute('id', 'loading');
        let dom = '<div class="mint-indicator" style="display: block;font-size: 0;"><div class="mint-indicator-wrapper" style="padding: 15px;"><span class="mint-indicator-spin"><div class="mint-spinner-snake" style="border-top-color: rgb(204, 204, 204); border-left-color: rgb(204, 204, 204); border-bottom-color: rgb(204, 204, 204); height: 32px; width: 32px;"></div></span><span class="mint-indicator-text" style="display: none;"></span></div><div class="mint-indicator-mask"></div></div>';
        div.innerHTML = dom;
        document.body.appendChild(div)
    }
};

let openLoadWithText = (text) => {
  let divDom = document.getElementById("loading");
  if (!divDom) {
    let div = document.createElement("div");
    div.setAttribute('id', 'loading');
    let dom = '<div class="mint-indicator" style="display: block;font-size: 0;"><div class="mint-indicator-wrapper" style="padding: 15px;"><span class="mint-indicator-spin"><div class="mint-spinner-snake" style="border-top-color: rgb(204, 204, 204); border-left-color: rgb(204, 204, 204); border-bottom-color: rgb(204, 204, 204); height: 32px; width: 32px;"></div></span><span class="mint-indicator-text">'+ text +'</span></div><div class="mint-indicator-mask"></div></div>';
    div.innerHTML = dom;
    document.body.appendChild(div)
  }
};

let closeLoad = () => {
  let dom = document.getElementById("loading");
  if (dom) document.body.removeChild(dom);
};

//打开H5+ sqlite
let openDB = () => {
  return new Promise((resolve, reject) => {
    if (!plus.sqlite.isOpenDatabase({name: 'stoneApp', path: '_doc/stone.db'})) {
      plus.sqlite.openDatabase({
      name: 'stoneApp',
      path: '_doc/stoneApp.db',
      success: function (e) {
        resolve({status:"success",data:e})
      },
      fail: function (e) {
        reject({status:'fail1',data:e})
      }
      });
    }else{
      resolve({status:'success'})
    }
  })
};

//sqlite 查询或添加 action为1时增删改，否则为查
let query = (sql,action) => {
  return new Promise((resolve, reject) => {
    plus.sqlite.executeSql({
      name: 'stoneApp',
      sql: 'create table if not exists stoneInfo( address CHAR(17), keystore VARCHAR(1000), name VARCHAR(20), str VARCHAR(100), signature VARCHAR(1000), ethAddr CHAR(42), status INT)',
      success: function (e) {
        let act = action=== 1 ? 'executeSql' : 'selectSql';
        plus.sqlite[act]({
          name: 'stoneApp',
          sql: sql,
          success: function (e) {
            resolve({status:'success',data:e})
          },
          fail: function (e) {
            reject({status:'fail3',data:e})
          }
        })
      },
      fail: function (e) {
        reject({status:'fail2',data:e})
      }
    })
  })
};

//判断密码首尾空格
const pswTest = (psw) => {
  let reg = /(^\s)|(\s$)/g;
  return reg.test(psw);
};

//判断是否为json字符串
const jsonTest = (str) => {
  try {
    JSON.parse(str);
    return true;
  } catch(e) {
    return false;
  }
};

//将科学计数法的值转换为字符串
const numformat = (num) => {
  let result = String(num);
  if (result.indexOf('-') >= 0) {
    result = '0' + String(Number(result) + 1).substr(1);
  }
  return result
};

//交易返回error
const errMsg = (err) => {
  let arr = [[1, '失败'],
    [2, '等待初始化'],
    [3, '错误的状态'],
    [4, '无效的类型'],
    [5, '脚本错误'],
    [6, '没有执行'],
    [8, '需要先同步'],
    [9, '没有找到'],
    [11, '无效的参数'],
    [12, '解析错误'],
    [13, '请求错误'],
    [15, '超时'],
    [17, '无效的格式'],
    [18, '不明数值'],
    [19, '无效的token'],
    [21, '无效的会话'],
    [24, '交易池满了'],
    [25, '无效的状态'],
    [26, 'INT余额不足'],
    [27, '交易nonce错误'],
    [28, '无效的区块'],
    [29, '操作取消'],
    [30, '交易费过小'],
    [31, '此项只读'],
    [34, '交易已存在'],
    [35, '版本不支持'],
    [36, '执行出错'],
    [37, '验证不匹配'],
    [38, '交易类型不存在'],
    [39, '交易费不足'],
    [40, '已跳过'],
    [41, '发起交易过于频繁'],
    [50, '检测到分叉'],
    [10000, '用户定义的错误码'],
    [10011, '没有权限'],
    [10012, '账户已冻结'],
    [10013, '无效的地址'],
    [10021, 'limit不足'],
    [10022, 'limit过大'],
    [10023, 'limit过小'],
    [10024, 'block limit值过大'],
    [10025, 'price值过大'],
    [10026, 'price值过小'],
    [10027, '不是bignumber对象'],
    [10028, '解锁的金额为0'],
    [10030, '不是整数'],
    [10031, '超过最大值，大于1e+18'],
    [10032, '解锁的金额为0'],
    [10040, '找不到keystore'],
    [10041, 'keystore错误']];
  let msg = '';
  for (let i in arr){
    let value = arr[i];
    if (value[0] === err) {
      msg = value[1];
      break;
    } else {
      msg = 'request error'
    }
  }
  return msg
};


let UrlSearch = function() {
    var name, value;
    var str = location.href;
    var num = str.indexOf("?");
    str = str.substr(num + 1);
    var arr = str.split("&");
    for (var i = 0; i < arr.length; i++) {
        num = arr[i].indexOf("=");
        if (num > 0) {
            name = arr[i].substring(0, num);
            value = arr[i].substr(num + 1);
            this[name] = value;
        }
    }
};

const privateTest = (str) => {
  if (str.substr(0,2) === '0x') {
    return str;
  } else {
    return '0x' + str
  }
}


const balanceInitialize = (balance) => balance === null ? 0 : balance;


let URL = 'http://app.stones.games';
let ExchangeUrl = 'http://exchange.stones.games'

module.exports = {
  openLoad,
  openLoadWithText,
  closeLoad,
  toDecimalNNoZero,
  openDB,
  query,
  pswTest,
  jsonTest,
  numformat,
  errMsg,
  UrlSearch,
  privateTest,
  balanceInitialize,
  URL,
  ExchangeUrl,
};
