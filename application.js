/*
 * Copyright (c) 2013 Руслан Розбицкий
 *
 * Данная лицензия разрешает лицам, получившим копию данного программного
 * обеспечения и сопутствующей документации (в дальнейшем именуемыми «Программное Обеспечение»),
 * безвозмездно использовать Программное Обеспечение без ограничений,
 * включая неограниченное право на использование, копирование, изменение, добавление, публикацию,
 * распространение, сублицензирование и/или продажу копий Программного Обеспечения,
 * также как и лицам, которым предоставляется данное Программное Обеспечение,
 * при соблюдении следующих условий:
 *
 * Указанное выше уведомление об авторском праве и данные условия должны
 * быть включены во все копии или значимые части данного Программного Обеспечения.
 * Кроме содержимого в этом уведомлении, имя(имена) вышеуказанных держателей
 * авторских прав не должно быть использовано в рекламе или иным способом,
 * чтобы увеличивать продажу, использование или другие работы в этом
 * Программном обеспечении без предшествующего письменного разрешения.
 *
 * ДАННОЕ ПРОГРАММНОЕ ОБЕСПЕЧЕНИЕ ПРЕДОСТАВЛЯЕТСЯ «КАК ЕСТЬ», БЕЗ КАКИХ-ЛИБО ГАРАНТИЙ,
 * ЯВНО ВЫРАЖЕННЫХ ИЛИ ПОДРАЗУМЕВАЕМЫХ, ВКЛЮЧАЯ, НО НЕ ОГРАНИЧИВАЯСЬ ГАРАНТИЯМИ
 * ТОВАРНОЙ ПРИГОДНОСТИ, СООТВЕТСТВИЯ ПО ЕГО КОНКРЕТНОМУ НАЗНАЧЕНИЮ И ОТСУТСТВИЯ
 * НАРУШЕНИЙ ПРАВ. НИ В КАКОМ СЛУЧАЕ АВТОРЫ ИЛИ ПРАВООБЛАДАТЕЛИ НЕ НЕСУТ
 * ОТВЕТСТВЕННОСТИ ПО ИСКАМ О ВОЗМЕЩЕНИИ УЩЕРБА, УБЫТКОВ ИЛИ ДРУГИХ ТРЕБОВАНИЙ ПО
 * ДЕЙСТВУЮЩИМ КОНТРАКТАМ, ДЕЛИКТАМ ИЛИ ИНОМУ, ВОЗНИКШИМ ИЗ, ИМЕЮЩИМ ПРИЧИНОЙ ИЛИ
 * СВЯЗАННЫМ С ПРОГРАММНЫМ ОБЕСПЕЧЕНИЕМ ИЛИ ИСПОЛЬЗОВАНИЕМ ПРОГРАММНОГО ОБЕСПЕЧЕНИЯ
 * ИЛИ ИНЫМИ ДЕЙСТВИЯМИ С ПРОГРАММНЫМ ОБЕСПЕЧЕНИЕМ.
 *
 * mailto:support@rrs.pp.ua
 */

/**
 *
 * User: ruslan rosbitskyy
 * Date: 12.07.13
 * Time: 17:15
 * Mail: rosbitskyy@gmail.com
 */

///////
// использование вот типа такое!!!!!!
//
///////

