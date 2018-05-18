const superagent = require('superagent')
const eventproxy = require('eventproxy')
const async = require('async')
const logger = require('../logger')
const { indexproductModel } = require('../model/productModel')
const utils = require('utility')


function fetchSinglePage(task,callback){
	logger.info(task)
	let pageNum = task.page,
	    cate=task.cate

	fetchNum ++
	logger.info(`并发数:${fetchNum}, 爬取cate=${cate}第${pageNum+1}页数据--开始`)
	var jsonData = {"category":cate,"sort":"topSelling","size":"30","page":pageNum,"text":"","within":"","query":"allCategories:9:divCode:1","condition":{"brand":[],"gender":[],"priceRange":[0,3851.3],"specialPriceYnOption":false,"giftYnOption":false,"isNewProductOption":false,"fastShopYnOption":false,"flatPriceYnOption":false}}
   
    superagent.post(originUrl)
	.type('form')
	.send({json:JSON.stringify(jsonData)})
	.end(function (err, res) {
		 fetchNum --
	   // 常规的错误处理
	   if (err) {
	   	   console.log(err)
	       logger.info(`并发数:${fetchNum}, 爬取cate=${cate}第${pageNum+1}页数据--失败`)
	   }else{
         logger.info(`并发数:${fetchNum}, 爬取cate=${cate}第${pageNum+1}页数据--成功`)
	     let resArray = JSON.parse(res.text).results
         var filterData = []
         resArray.map(function(item){
            filterData.push({
              cate:cate,
	          code:item.code,
	          brandName:item.brandCategory.brandName,
	          productName:item.brandCategory.displayName,
	          salePrice:(item.userPrice.salePrice*6.35).toFixed(2),
	          discountPrice:(item.userPrice.discountPrice*6.35).toFixed(2),
	          discountRate:item.userPrice.discountRate,
	          centerImg:item.galleryImages[0]['150X']?item.galleryImages[0]['150X'].url:'',
	          updateTime:utils.YYYYMMDDHHmmss()
             })
         })
         callback(null,filterData)
	   }
	 })
}

// ****** 定义全局变量，配置常量 ********
const originUrl = 'http://www.shilladfs.com/estore/kr/zh/ajaxProducts'
const cateArray = ['']
let pageTotal = 30      //将要爬取的总页数
let fetchNum = 0        //当前并发数
let products = []       //商品数据



const  fetchIndexData = function(){
    let taskArray = []
    const pageArray = Array.from(Array(pageTotal).keys()) 
	cateArray.map(function(cate,i){
		pageArray.map(function(page,j){
			let singledata = {}
            singledata.cate = cate
            singledata.page = page
            taskArray.push(singledata)
		})
	})
    
	logger.info('爬取列表数据--开始')
	async.mapLimit(taskArray,5,function(task,callback){
	      fetchSinglePage(task,callback)
	  },function(err,result){
	  	  logger.info('爬取列表数据--完毕')
	  	  result.map(function(singleItem){
	  	  	logger.info(singleItem.length)
	  	  	singleItem.map(function(item){
	            indexproductModel.update(
	                {code:item.code},
	                {
			          cate:item.cate,
			          code:item.code,
			          brandName:item.brandName,
			          productName:item.productName,
			          salePrice:item.salePrice,
			          discountPrice:item.discountPrice,
			          discountRate:item.discountRate,
			          centerImg:item.centerImg,
			          updateTime:item.updateTime
			        },{upsert:true})
	            .then(function(data){
	                console.log('插入或更新一条数据完毕')
	            })
	  	  	})
	  	  })

	})
}

module.exports = fetchIndexData




