
const Office = require('./OfficeRoute');

module.exports = [
  //Office APIs
  { method: 'POST', path: '/Office/insert', config: Office.insert }, //C
  { method: 'POST', path: '/Office/find', config: Office.find },//R
  { method: 'POST', path: '/Office/findById', config: Office.findById },//R
  { method: 'POST', path: '/Office/updateById', config: Office.updateById },// U
  { method: 'POST', path: '/Office/deleteById', config: Office.deleteById }, //D
];
