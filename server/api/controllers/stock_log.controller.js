const stockLogServices = require("../services/stock_log.service");


const create = async (req, res) => {
    try {
        const data = {
            ...req.body,
          };
          
        const stocklog = await stockLogServices.createStockLog(data);
        res.status(200).json(stocklog)
    }catch(error){
        console.log(error);
    }
}

const getAll = async (req, res) => {

    try {
        const stock_log = await stockLogServices.getAllStockLog();
        res.status(200).json(stock_log)
    } catch (error) {
        res.status(500).json(error)
    }
}

module.exports = {
    create,
    getAll
}