
'use strict';
const OfficeResourceAccess = require('../resourceAccess/OfficeResourceAccess');
const Logger = require('../../../utils/logging');
const { PLACE_ORDER_ERROR } = require('../OfficeConstant');
const { ERROR } = require('../../Common/CommonConstant');

async function insert(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let officeData = req.payload;

      let result = await OfficeResourceAccess.insert({
        ...officeData,
      });

      if (result) {
        resolve(result);
      } else {
        console.error(`error office can not insert: ${ERROR}`);
        reject('failed');
      }
    } catch (e) {
      Logger.error(e);
      reject('failed');
    }
  });
}

async function find(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let filter = req.payload.filter;
      let skip = req.payload.skip;
      let limit = req.payload.limit;
      let location = req.payload.location;
      let capacity = req.payload.capacity;
      let isAvailable = req.payload.isAvailable;
      let searchText = req.payload.searchText;

      if (filter === undefined) {
        filter = {};
      }

      let offices = await OfficeResourceAccess.customSearch(
        filter,
        skip,
        limit,
        undefined,
        undefined,
        searchText,
      );

      if (offices) {

        resolve({ data: offices, total: offices.length });

      } else {
        resolve({ data: [], total: 0 });
      }
    } catch (e) {
      Logger.error(e);
      reject('failed');
    }
  });
}

async function updateById(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let officeId = req.payload.id;
      let officeData = req.payload.data;

      let office = await OfficeResourceAccess.findById(officeId);

      if (office) {
        let result = await OfficeResourceAccess.updateById(officeId, officeData);
        if (result) {
          resolve(result);
        } else {
          console.error(`Cannot update office id ${officeId}`);
          reject('failed');
        }
      } else {
        console.error(`Cannot find office id ${productId}`);
        reject('can not find office');
      }
    } catch (e) {
      Logger.error(e);
      reject('failed');
    }
  });
}

async function findById(req) {
  return new Promise(async (resolve, reject) => {
    try {

      let officeId = req.payload.id;
      console.log("findById", officeId)
      let result = await OfficeResourceAccess.findById(officeId);

      console.log("result", result[0])

      if (result && result.length > 0) {
        resolve(result);
      } else {
        console.error(`error office findById with id ${productId}: ${ERROR}`);
        reject('failed');
      }
    } catch (e) {
      Logger.error(e);
      reject('failed');
    }
  });
}

async function deleteById(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let id = req.payload.id;

      let result = await OfficeResourceAccess.deleteById(id);

      if (result) {
        resolve(result);
      }

      console.error(`error office deleteById with id ${id}: ${ERROR}`);
      reject('failed');
    } catch (e) {
      Logger.error(__filename, e);
      reject('failed');
    }
  });
}

module.exports = {
  insert,
  find,
  updateById,
  findById,
  deleteById,
};
