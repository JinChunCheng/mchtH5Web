export default {
    install(Vue) {
        //调用app的native方法
        function _callNative(methodName, paramMap, cb, flag) {
            var isAndroid = -1 !== navigator.userAgent.toLowerCase().indexOf("android");
            //android js bridge
            !function (undefined) {
                var NAMESPACE = 'iBoxpay';
                var API_NAMESPACE = "__JSBridge__"
                var context = window[NAMESPACE] = {};
                var api = window[API_NAMESPACE] || null;
                if (!api) {
                    return;
                    //return alert('发生错误, 未找到 api 对象!');
                }
                context.require = function (cmd, params, callback) {
                    params = params || '{}';
                    var result = api.require(cmd, JSON.stringify(params));
                    if (callback && result) {
                        result = JSON.parse(result);
                        callback(result);
                    }
                }
            }();
            var callbackName = 'cb' + (new Date().getTime());
            //TODO 加上token
            paramMap == null ? paramMap = {} : paramMap = paramMap;
            paramMap["callbackName"] = callbackName;
            //paramMap["myCallback"]=cb;
            var strJsonParam = JSON.stringify(paramMap);
            var jsonResp = {};
            window[callbackName] = function (strResp) {
                //alert("回调:"+JSON.stringify(strResp));
                try {
                    jsonResp = typeof strResp == "string" ? eval(strResp) : strResp;
                } catch (err) {
                }
                cb(jsonResp);
                //执行回调后，删除跟回调方法相关的资源
                if (isAndroid) {
                    if (flag) {
                    } else {
                        delete window[callbackName];
                    }
                } else {
                    document.getElementById('iframe_' + callbackName).remove();
                    // $('#iframe_' + callbackName).remove();
                }
            };
            if (isAndroid) {
                try {
                    iBoxpay.require(methodName, paramMap, window[callbackName]);
                } catch (err) {
                    console.log(err);
                }
            } else {
                var src = 'callfunction://' + methodName + '?callback=' + callbackName + '&params=' + strJsonParam;
                var ifreame = document.createElement("iframe");
                ifreame.id = "iframe_" + callbackName;
                ifreame.src = src;
                ifreame.style.display = "none";
                document.body.appendChild(ifreame);
            }
        }

        var _cashbox = {
            callNative: _callNative,
            exit: function () {
                if (_storage.get("FLAG") === "newWebview") {
                    _storage.remove("FLAG");
                    _callNative('closeWebView', null, (res) => {
                    })
                } else {
                    _callNative('exit', {}, function (res) {
                    });
                }
            },
            init: function () {
                var _appParams = {
                    hasTitleBar: false,
                    hasBackBtn: false
                };
                _callNative('setClientInfo', _appParams, function (res) {
                });
            }
        };
        // 处理钱盒android版的返回事件
        window.onBack = function () {
            // 路由跳转配置
            const backConfig = {
                // 需要退出优惠买单的路由
                exitRoutes: [
                    'home', 'index'
                ]
            };
            // 当前路由
            const routeName = window.router.app.$route.name;
            for (var i = 0; i < backConfig.exitRoutes.length; i++) {
                const item = backConfig.exitRoutes[i];
                if (item === routeName) {
                    _cashbox.exit();
                    return;
                }
            }
            // 如果没有特殊配置，则浏览器自动返回
            history.back();
        };
        /**
         * 获取url ? 之后的参数
         * @returns {Object}
         */
        var _request = function () {
            let url = window.location.href;
            let theRequest = new Object();
            if (url.indexOf("?") !== -1) {
                let str = (url.substr(1).split("?")[1]);
                str = str.substr(0, str.length - 2); // 去掉#/
                let strs = str.split("&");
                for (let i = 0; i < strs.length; i++) {
                    theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
                }
            }
            return theRequest;
        };
        var _formatWeek = function (weekArr) {
            var weekData = [];
            var str = ''
            for (let i = 1; i < 8; i++) {
                weekData['day' + i] = weekArr['day' + i]
                if (weekData['day' + i]) {
                    str = str + i + '#'
                }
            }
            str = str.substring(0, str.length - 1)
            return str;
        }
        //扩展Date
        Date.prototype.Format = function (fmt) {
            var o = {
                "M+": this.getMonth() + 1, //  月份
                "d+": this.getDate(), //  日
                "h+": this.getHours(), //  小时
                "m+": this.getMinutes(), //  分
                "s+": this.getSeconds(), //  秒
                "q+": Math.floor((this.getMonth() + 3) / 3), //  季度
                "S": this.getMilliseconds() //  毫秒
            };
            if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
            for (var k in o)
                if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            return fmt;
        }
        //缓存
        var _storage = {
            get: function (key) {
                if (window.localStorage) {
                    return localStorage.getItem(key);
                }
                // if browser does not support storage, use cookie instead
                var arr,
                    reg = new RegExp("(^| )" + key + "=([^;]*)(;|$)");
                if (arr = document.cookie.match(reg))
                    return unescape(arr[2]);
                else
                    return null;
            },
            set: function (key, value) {
                if (window.localStorage) {
                    localStorage.setItem(key, value);
                    return;
                }
                document.cookie = key + "=" + escape(value) + ";path=/";
            },
            remove: function (key) {
                if (window.localStorage) {
                    localStorage.removeItem(key);
                    return;
                }
                var exp = new Date();
                exp.setTime(exp.getTime() - 1);
                document.cookie = key + "=;expires=" + exp.toGMTString();
            },
            clear: function () {
                if (window.localStorage) {
                    localStorage.clear();
                }
            }
        };
        //公共方法
        var _helper = {
            //get token
            getToken: function () {
                var cashBoxToken = '';
                var url = window.location.href;
                if (url.indexOf("?") != -1) {
                    var str = url.substr(1);
                    strs = str.split("=");
                    cashBoxToken = strs[1];
                }
                console.log(cashBoxToken)
                return cashBoxToken;
            }
        }
        Vue.prototype.Util = {
            Cashbox: _cashbox,
            Storage: _storage,
            Helper: _helper,
            Request: _request,
            formatWeek: _formatWeek
        };
    }
}
