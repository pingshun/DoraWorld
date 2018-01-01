
common.filter('cnDate', function() {
    var isDate = function(date) {
        return ( (new Date(date) !== "Invalid Date" && !isNaN(new Date(date)) ));
    };
    var addPrefix = function(num) {
        if(num < 10) {
            num = '0' + num;
        }
        return num;
    };

    return function(input) {
        if(!isDate(input)) {
            return '某年某月';
        } else {
            var date = new Date(input);
            return date.getFullYear() + '-' + addPrefix(date.getMonth() + 1) + '-' + addPrefix(date.getDate());
        }
    };
});
common.filter('trimText', function() {
    return function(input, length) {
        var text = '暫時沒有介紹';
        length = length || 150;
        if(typeof input === 'string') {
            if(input.length > length) {
                text = input.substring(0, length - 1) + ' ...';
            } else {
                text = input;
            }
        }
        return text;
    }
});