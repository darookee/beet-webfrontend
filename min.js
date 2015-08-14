var minLib = (function (window, document, undefined) {
    'use strict';

    var ready = function (fn) {
        if (document.readyState !== 'loading') {
            fn();
        } else if (document.addEventListener) {
            document.addEventListener('DOMContentLoaded', fn);
        } else {
            document.attachEvent('onreadystatechange', function () {
                if (document.readyState !== 'loading') {
                    fn();
                }
            });
        }
    };

    var on = function (el, eventName, handler) {
        if (el.addEventListener) {
            el.addEventListener(eventName, handler);
        } else {
            el.attachEvent('on' + eventName, function () {
                handler.call(el);
            });
        }
    };

    var ajax = function (url, callback) {
        var request = new XMLHttpRequest();
        request.open('GET', url, true);

        request.onreadystatechange = function () {
            if (this.readyState === 4) {
                if (this.status >= 200 && this.status < 400) {
                    // Success!
                    var resp = this.responseText;
                    callback(resp);
                } else {
                    console.log(this);
                    // Error :(
                }
            }
        };

        request.send();
        request = null;
    };

    var simpleTemplate = function(template, data){
        var renderTemplate = function(template, data) {
            for(var key in data) {
                template = replaceAll('[[ '+key+' ]]', data[key], template);
            }
            return template;
        }
        var escapeRegExp = function (str) {
            return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
        }
        var replaceAll = function (find, replace, str) {
            return str.replace(new RegExp(escapeRegExp(find), 'g'), replace);
        }
        return renderTemplate(template, data);
    }

    var timeTo = function(time) {
        var sec_num = parseInt(time, 10); // don't forget the second param
        var hours   = Math.floor(sec_num / 3600);
        var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
        var seconds = sec_num - (hours * 3600) - (minutes * 60);

        if (minutes < 10) {minutes = "0"+minutes;}
        if (seconds < 10) {seconds = "0"+seconds;}
        var time    = minutes+':'+seconds;
        return time;
    }

    return {
        on: on,
        ready: ready,
        ajax: ajax,
        template: simpleTemplate,
        timeTo: timeTo
    };

}(window, document));
