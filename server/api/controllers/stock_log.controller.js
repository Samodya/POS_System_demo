const stockLogServices = require("../services/stock_log.service");

const create = async (req, res) => {
    try {
        const data = {
            ...req.body,
          };

        const stocklog = await stockLogServices.createStockLog(data);
        res.status(200).json(stocklog)
    }catch(error){

    }
}

module.exports = {
    create
}