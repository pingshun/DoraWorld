var utils = require('./../../utils/utils')

module.exports = {
    getAllPics: function (eq, res, context) {
        console.log(context);
        var pics = [];
        for (var i = 1; i < 14; i++) {
            var image = {
                file_name: 'images/pic_wall/' + i + '.jpg',
                sender: utils.random_string(6),
                comment: utils.random_string(40)
            };
            pics.push(image);
        }
        res.status(200).json(pics);
    }
};