/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

'use strict';
require('dotenv').config();
const { DB, timestamps } = require('../../../config/database');
const Common = require('../../Common/resourceAccess/CommonResourceAccess');
const tableName = 'Office';
const primaryKeyField = 'officeId';
const Logger = require('../../../utils/logging');

async function createTable() {
  Logger.info('ResourceAccess', `createTable ${tableName}`);
  console.info(`create table ${tableName}`);
  return new Promise(async (resolve, reject) => {
    DB.schema.dropTableIfExists(`${tableName}`).then(() => {
      DB.schema
        .createTable(`${tableName}`, function (table) {
          table.increments(primaryKeyField).primary();
          table.string('officeName');
          table.text('officeDescription');
          table.text('location');
          table.integer('length'); //đơn vị m
          table.integer('width');
          table.integer('capacity'); // sức chứa người
          table.number('isAvailable').defaultTo(1);//Sẵn sàng sử dụng , true: có thể sử dụng
          table.number('isDeleted').defaultTo(0);
          timestamps(table);
          table.index('officeName');
          table.index('location');
          table.index('isAvailable');
        })
        .then(async () => {
          Logger.info(`${tableName}`, `${tableName} table created done`);
          seeding().then(() => {
            resolve();
          });
        });
    });
  });
}

async function seeding() {
  let seedingData = [
    {
      officeName: 'Phòng làm việc',
      officeDescription: "Đây là nơi nhân viên làm việc hàng ngày, được trang bị bàn làm việc, ghế, và các thiết bị cần thiết để thực hiện công việc.",
      location: 'A1, Tầng 1',
      length: 50,
      width: 50,
      capacity: 20,
      isAvailable: 1,
      isAvailable: 0,
    },
    {
      officeName: 'Phòng họp',
      officeDescription: "Đây là phòng được sử dụng để tổ chức các cuộc họp, đào tạo hoặc thảo luận nhóm. Phòng họp thường được trang bị bàn họp, ghế, trang thiết bị trình chiếu và các công cụ ghi chú.Đây là nơi nhân viên làm việc hàng ngày, được trang bị bàn làm việc, ghế, và các thiết bị cần thiết để thực hiện công việc.",
      location: 'A1, Tầng 2',
      length: 80,
      width: 80,
      capacity: 100,
      isAvailable: 1,
      isAvailable: 0,
    },
  ];

  return new Promise(async (resolve, reject) => {
    DB(`${tableName}`)
      .insert(seedingData)
      .then(result => {
        Logger.info(`${tableName}`, `seeding ${tableName}` + result);
        resolve();
      });
  });
}

async function initDB() {
  await createTable();
}

async function insert(data) {
  return await Common.insert(tableName, data);
}

async function updateById(id, data) {
  let dataId = {};
  dataId[primaryKeyField] = id;
  return await Common.updateById(tableName, dataId, data);
}
async function findById(id) {
  let dataId = {};
  dataId[primaryKeyField] = id;
  return await Common.findById(tableName, dataId, id);
}

function _makeQueryBuilderByFilter(filter, skip, limit, location, capacity, searchText) {
  let queryBuilder = DB(tableName);
  let filterData = filter ? JSON.parse(JSON.stringify(filter)) : {};

  if (searchText) {
    queryBuilder.where(function () {
      this.orWhere('officeName', 'like', `%${searchText}%`)
        .orWhere('officeDescription', 'like', `%${searchText}%`)
    });
  }

  if (location) {
    queryBuilder.where(function () {
      this.orWhere('location', 'like', `%${location}%`)
    });
  }

  if (capacity) {
    queryBuilder.where({ capacity: capacity });
  }

  queryBuilder.where(filterData);

  if (limit) {
    queryBuilder.limit(limit);
  }

  if (skip) {
    queryBuilder.offset(skip);
  }

  return queryBuilder;
}

async function customSearch(filter, skip, limit, location, capacity, searchText) {
  let query = _makeQueryBuilderByFilter(filter, skip, limit, location, capacity, searchText);
  return await query.select();
}

async function customCount(filter, skip, limit, location, capacity, searchText) {
  let query = _makeQueryBuilderByFilter(filter, skip, limit, location, capacity, searchText);
  return new Promise((resolve, reject) => {
    try {
      query.count(`${primaryKeyField} as count`).then(records => {
        resolve(records);
      });
    } catch (e) {
      Logger.error(
        'ResourceAccess',
        `DB COUNT ERROR: ${tableName} : ${JSON.stringify(filter)}}`,
      );
      Logger.error('ResourceAccess', e);
      reject(undefined);
    }
  });
}

async function find(filter, skip, limit) {
  return await Common.find(tableName, filter, skip, limit);
}

async function count(filter, order) {
  return await Common.count(tableName, primaryKeyField, filter, order);
}

async function deleteById(id) {
  let dataId = {};
  dataId[primaryKeyField] = id;
  return await Common.deleteById(tableName, dataId);
}

module.exports = {
  insert,
  find,
  findById,
  count,
  updateById,
  initDB,
  deleteById,
  customSearch,
  customCount,
};
