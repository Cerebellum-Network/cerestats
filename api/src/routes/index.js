const express = require('express')
const router = express.Router()
const Faucet = require('../service/faucet')

router.post('/faucet', Faucet.faucet)

module.exports = router;