var Application = app = x = (function () {

    this.debug = false;

    this.element = (function () {
        var arg = (arguments.length > 0) ? arguments[0] : '';
        this.create = function (elementName) {
            return document.createElement(elementName);
        };
        this.appendto = function () {
            if (arguments.length == 2) {
                return document.getElementById(arguments[1]).appendChild(arguments[0]);
            } else if (arguments.length == 1) {
                return document.body.appendChild(arguments[0]);
            }
            return null;
        };

        this.getPosition = function (elem) {
            var pos = { 'top': 0, 'left': 0 };
            if (elem.getBoundingClientRect()) {
                // bistro no ne vezde
                var box = elem.getBoundingClientRect();
                var body = document.body;
                var docElem = document.documentElement;
                var scrollTop = window.pageYOffset || docElem.scrollTop || body.scrollTop;
                var scrollLeft = window.pageXOffset || docElem.scrollLeft || body.scrollLeft;
                var clientTop = docElem.clientTop || body.clientTop || 0;
                var clientLeft = docElem.clientLeft || body.clientLeft || 0;
                pos.top = box.top + scrollTop - clientTop;
                pos.left = box.left + scrollLeft - clientLeft;
            } else {
                // medlenno no pashet
                var top = 0, left = 0;
                while (elem) {
                    top = top + parseInt(elem.offsetTop);
                    left = left + parseInt(elem.offsetLeft);
                    elem = elem.offsetParent;
                }
                pos.top = top;
                pos.left = left;
            }
            return pos;
        };
        this.setPosition = function () {
            // params: element, object{top,left}, [positionStyle] (absolute, relative, fixed >>)
            if (arguments.length < 2) return;
            var elemStyle = arguments[0].style;
            if ((arguments.length == 3) &&
                'absolute relative fixed'.indexOf(arguments[2].toLowerCase()) > -1) {
                elemStyle.position = arguments[2];
            } else {
                elemStyle.position = 'absolute';
            }
            elemStyle.top = arguments[1].top + 'px';
            elemStyle.left = arguments[1].left + 'px';
            elemStyle.backgroundColor = '';
            return elemStyle;   // element.style - для продолжения стилирования элемента
        };

        return this;
    })();

    this.host = function () {
        return "localhost"
    };
    this.isDevelopment = function () {
        return (this.host() == window.location.hostname) || (window.location.hostname == "auth.rrs.pp.ua");
    };

    this.bag = function () {
        var b = {};
        return { bag: b }
    };

    this.clone = function (obj) {
        if (obj == null || typeof(obj) != 'object')
            return obj;
        var temp = new obj.constructor();
        for (var key in obj)
            temp[key] = this.clone(obj[key]);
        return temp;
    };

    this.ping = function (url) {
        var img = new Image();
        img.src = url;
        return img;
    };

    this.task = function (callback, time) {
        var _handler_t0 = setInterval(callback, time);
        var _handler_t1 = setInterval(function () {
            clearInterval(_handler_t0);
            clearInterval(_handler_t1);
        }, time + 50);
    };

//    console.log = function (data) {
//        that.isDevelopment() ? 0 <= data.indexOf("warning:") ? console.info("tuzik:%c%s", "color:#B95050; font-size: 14px", data.split("warning:").join("")) : 0 <= data.indexOf("info:") ? console.info("tuzik:%c%s", "color:orange; font-size: 12px", data.split("info:").join("")) : 0 <= data.indexOf("error:") ? console.info("tuzik:%c%s", "color:red; font-size: 12px", data.split("error:").join("")) : 0 < data.indexOf(String.fromCharCode(0)) ? console.info("app.web.socket:%c%s", "color:#080; font-size: 12px", data.split(String.fromCharCode(0)).join(",")) :
//            console.info("tuzik: %O", data) : (console.info = function () {
//        }, console.debug = function () {
//        });
//    };
    console.help = function () {
        console.debug("tuzik: console help is not initialised yet...");
    };

    this.objectInfo = function (o) {
        for (var a in o) {
            console.log((typeof o[a]) + " " + a);
        }
    };

    this.ajax = function () {    // создаем локальный обьект
        try {
            return new XMLHttpRequest();  // для всех нормальных пацанов
        } catch (e) {
        }
        try {
            return new ActiveXObject("Msxml2.XMLHTTP.6.0");   // для МСи ЫЕ и прочей срани
        } catch (e) {
        }
        try {
            return new ActiveXObject("Msxml2.XMLHTTP.3.0");
        } catch (e) {
        }
        try {
            return new ActiveXObject('Msxml2.XMLHTTP');
        } catch (e) {
        }
        try {
            return new ActiveXObject('Microsoft.XMLHTTP');
        } catch (e) {
        }
        return null;
    };

    this.request = function (url, async, func) {
        var a = new this.ajax();
        if (a) {
            a.open("GET", url, async);
            a.setRequestHeader('Access-Control-Allow-Origin', '*');
            a.onreadystatechange = function () {
                // (0-2 не пашут): 0='Uninitialized', 1='Loading', 2='Loaded', 3='Interactive', 4='Complete'
                if (a.readyState == 4) {
                    // ответы: 200 - OK, 404 - Not Found, 401 - Access denied и тп
                    if (a.status == 200 && a.status <= 304) {
                        func(a.responseText);    // выполняем переданную сюда функцию
                    } else {
                        func(a.statusText);      // выдаем текст ошибки
                    }
                }
            };
            a.send(null);
        }
        return ajax;
    };

    this.get = function (url, async, func) {
        var a = new ajax();
        a.open("GET", url, async);
        a.onload = function () {
            func(a.responseText);
        };
        a.send();
        return this;
    };

    this.post = function (url, data, async, func) {
        var a = new ajax();
        a.open("POST", url, async);
        a.onload = function () {
            func(a.responseText);
        };
        a.send(data);
        return this;
    };

    this.cookie = function () {
        if (arguments.length == 1) {
            // GET cookie value
            c_name = arguments[0];
            var c_value = document.cookie;
            var c_start = c_value.indexOf(" " + c_name + "=");
            if (c_start == -1) {
                c_start = c_value.indexOf(c_name + "=");
            }
            if (c_start == -1) {
                c_value = null;
            }
            else {
                c_start = c_value.indexOf("=", c_start) + 1;
                var c_end = c_value.indexOf(";", c_start);
                if (c_end == -1) {
                    c_end = c_value.length;
                }
                c_value = unescape(c_value.substring(c_start, c_end));
            }
            return c_value;
        } else if (arguments.length == 3) {
            // SET cookie
            c_name = arguments[0];
            value = arguments[1];
            exdays = arguments[2];
            var exdate = new Date();
            exdate.setDate(exdate.getDate() + exdays);
            var c_value = escape(value) + ((exdays == null) ? "" : "; expires=" + exdate.toUTCString());
            document.cookie = c_name + "=" + c_value;
        }
    };

    this.xor = function (m, k) {
        var ml = m.length;
        var kl = k.length;
        var msg = "";
        for (i = 0; i < ml; i++) {
            msg += String.fromCharCode(m.charCodeAt(i) ^ k.charCodeAt(i % kl));
        }
        return msg;
    };

    this.ready = function (func) {
        if (document.addEventListener) {   // for Jopera 0xFireeFfox
            document.addEventListener("DOMContentLoaded", func, false);
        }
        else if (document.readyState) {        // ЫЕ
            if (document.readyState == "interactive" || document.readyState == "complete") {
                if (arguments.callee.done) return;
                arguments.callee.done = true;
                func();
            }
            else {
                if (arguments.callee.done) return;
                arguments.callee.done = true;
                document.onreadystatechange = function () {
                    func
                };
            }
        }
        else {
            window.onload = func;     // for zer good my furer
        }
    };

    this.browser = (function () {
        this.Safari = (/AppleWebKit.*Gecko.*Version.*Safari/.test(navigator.userAgent));
        this.ChromeWebKit = (/AppleWebKit.*Gecko.*Chrome.*Safari/.test(navigator.userAgent));
        this.Chrome = (/AppleWebKit.*Gecko.*Chrome.*Safari/.test(navigator.userAgent));
        this.MobileSafari = (/Apple.*Mobile.*Safari/.test(navigator.userAgent));
        this.Gecko = navigator.userAgent.indexOf('Gecko') > -1 && navigator.userAgent.indexOf('KHTML') === -1;
        this.Opera = navigator.userAgent.indexOf(' Presto/') > 1 && navigator.userAgent.indexOf('pera/') == 1;
        this.Firefox = navigator.userAgent.indexOf(' Firefox/') > 1;
        this.IE = !!window.attachEvent && !navigator.userAgent.indexOf('pera/') == 1;
        return this;
    })();

    if (typeof [].remove == "undefined") {
        Array.prototype.remove = function (a, b) {
            var rest = this.slice((b || a) + 1 || this.length);
            this.length = a < 0 ? this.length + a : a;
            return this.push.apply(this, rest);
        };
    }

    return this;
})();
String.prototype.append = app.element.appendto;

