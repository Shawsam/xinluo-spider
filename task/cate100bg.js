// const superagent = require('superagent')
// const eventproxy = require('eventproxy')
// const async = require('async')
// const logger = require('../logger')
// const productModel = require('../model/productModel')

// const fetchCateProducts = function(){
// 	const originUrl = 'http://www.shilladfs.com/estore/kr/zh/e/bestshop/getBestProductList'
// 	const data = { "form":"normal","sc":1,"type":"topSelling","searchWord":"","rank":0 }

// 	logger.info('开始爬取')
// 	superagent.post(originUrl)
// 	  .type('form')
// 	  .send(data)
// 	  .end(function (err, res) {
// 	     // 常规的错误处理
// 	     if (err) {
// 	         console.log(err)
// 	     }else{
// 	         let resArray = JSON.parse(res.text)
// 	         resArray.map(function(item,index){
// 	            let product = new productModel({
// 	              cate:1,
// 	              code:item.code,
// 	              brandName:item.brandCategory.brandName,
// 	              productName:item.brandCategory.displayName,
// 	              salePrice:(item.userPrice.salePrice*6.35).toFixed(2),
// 	              discountPrice:(item.userPrice.discountPrice*6.35).toFixed(2),
// 	              discountRate:item.userPrice.discountRate,
// 	              centerImg:item.galleryImages[0]['150X']?item.galleryImages[0]['150X'].url:''
// 	            })
// 	            product.save()
// 	         }) 
// 	         logger.info('爬取完毕')
// 	     }
// 	  })
// }

// module.exports = fetchCateProducts