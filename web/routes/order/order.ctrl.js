var path = require('path');
const config = require('../../config/db_config');
const connection = config.init();
connection.connect();

const getCategoryList = (req, res) => {
    var storeNo = parseInt(req.params.storeNo, 10);
    var query = 'SELECT * FROM category WHERE storeNo = ?';
    connection.query(query, storeNo, function(err, result) {
        if(err) {
            console.log('error occured: ', err);
            res.status(400).end();
        } else {
            console.log('get category list success');
            res.status(200).json(result).end();
        }
    });
}

// const getCategoryList = (req, res) => {
//     var storeNo = parseInt(req.params.storeNo);
//     var query = 'SELECT * FROM category WHERE storeNo = ?';
//     connection.query(query, storeNo, function(err, result) {
//         if(err) {
//             console.log('error occured: ', err);
//             res.status(400).end();
//         } else {
//             console.log('get category list success');
//             res.render(path.resolve('public/order/main.ejs'), {'categoryList' : result});
//         }
//     });
// }

const getMenuList = (req, res) => {
    var storeNo = parseInt(req.params.storeNo, 10);
    var categoryNo = parseInt(req.params.categoryNo, 10);
    var query = 'SELECT * FROM menu WHERE storeNo = ? AND categoryNo = ?';
    connection.query(query, [storeNo, categoryNo], function(err, result) {
        if(err) {
            console.log('error occured: ', err);
            res.status(400).end();
        } else {
            console.log('get category list success');
            res.status(200).json(result).end();
        }
    });
}

module.exports = {
    getCategoryList, getMenuList,
}
