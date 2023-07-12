/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

const faker = require('faker');
const chai = require('chai');
const chaiHttp = require('chai-http');
// const fs = require('fs');

const { checkResponseStatus } = require('../../Common/test/Common');
const TestFunctions = require('../../Common/test/CommonTestFunctions');

chai.should();
chai.use(chaiHttp);
chai.use(chaiHttp);

const app = require('../../../server');

describe(`Tests Office`, () => {
  let staffToken = '';
  let userToken = '';
  let id;
  before(done => {
    new Promise(async (resolve, reject) => {
      let staffData = await TestFunctions.loginStaff();
      staffToken = staffData.token;
      let userData = await TestFunctions.loginUser();
      userToken = userData.token;
      console.log("userToken", userToken)
      resolve();
    }).then(() => done());
  });

  it('insert Office', done => {
    const body = {
      officeName: "Văn phòng họp 2",
      officeDescription: "Đây là nơi nhân viên làm việc hàng ngày, được trang bị bàn làm việc, ghế, và các thiết bị cần thiết để thực hiện công việc.",
      location: "A1 -Tầng 1",
      length: 50,
      width: 50,
      capacity: 50,
      isAvailable: 1,
      isDeleted: 0
    };
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/Office/insert`)
      .set('Authorization', `Bearer ${staffToken}`)
      .send(body)
      .end((err, res) => {
        if (err) {
          console.error(err);
        }
        checkResponseStatus(res, 200);
        id = res.body.data[0];
        done();
      });
  });

  // it('find Office', done => {
  //   const body = {};
  //   chai
  //     .request(`0.0.0.0:${process.env.PORT}`)
  //     .post(`/Office/find`)
  //     .set('Authorization', `Bearer ${staffToken}`)
  //     .send(body)
  //     .end((err, res) => {
  //       if (err) {
  //         console.error(err);
  //       }
  //       checkResponseStatus(res, 200);
  //       done();
  //     });
  // });

  // it('update Office', done => {
  //   const body = {
  //     id: id,
  //     data: {
  //       officeName: "officeName",
  //     },
  //   };

  //   chai
  //     .request(`0.0.0.0:${process.env.PORT}`)
  //     .post(`/Office/updateById`)
  //     .set('Authorization', `Bearer ${staffToken}`)
  //     .send(body)
  //     .end((err, res) => {
  //       if (err) {
  //         console.error(err);
  //       }
  //       checkResponseStatus(res, 200);
  //       done();
  //     });
  // });

  // it('delete Office', done => {
  //   const body = {
  //     id: id,
  //   };

  //   chai
  //     .request(`0.0.0.0:${process.env.PORT}`)
  //     .post(`/Office/deleteById`)
  //     .set('Authorization', `Bearer ${staffToken}`)
  //     .send(body)
  //     .end((err, res) => {
  //       if (err) {
  //         console.error(err);
  //       }
  //       checkResponseStatus(res, 200);
  //       done();
  //     });
  // });
});
