global.window = {document: {createElementNS: () => {return {}} }};
global.navigator = {};
global.html2pdf = {};
global.btoa = () => {};

const fs = require('fs')
const { jsPDF } = require("jspdf");
const { autoTable } = require("jspdf-autotable");
let doc = new jsPDF('p');

const invoiceGenerator = ({ id, name, currency, amount, city, country }) => {

  var currency_symbols = {
    'USD': '$', // US Dollar
    'EUR': '€', // Euro
    'CRC': '₡', // Costa Rican Colón
    'GBP': '£', // British Pound Sterling
    'ILS': '₪', // Israeli New Sheqel
    'INR': '₹', // Indian Rupee
    'JPY': '¥', // Japanese Yen
    'KRW': '₩', // South Korean Won
    'NGN': '₦', // Nigerian Naira
    'PHP': '₱', // Philippine Peso
    'PLN': 'zł', // Polish Zloty
    'PYG': '₲', // Paraguayan Guarani
    'THB': '฿', // Thai Baht
    'UAH': '₴', // Ukrainian Hryvnia
    'VND': '₫', // Vietnamese Dong
  };

  doc.autoTable({
      body: [
        [
          {
            content: 'PawsN\'Claws',
            styles: {
              halign: 'left',
              fontSize: 20,
              textColor: '#ffffff'
            }
          },
          {
            content: 'Invoice',
            styles: {
              halign: 'right',
              fontSize: 20,
              textColor: '#ffffff'
            }
          }
        ],
      ],
      theme: 'plain',
      styles: {
        fillColor: '#3366ff'
      }
    });

    const currentDay = new Date();
    doc.autoTable({
      body: [
        [
          {
            content: 'Reference: #INV0001'
            +`\nDate: ${currentDay.getFullYear()}-${currentDay.getMonth()}-${ currentDay.getDate()}`
            +'\nInvoice number: 123456',
            styles: {
              halign: 'right'
            }
          }
        ],
      ],
      theme: 'plain'
    });

    doc.autoTable({
      body: [
        [
          {
            content: 'From:'
            +'\nPawsN\'Claws'
            +'\nJaipur'
            +'\nIndia',
            styles: {
              halign: 'left'
            }
          },
          {
            content: 'Billed To:'
            +`\n${name}`
            +`\n${city}`
            +`\n${country}`,
            styles: {
              halign: 'right'
            }
          }
        ],
      ],
      theme: 'plain'
    });

    doc.autoTable({
      body: [
        [
          {
            content: 'Amount paid:',
            styles: {
              halign:'right',
              fontSize: 14
            }
          }
        ],
        [
          {
            content: `${currency_symbols[currency] }${amount}`,
            styles: {
              halign:'right',
              fontSize: 20,
              textColor: '#3366ff'
            }
          }
        ],
      ],
      theme: 'plain'
    });

    const data = doc.output()
    const paymentId = id.toString();
    const filename = `invoice_${paymentId.substring(paymentId.length - 4)}_${Date.now()}.pdf`;
    const filePath = `./invoices/${filename}`;
    fs.writeFileSync(filePath, data, 'binary')
    return filePath;
  }

delete global.window;
delete global.html2pdf;
delete global.navigator;
delete global.btoa;

module.exports = invoiceGenerator;
  