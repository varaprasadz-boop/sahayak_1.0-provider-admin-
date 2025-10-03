import { DatePipe, TitleCasePipe } from '@angular/common';
import { Injectable } from '@angular/core';
import numWords from 'num-words';
import { Booking } from 'src/app/models/booking.model';
import { User } from 'src/app/models/user';
@Injectable({
  providedIn: 'root',
})
export class InoviceService {
  public constructor(private date : DatePipe, private titleCase : TitleCasePipe) {}

  public generateInvoice(booking: any) : any {
    const invoice = {
      content: [
        {
          columns: [
            {
              image:
                'data:image/png;base64,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',
              width: 100,
            },
            [
              {
                text: 'Swayamkrushi Home Services LLP',
                color: '#333333',
                width: '*',
                fontSize: 13,
                bold: true,
                alignment: 'right',
                margin: [0, 0, 0, 5],
              },

              {
                stack: [
                  {
                    text: '2-22-128 Plot No. 12,',
                    color: '#aaaaab',
                    bold: true,
                    width: '*',
                    fontSize: 12,
                    alignment: 'right',
                  },
                  {
                    text: 'Rasoolpura,Secunderabad',
                    color: '#aaaaab',
                    bold: true,
                    width: '*',
                    fontSize: 12,
                    alignment: 'right',
                  },
                  {
                    text: 'Telangana - 500003',
                    color: '#aaaaab',
                    bold: true,
                    width: '*',
                    fontSize: 12,
                    alignment: 'right',
                  },
                  {
                    text: 'Phone No. : +91-73827 91500',
                    color: '#aaaaab',
                    bold: true,
                    width: '*',
                    fontSize: 12,
                    alignment: 'right',
                  },
                  {
                    text: 'E: support@sahayakonline.com',
                    color: '#aaaaab',
                    bold: true,
                    width: '*',
                    fontSize: 12,
                    alignment: 'right',
                  },
                ],
              },
            ],
          ],
        },
        {
          canvas: [
            {
              type: 'line',
              x1: 0,
              y1: 15,
              x2: 520,
              y2: 15,
              lineWidth: 30,
              color: '#aaaaab',
            },
          ],
        },

        {
          columns: [
            {
              text: 'Customer Invoice No: INV-' + booking.bookingId,
              color: '#000000',
              margin: [0, 12, 10, 20],
              bold: true,
              width: '*',
              fontSize: 12,
              alignment: 'left',
            },
            {
              text: 'Invoice Date : ' + this.date.transform(booking.date, 'dd-MM-yyyy'),
              color: '#000000',
              margin: [0, 12, 10, 20],
              bold: true,
              width: '*',
              fontSize: 12,
              alignment: 'right',
            },
          ],
        },

        {
          columns: [
            {
              text: 'To:',
              color: '#000000',
              bold: true,
              fontSize: 14,
              alignment: 'left',
              margin: [0, 0, 0, 5],
            },
          ],
        },
        {
          columns: [
            {
              text: this.titleCase.transform(booking.customerName) + ', \n ' + booking.address.location + ',' + '\n ' + booking.address.landmark,
              bold: true,
              color: '#333333',
              alignment: 'left',
            },
          ],
        },
        '\n\n',
        {
          layout: {
            defaultBorder: true,
            hLineWidth: function (i, node) {
              return 1;
            },
            vLineWidth: function (i, node) {
              return 1;
            },
            hLineColor: function (i, node) {
              if (i === 1 || i === 0) {
                return '#000';
              }
              return '#000';
            },
            vLineColor: function (i, node) {
              return '#000';
            },
            hLineStyle: function (i, node) {
              // if (i === 0 || i === node.table.body.length) {
              return null;
              //}
            },
            // vLineStyle: function (i, node) { return {dash: { length: 10, space: 4 }}; },
            paddingLeft: function (i, node) {
              return 10;
            },
            paddingRight: function (i, node) {
              return 10;
            },
            paddingTop: function (i, node) {
              return 2;
            },
            paddingBottom: function (i, node) {
              return 2;
            },
            fillColor: function (rowIndex, node, columnIndex) {
              return '#fff';
            },
          },
          table: {
            headerRows: 1,
            widths: ['*', 'auto', 'auto', 'auto'],
            body: [
              [
                {
                  text: 'Particulars',
                  fontSize: 14,
                  bold: true,
                  fillColor: '#fff',
                  border: [true, true, true, true],
                  margin: [0, 5, 0, 5],
                  textTransform: 'uppercase',
                },
                {
                  text: 'Units',
                  fontSize: 14,
                  bold: true,
                  fillColor: '#fff',
                  border: [true, true, true, true],
                  margin: [0, 5, 0, 5],
                  textTransform: 'uppercase',
                  alignment: 'right',
                },
                {
                  text: 'Base Rate',
                  fontSize: 14,
                  bold: true,
                  fillColor: '#fff',
                  border: [true, true, true, true],
                  margin: [0, 5, 0, 5],
                  textTransform: 'uppercase',
                  alignment: 'right',
                },
                {
                  text: 'Total',
                  fontSize: 14,
                  bold: true,
                  fillColor: '#fff',
                  border: [true, true, true, true],
                  margin: [0, 5, 0, 5],
                  textTransform: 'uppercase',
                  alignment: 'right',
                },
              ],
              [
                {
                  text: booking.service.name,
                  border: [true, true, true, true],
                  margin: [0, 5, 0, 5],
                  alignment: 'left',
                },
                {
                  text: '1',
                  border: [true, true, true, true],
                  fillColor: '#fff',
                  alignment: 'right',
                  margin: [0, 5, 0, 5],
                },
                {
                  text: '₹'+booking.service.price,
                  border: [true, true, true, true],
                  fillColor: '#fff',
                  alignment: 'right',
                  margin: [0, 5, 0, 5],
                },
                {
                  text: '₹' + booking.service.price,
                  border: [true, true, true, true],
                  fillColor: '#fff',
                  alignment: 'right',
                  margin: [0, 5, 0, 5],
                },
              ],
            ],
          },
        },
        {
          columns: [
            {
              table: {
                widths: ['107%'],
                body: [
                  [
                    {
                      stack: [
                        {
                          text: 'Payment Method:',
                          bold: true,
                          fontSize: 14,
                          alignment: 'left',
                          margin: [6, 1, 0, 5],
                        },
                        {
                          text: booking.paymentType == 'Phonepe' ? 'Payment Method:' + booking.paymentType + ' \n \n \nTRANSFER ID:' + booking.transactionId : booking.paymentType+'\n \n \n \n',
                        //   text: 'BANK NAME: ICICI\nACCOUNT HOLDER NAME: Provider\nACCOUNT NUMBER: ICICI23847237\nTRANSFER ID:',
                          alignment: 'left',
                          margin: [20, 5, 0, 5],
                        },
                      ],
                      border: [true, false, false, true], // Border for all sides
                      margin: [0, 7], // Adjust margin as needed
                    },
                  ],
                ],
              },
            },
            {
              width: '42.71%',
              stack: [
                {
                  layout: {
                    defaultBorder: true,
                    hLineWidth: function (i, node) {
                      return 1;
                    },
                    vLineWidth: function (i, node) {
                      return 1;
                    },
                    hLineColor: function (i, node) {
                      return '#000';
                    },
                    vLineColor: function (i, node) {
                      return '#000';
                    },
                    paddingLeft: function (i, node) {
                      return 12;
                    },
                    paddingRight: function (i, node) {
                      return 10;
                    },
                    paddingTop: function (i, node) {
                      return 3;
                    },
                    paddingBottom: function (i, node) {
                      return 3;
                    },
                    fillColor: function (rowIndex, node, columnIndex) {
                      return '#fff';
                    },
                  },
                  table: {
                    headerRows: 1,
                    widths: ['*', 'auto'],
                    body: [
                      [
                        {
                          text: 'Subtotal',
                          border: [true, false, false, false],
                          alignment: 'right',
                          margin: [0, 20, 0, 0],
                        },
                        {
                          text: '₹' + booking.service.price,
                          border: [false, false, true, false],
                          alignment: 'right',
                          fillColor: '#fff',
                          margin: [0, 20, 0, 0],
                        },
                      ],
                      // [
                      //   {
                      //     text: 'GST',
                      //     border: [true, false, false, false],
                      //     alignment: 'right',
                      //     margin: [0, 0, 0, 0],
                      //   },
                      //   {
                      //     text: '0%',
                      //     border: [false, false, true, false],
                      //     fillColor: '#fff',
                      //     alignment: 'right',
                      //     margin: [0, 0, 0, 0],
                      //   },
                      // ],
                      [
                        {
                          text: 'Total (Inclusive of 18% tax)',
                          bold: true,
                          fontSize: 10.6,
                          alignment: 'right',
                          border: [true, false, false, true],
                          margin: [0, 25, 0, 20.7],
                        },
                        {
                          text: '₹' + booking.service.price,
                          bold: true,
                          alignment: 'right',
                          border: [false, false, true, true],
                          fillColor: '#fff',
                          margin: [0, 25, 0, 20.7],
                        },
                      ],
                    ],
                  },
                },
              ],
            },
          ],
        },
        {
          table: {
            widths: ['*', 137], // '*' for auto width, 'auto' for content-based width
            body: [
              [
                {
                  text: 'Amount In Words : ' + this.titleCase.transform(numWords(+booking.service.price)),
                  bold: true,
                  fontSize: 10.6,
                  alignment: 'left',
                  border: [true, false, false, true],
                  margin: [10, 10, 0, 10],
                },
                {
                  text: 'Total :            ₹' + booking.service.price,
                  bold: true,
                  border: [true, false, true, true],
                  alignment: 'right',
                  margin: [0, 10, 10, 10],
                },
              ],
            ],
            layout: 'noBorders', // Optional: Removes borders around the table cells
          },
        },
        {
          text: 'Note :',
          bold: true,
          fontSize: 16,
          border: [true, false, true, true],
          alignment: 'leeft',
          margin: [10, 30, 10, 10],
        },
        {
          // to treat a paragraph as a bulleted list, set an array of items under the ul key
          ul: [
            {
              text: 'All Amount are in Indian Currency (INR)',
              bold: false,
              margin: [30, 0, 0, 0],
            },
            {
              text: 'Your feedback will help us provide quality service.',
              bold: false,
              margin: [30, 0, 0, 0],
            },
            {
              text: 'Kindly leave a feedback on the service once it is completed',
              bold: false,
              margin: [30, 0, 0, 0],
            },
            {
              text: 'SGST and CGST rates may vary as per Government guidelines.',
              bold: false,
              margin: [30, 0, 0, 0],
            },
            {
              text: 'You can write to use for any queries - support@sahayakonline.com',
              bold: false,
              margin: [30, 0, 0, 0],
            },
            {
              text: 'Thank you for using Sahayak service by doing so you have helped our cause.',
              bold: false,
              margin: [30, 0, 0, 0],
            },
            {
              text: 'Read more - bit.ly/Sahayak',
              bold: false,
              margin: [30, 0, 0, 0],
            },
          ],
        },
      ],
      defaultStyle: {
        columnGap: 20,
      },
      images: {
        sahayak_logo: 'path/to/sahayak_logo.png', // Replace with the path to your logo image
      },
    };
    return invoice;
  }
  public generateProviderInvoice(booking: any, agent:User) : any {
    console.log(agent);
    const invoice = {
      content: [
        {
          columns: [
            {
              image:
                'data:image/png;base64,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',
              width: 100,
            },
            [
              {
                text: 'Swayamkrushi Home Services LLP',
                color: '#333333',
                width: '*',
                fontSize: 13,
                bold: true,
                alignment: 'right',
                margin: [0, 0, 0, 5],
              },

              {
                stack: [
                  {
                    text: '2-22-128 Plot No. 12,',
                    color: '#aaaaab',
                    bold: true,
                    width: '*',
                    fontSize: 12,
                    alignment: 'right',
                  },
                  {
                    text: 'Rasoolpura,Secunderabad',
                    color: '#aaaaab',
                    bold: true,
                    width: '*',
                    fontSize: 12,
                    alignment: 'right',
                  },
                  {
                    text: 'Telangana - 500003',
                    color: '#aaaaab',
                    bold: true,
                    width: '*',
                    fontSize: 12,
                    alignment: 'right',
                  },
                  {
                    text: 'Phone No. : +91-73827 91500',
                    color: '#aaaaab',
                    bold: true,
                    width: '*',
                    fontSize: 12,
                    alignment: 'right',
                  },
                  {
                    text: 'E: support@sahayakonline.com',
                    color: '#aaaaab',
                    bold: true,
                    width: '*',
                    fontSize: 12,
                    alignment: 'right',
                  },
                ],
              },
            ],
          ],
        },
        {
          canvas: [
            {
              type: 'line',
              x1: 0,
              y1: 15,
              x2: 520,
              y2: 15,
              lineWidth: 30,
              color: '#aaaaab',
            },
          ],
        },

        {
          columns: [
            {
              text: 'Customer Invoice No: INVP-' + booking.bookingId,
              color: '#000000',
              margin: [0, 12, 10, 20],
              bold: true,
              width: '*',
              fontSize: 12,
              alignment: 'left',
            },
            {
              text: 'Invoice Date : ' + this.date.transform(booking.date, 'dd-MM-yyyy'),
              color: '#000000',
              margin: [0, 12, 10, 20],
              bold: true,
              width: '*',
              fontSize: 12,
              alignment: 'right',
            },
          ],
        },

        {
          columns: [
            {
              text: 'To:',
              color: '#000000',
              bold: true,
              fontSize: 14,
              alignment: 'left',
              margin: [0, 0, 0, 5],
            },
          ],
        },
        {
          columns: [
            {
              text: this.titleCase.transform(agent.name)+ ', \n ' + agent.location + ',' + '\n ',
              bold: true,
              color: '#333333',
              alignment: 'left',
            },
          ],
        },
        '\n\n',
        {
          layout: {
            defaultBorder: true,
            hLineWidth: function (i, node) {
              return 1;
            },
            vLineWidth: function (i, node) {
              return 1;
            },
            hLineColor: function (i, node) {
              if (i === 1 || i === 0) {
                return '#000';
              }
              return '#000';
            },
            vLineColor: function (i, node) {
              return '#000';
            },
            hLineStyle: function (i, node) {
              // if (i === 0 || i === node.table.body.length) {
              return null;
              //}
            },
            // vLineStyle: function (i, node) { return {dash: { length: 10, space: 4 }}; },
            paddingLeft: function (i, node) {
              return 10;
            },
            paddingRight: function (i, node) {
              return 10;
            },
            paddingTop: function (i, node) {
              return 2;
            },
            paddingBottom: function (i, node) {
              return 2;
            },
            fillColor: function (rowIndex, node, columnIndex) {
              return '#fff';
            },
          },
          table: {
            headerRows: 1,
            widths: ['*', 'auto', 'auto', 'auto'],
            body: [
              [
                {
                  text: 'Particulars',
                  fontSize: 14,
                  bold: true,
                  fillColor: '#fff',
                  border: [true, true, true, true],
                  margin: [0, 5, 0, 5],
                  textTransform: 'uppercase',
                },
                {
                  text: 'Units',
                  fontSize: 14,
                  bold: true,
                  fillColor: '#fff',
                  border: [true, true, true, true],
                  margin: [0, 5, 0, 5],
                  textTransform: 'uppercase',
                  alignment: 'right',
                },
                {
                  text: 'Base Rate',
                  fontSize: 14,
                  bold: true,
                  fillColor: '#fff',
                  border: [true, true, true, true],
                  margin: [0, 5, 0, 5],
                  textTransform: 'uppercase',
                  alignment: 'right',
                },
                {
                  text: 'Total',
                  fontSize: 14,
                  bold: true,
                  fillColor: '#fff',
                  border: [true, true, true, true],
                  margin: [0, 5, 0, 5],
                  textTransform: 'uppercase',
                  alignment: 'right',
                },
              ],
              [
                {
                  text: booking.service.name,
                  border: [true, true, true, true],
                  margin: [0, 5, 0, 5],
                  alignment: 'left',
                },
                {
                  text: '1',
                  border: [true, true, true, true],
                  fillColor: '#fff',
                  alignment: 'right',
                  margin: [0, 5, 0, 5],
                },
                {
                  text: '₹'+booking.service.price,
                  border: [true, true, true, true],
                  fillColor: '#fff',
                  alignment: 'right',
                  margin: [0, 5, 0, 5],
                },
                {
                  text: '₹' + booking.service.price,
                  border: [true, true, true, true],
                  fillColor: '#fff',
                  alignment: 'right',
                  margin: [0, 5, 0, 5],
                },
              ],
            ],
          },
        },
        {
          columns: [
            {
              table: {
                widths: ['107%'],
                body: [
                  [
                    {
                      stack: [
                        {
                          text: 'Payment Method:',
                          bold: true,
                          fontSize: 14,
                          alignment: 'left',
                          margin: [6, 1, 0, 5],
                        },
                        {
                          // text:  booking.paymentType+'\n  \n \n',
                          text: 'BANK NAME: '+ agent.bankName +'\nACCOUNT HOLDER NAME: '+ agent.accountHolderName +'\nACCOUNT NUMBER: '+ agent.accountNumber +'\nTRANSFER ID: ' + booking.transferID,
                          alignment: 'left',
                          margin: [20, 5, 0, 5],
                        },
                      ],
                      border: [true, false, false, true], // Border for all sides
                      margin: [0, 7], // Adjust margin as needed
                    },
                  ],
                ],
              },
            },
            {
              width: '42.71%',
              stack: [
                {
                  layout: {
                    defaultBorder: true,
                    hLineWidth: function (i, node) {
                      return 1;
                    },
                    vLineWidth: function (i, node) {
                      return 1;
                    },
                    hLineColor: function (i, node) {
                      return '#000';
                    },
                    vLineColor: function (i, node) {
                      return '#000';
                    },
                    paddingLeft: function (i, node) {
                      return 12;
                    },
                    paddingRight: function (i, node) {
                      return 10;
                    },
                    paddingTop: function (i, node) {
                      return 3;
                    },
                    paddingBottom: function (i, node) {
                      return 3;
                    },
                    fillColor: function (rowIndex, node, columnIndex) {
                      return '#fff';
                    },
                  },
                  table: {
                    headerRows: 1,
                    widths: ['*', 'auto'],
                    body: [
                      [
                        {
                          text: 'Subtotal',
                          border: [true, false, false, false],
                          alignment: 'right',
                          margin: [0, 10, 0, 0],
                        },
                        {
                          text: '₹' + booking.service.price,
                          border: [false, false, true, false],
                          alignment: 'right',
                          fillColor: '#fff',
                          margin: [0, 10, 0, 0],
                        },
                      ],
                      [
                        {
                          text: 'Admin Commission (%)',
                          fontSize: 10.6,
                          border: [true, false, false, false],
                          alignment: 'right',
                          margin: [0, 5, 0, 0],
                        },
                        {
                          text: booking.service.commission + '%',
                          border: [false, false, true, false],
                          fillColor: '#fff',
                          alignment: 'right',
                          margin: [0, 5, 0, 0],
                        },
                      ],
                      [
                        {
                          text: 'Total Earning',
                          bold: true,
                          fontSize: 10.6,
                          alignment: 'right',
                          border: [true, false, false, true],
                          margin: [0, 10, 0, 20.7],
                        },
                        {
                          text: '₹' + booking.agentPaymentPaid,
                          bold: true,
                          alignment: 'right',
                          border: [false, false, true, true],
                          fillColor: '#fff',
                          margin: [0, 10, 0, 20.7],
                        },
                      ],
                    ],
                  },
                },
              ],
            },
          ],
        },
        {
          table: {
            widths: ['*', 137], // '*' for auto width, 'auto' for content-based width
            body: [
              [
                {
                  text: 'Amount In Words : ' + this.titleCase.transform(numWords(+booking.agentPaymentPaid)),
                  bold: true,
                  fontSize: 10.6,
                  alignment: 'left',
                  border: [true, false, false, true],
                  margin: [10, 10, 0, 10],
                },
                {
                  text: 'Total :            ₹' + booking.agentPaymentPaid,
                  bold: true,
                  border: [true, false, true, true],
                  alignment: 'right',
                  margin: [0, 10, 10, 10],
                },
              ],
            ],
            layout: 'noBorders', // Optional: Removes borders around the table cells
          },
        },
        {
          text: 'Note :',
          bold: true,
          fontSize: 16,
          border: [true, false, true, true],
          alignment: 'leeft',
          margin: [10, 30, 10, 10],
        },
        {
          // to treat a paragraph as a bulleted list, set an array of items under the ul key
          ul: [
            {
              text: 'All Amount are in Indian Currency (INR)',
              bold: false,
              margin: [30, 0, 0, 0],
            },
            {
              text: 'Your feedback will help us provide quality service.',
              bold: false,
              margin: [30, 0, 0, 0],
            },
            {
              text: 'Kindly leave a feedback on the service once it is completed',
              bold: false,
              margin: [30, 0, 0, 0],
            },
            {
              text: 'SGST and CGST rates may vary as per Government guidelines.',
              bold: false,
              margin: [30, 0, 0, 0],
            },
            {
              text: 'You can write to use for any queries - support@sahayakonline.com',
              bold: false,
              margin: [30, 0, 0, 0],
            },
            {
              text: 'Thank you for using Sahayak service by doing so you have helped our cause.',
              bold: false,
              margin: [30, 0, 0, 0],
            },
            {
              text: 'Read more - bit.ly/Sahayak',
              bold: false,
              margin: [30, 0, 0, 0],
            },
          ],
        },
      ],
      defaultStyle: {
        columnGap: 20,
      },
      images: {
        sahayak_logo: 'path/to/sahayak_logo.png', // Replace with the path to your logo image
      },
    };
    return invoice;
  }
}
