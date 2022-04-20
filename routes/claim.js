var express = require('express');
var router = express.Router();
const uuid = require('uuid').v4;
const axios = require('axios');

const mongoose = require('mongoose');
const Claim = require('./../models/Claim');

// Connect to MongoDB
mongoose
  .connect(
    'mongodb://mongo:27017/claim-db',
    { useNewUrlParser: true }
  )
  .then(() => console.log(`Successfully connected to Mongo DB`))
  .catch(err => console.log(`Failed to connect to Mongo DB :: `, err));


/* GET all posted claims. */
router.get('/', function (req, res, next) {
  Claim.find()
    .then(claims => res.status(200).json({
      status: `OK`,
      result: claims
    }))
    .catch(err => res.status(404).json({
      status: `NOT_FOUND`,
      msg: 'No claims found'
    }));
});

/* GET posted claim by id. */
router.get('/:id', function (req, res, next) {
  Claim.findOne({ claimId: req.params.id })
    .then(claims => res.status(200).json({
      status: `OK`,
      result: claims
    }))
    .catch(err => res.status(404).json({
      status: `NOT_FOUND`,
      msg: 'No claims found'
    }));
});

/* POST new claim. */
router.post('/', function (req, res, next) {

  let policyApi = `http://${process.env[`POLICY_SERVICE`]}/policies/${req.body.policyId}`;
  let billingApi = `http://${process.env[`BILLING_SERVICE`]}/api/billings/${req.body.billingId}`;
  
  const newClaim = new Claim({
    claimId: uuid(),
    ...req.body
  });
  console.log(policyApi);
  console.log(billingApi);
  axios({
    method: 'get',
    url: policyApi
  })
    .then(function (response) {
      axios({
        method: 'get',
        url: billingApi
      })
        .then(function (response) {
          
          newClaim.save()
            .then(claim => res.status(201).json({
              status: `CREATED`,
              result: newClaim,
              msg: `Claim created successfully`
            }))
            .catch(err => res.status(500).json({
              status: `INTERNAL_ERROR`,
              msg: `Some exception occurred: ${err.message}`
            }));
        })
        .catch(err => res.status(500).json({
          status: `INTERNAL_ERROR`,
          msg: `Exception in Billing: ${err.message}`
        }));
    })
    .catch(err => res.status(500).json({
      status: `INTERNAL_ERROR`,
      msg: `Exception in Policy: ${err.message}`
    }));

});

module.exports = router;
