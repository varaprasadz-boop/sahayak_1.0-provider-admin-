import { Injectable } from '@angular/core';
import numWords from 'num-words';

// Define a type for the PDFMake node/table context
type TableLayoutNode = {
  table: {
    body: any[];
  };
};

@Injectable({
  providedIn: 'root',
})
export class NewInvoice {
  public constructor() {}

  public generateInvoice(booking: Booking, displayName: any): any {
    // --- Data Logic: USING BOOKING INTERFACE DATA ---
    const finalTotalAmount = +booking.service.price; 
    
    // Split GST (18%) into CGST and SGST (9% each)
    const gstRate = 0.18; // Total GST rate
    const cgstRate = gstRate / 2; // 0.09
    const sgstRate = gstRate / 2; // 0.09
    
    const taxableValue = finalTotalAmount / (1 + gstRate); // Base value before tax
    const cgstAmount = taxableValue * cgstRate;
    const sgstAmount = taxableValue * sgstRate;
    const discount = 0; 
    
    // --- Invoice Styling & Helpers ---
    const formatCurrency = (amount: number) => {
      // Ensure precise currency formatting for display
      return amount.toFixed(2);
    };

    const numToWords = (amount: number, round: boolean = false) => {
      // For GST, we typically want to round the "words" amount, so rounding is passed to true for tax amounts
      const roundedAmount = round ? Math.round(amount) : Math.floor(amount);
      if (roundedAmount < 0) return 'zero rupees only';
      
      const words = numWords(roundedAmount);
      return `${words} rupees only`;
    };

    const lineStyle = {
      color: '#e0e0e0',
      width: 0.5,
    };
    
    const headerBgColor = '#f5f5f5';

    // --- Company Details: SAHAYAK / SWAYAMKRUSHI HOME SERVICES Limited ---
    // Image base64 strings are kept empty as requested.
    const logoBase64 = '' // Removed image
    const signatureBase64 = '' // Removed image
    
    // Updated Company/Provider Details to Swayamkrushi/Sahayak
    const companyNameHeader = 'SAHAYAK';
    const ucGstin = '36AFJFS1058Q1ZB'; // Keeping original placeholder GSTIN
    const ucAddressLine1 = '2-22-128, Rasoolpura,'; // Updated address from image
    const ucAddressLine2 = 'Secunderabad - 500 003'; // Updated address from image
    const ucState = 'Telangana 36'; // Updated state based on address
    const ucBusinessName = 'Swayamkrushi Home Services Limited'; // Updated legal business name
    const ucSAC = '999799'; // Keeping original placeholder SAC
    
    // --- Dynamic Booking Data Mapped to Invoice Fields ---
    const invoiceNo = booking.bookingId || 'N/A';
    const ucInvoiceDate = booking.date;
    const serviceName = booking.service.name;

    // --- CUSTOMER ADDRESS MAPPING ---
    const customerAddress = booking.address;
    const customerAddressLines: string[] = [];
    
    // 1. Flat/House number
    if (customerAddress.flat) customerAddressLines.push(customerAddress.flat);

    // 2. Apartment/Building Name
    if (customerAddress.appartment) customerAddressLines.push(customerAddress.appartment);
    
    // 3. Locality/Landmark
    if (customerAddress.locality) customerAddressLines.push(customerAddress.locality);
    if (customerAddress.landmark) customerAddressLines.push(`Near: ${customerAddress.landmark}`);

    // 4. Area, City, and Pincode
    const cityAreaPincode = `${customerAddress.areaName || ''}, ${customerAddress.cityName || ''}, ${customerAddress.pincode || ''}`;
    if (cityAreaPincode.trim() !== ', ,') customerAddressLines.push(cityAreaPincode);

    // --- ASSUMED STATE DATA (Reverted to hardcoded due to missing fields in Address) ---
    const customerStateNameAndCode = 'Telangana 36';
    const customerPlaceOfSupply = 'Telangana';
    
    // --- PDFMake Structure ---
    const invoice = {
      // Reduced page margins
      pageSize: 'A4',
      pageMargins: [30, 30, 30, 30], 
      content: [
        // --- Header Section ---
        {
          columns: [
            // Left: Company Name (SAHAYAK) and Address (Replacing Logo)
            {
              width: 200,
              stack: [
                {
                  text: companyNameHeader, // Display SAHAYAK prominently
                  fontSize: 18,
                  bold: true,
                  margin: [0, 0, 0, 2], // Reduced margin
                  color: '#005a8d',
                },
                {
                    text: ucBusinessName, // Legal Name
                    fontSize: 9,
                    bold: true,
                    margin: [0, 0, 0, 1], // Reduced margin
                },
                // Company Address
                {
                  text: ucAddressLine1,
                  fontSize: 8,
                },
                {
                  text: ucAddressLine2,
                  fontSize: 8,
                  border: [false, false, false, true],
                  borderColor: [lineStyle.color, lineStyle.color, lineStyle.color, lineStyle.color],
                  margin: [0, 0, 0, 1],
                },
                {
                  text: `GSTIN: ${ucGstin}`,
                  fontSize: 8,
                  margin: [0, 3, 0, 5], // Reduced margin
                },
              ],
            },
            // Right: ORIGINAL TAX INVOICE
            {
              width: '*',
              stack: [
                {
                  text: 'ORIGINAL TAX INVOICE',
                  fontSize: 16,
                  bold: true,
                  alignment: 'right',
                },
              ],
            },
          ],
          margin: [0, 0, 0, 10], // Reduced margin
        },

        // --- Customer and Service Provider Info Section ---
        {
          columns: [
            // Left Column: Customer Details
            {
              width: '48%',
              stack: [
                // Customer Name (Using displayName)
                { text: 'Customer Name', fontSize: 9, bold: true, margin: [0, 0, 0, 1] },
                {
                  text: displayName,
                  fontSize: 9,
                  margin: [0, 0, 0, 3], // Reduced margin
                  border: [false, false, false, true],
                  borderColor: [lineStyle.color, lineStyle.color, lineStyle.color, lineStyle.color],
                  lineHeight: 1.2, // Reduced line height
                },

                // Invoice no. (Using booking.bookingId)
                { text: 'Invoice no.', fontSize: 9, bold: true, margin: [0, 3, 0, 1] }, // Reduced margin
                {
                  text: invoiceNo,
                  fontSize: 9,
                  margin: [0, 0, 0, 3], // Reduced margin
                  border: [false, false, false, true],
                  borderColor: [lineStyle.color, lineStyle.color, lineStyle.color, lineStyle.color],
                  lineHeight: 1.2, // Reduced line height
                },

                // Delivery Address (USING BOOKING.ADDRESS)
                { text: 'Delivery Address', fontSize: 9, bold: true, margin: [0, 3, 0, 1] }, // Reduced margin
                {
                  // Map the constructed customerAddressLines array
                  stack: customerAddressLines.map((line) => ({
                    text: line,
                    fontSize: 9,
                    margin: [0, 0, 0, 0],
                  })),
                  margin: [0, 0, 0, 3], // Reduced margin
                  border: [false, false, false, true],
                  borderColor: [lineStyle.color, lineStyle.color, lineStyle.color, lineStyle.color],
                  lineHeight: 1.2,
                },

                // Invoice Date (Using booking.date)
                { text: 'Invoice Date', fontSize: 9, bold: true, margin: [0, 3, 0, 1] }, // Reduced margin
                {
                  text: ucInvoiceDate,
                  fontSize: 9,
                  margin: [0, 0, 0, 3], // Reduced margin
                  border: [false, false, false, true],
                  borderColor: [lineStyle.color, lineStyle.color, lineStyle.color, lineStyle.color],
                  lineHeight: 1.2, // Reduced line height
                },

                // State Name & Code (USING HARDCODED VALUE)
                { text: 'State Name & Code', fontSize: 9, bold: true, margin: [0, 3, 0, 1] }, // Reduced margin
                {
                  text: customerStateNameAndCode, 
                  fontSize: 9,
                  margin: [0, 0, 0, 3], // Reduced margin
                  border: [false, false, false, true],
                  borderColor: [lineStyle.color, lineStyle.color, lineStyle.color, lineStyle.color],
                  lineHeight: 1.2, // Reduced line height
                },

                // Place of Supply (USING HARDCODED VALUE)
                { text: 'Place of Supply', fontSize: 9, bold: true, margin: [0, 3, 0, 1] }, // Reduced margin
                {
                  text: customerPlaceOfSupply,
                  fontSize: 9,
                  margin: [0, 0, 0, 0],
                  border: [false, false, false, true],
                  borderColor: [lineStyle.color, lineStyle.color, lineStyle.color, lineStyle.color],
                  lineHeight: 1.2, // Reduced line height
                },
              ],
            },
            { width: '4%', text: '' },

            // Right Column: Delivery Service Provider Details - ALIGNED RIGHT
            {
              width: '48%',
              alignment: 'right',
              stack: [
                {
                  text: 'DELIVERY SERVICE PROVIDER',
                  fontSize: 9,
                  bold: true,
                  margin: [0, 0, 0, 3], // Reduced margin
                },
                // Updated provider details
                { text: 'Business GSTIN', fontSize: 9, bold: true, margin: [0, 0, 0, 1] },
                {
                  text: ucGstin,
                  fontSize: 9,
                  margin: [0, 0, 0, 3], // Reduced margin
                  border: [false, false, false, true],
                  borderColor: [lineStyle.color, lineStyle.color, lineStyle.color, lineStyle.color],
                  lineHeight: 1.2, // Reduced line height
                },
                { text: 'Business Name', fontSize: 9, bold: true, margin: [0, 3, 0, 1] }, // Reduced margin
                {
                  text: ucBusinessName,
                  fontSize: 9,
                  margin: [0, 0, 0, 3], // Reduced margin
                  border: [false, false, false, true],
                  borderColor: [lineStyle.color, lineStyle.color, lineStyle.color, lineStyle.color],
                  lineHeight: 1.2, // Reduced line height
                },
                { text: 'Address', fontSize: 9, bold: true, margin: [0, 3, 0, 1] }, // Reduced margin
                { text: ucAddressLine1, fontSize: 9, margin: [0, 0, 0, 0] },
                {
                  text: ucAddressLine2,
                  fontSize: 9,
                  margin: [0, 0, 0, 3], // Reduced margin
                  border: [false, false, false, true],
                  borderColor: [lineStyle.color, lineStyle.color, lineStyle.color, lineStyle.color],
                  lineHeight: 1.2, // Reduced line height
                },
                { text: 'State Name & Code', fontSize: 9, bold: true, margin: [0, 3, 0, 1] }, // Reduced margin
                {
                  text: ucState,
                  fontSize: 9,
                  margin: [0, 0, 0, 0],
                  border: [false, false, false, true],
                  borderColor: [lineStyle.color, lineStyle.color, lineStyle.color, lineStyle.color],
                  lineHeight: 1.2, // Reduced line height
                },
              ],
            },
          ],
          margin: [0, 0, 0, 10], // Reduced margin
        },

        // --- Items and Total Table ---
        {
          table: {
            headerRows: 1,
            widths: ['*', 100],
            body: [
              // Table Header
              [
                {
                  text: 'Items',
                  fontSize: 10,
                  bold: true,
                  fillColor: headerBgColor,
                  border: [false, false, false, true],
                  borderColor: [lineStyle.color, lineStyle.color, lineStyle.color, lineStyle.color],
                  margin: [0, 3, 0, 3],
                },
                {
                  text: 'Taxable Value',
                  fontSize: 10,
                  bold: true,
                  fillColor: headerBgColor,
                  alignment: 'right',
                  border: [false, false, false, true],
                  borderColor: [lineStyle.color, lineStyle.color, lineStyle.color, lineStyle.color],
                  margin: [0, 3, 0, 3],
                },
              ],
              // Service Item Row
              [
                {
                  stack: [
                    {
                      text: serviceName,
                      fontSize: 10,
                      bold: true,
                      margin: [0, 3, 0, 1], // Reduced margin
                    },
                    {
                      text: `SAC: ${ucSAC}`,
                      fontSize: 8,
                      color: '#666666',
                    },
                  ],
                  border: [false, false, false, false],
                  margin: [0, 3, 0, 5], // Reduced margin
                },
                {
                  text: `Rs. ${formatCurrency(taxableValue)}`,
                  fontSize: 10,
                  alignment: 'right',
                  border: [false, false, false, false],
                  margin: [0, 3, 0, 5], // Reduced margin
                },
              ],
              // Gross Amount row
              [
                {
                  text: 'Gross Amount',
                  fontSize: 9,
                  alignment: 'right',
                  border: [false, false, false, false],
                  margin: [0, 1, 0, 1], // Reduced margin
                },
                {
                  text: `Rs. ${formatCurrency(taxableValue)}`,
                  fontSize: 9,
                  alignment: 'right',
                  border: [false, false, false, false],
                  margin: [0, 1, 0, 1], // Reduced margin
                },
              ],
              // Discount row
              [
                {
                  text: 'Discount',
                  fontSize: 9,
                  alignment: 'right',
                  border: [false, false, false, false],
                  margin: [0, 1, 0, 1], // Reduced margin
                },
                {
                  text: `- Rs. ${formatCurrency(discount)}`,
                  fontSize: 9,
                  alignment: 'right',
                  border: [false, false, false, false],
                  margin: [0, 1, 0, 1], // Reduced margin
                },
              ],
              // Taxable Value row
              [
                {
                  stack: [
                    { text: 'Taxable Value', fontSize: 9, alignment: 'right' },
                  ],
                  border: [false, false, false, false],
                  margin: [0, 1, 0, 1], // Reduced margin
                },
                {
                  stack: [
                    {
                      text: `Rs. ${formatCurrency(taxableValue)}`,
                      fontSize: 9,
                      alignment: 'right',
                      margin: [0, 0, 0, 1],
                    },
                    {
                      text: `(${numToWords(taxableValue)})`,
                      fontSize: 7,
                      alignment: 'right',
                      color: '#666666',
                    },
                  ],
                  border: [false, false, false, false],
                  margin: [0, 1, 0, 1], // Reduced margin
                },
              ],
              // CGST @9% row
              [
                {
                  stack: [
                    {
                      text: `CGST @${cgstRate * 100}%`,
                      fontSize: 9,
                      alignment: 'right',
                    },
                  ],
                  border: [false, false, false, false], 
                  margin: [0, 1, 0, 3], // Reduced margin
                },
                {
                  stack: [
                    {
                      text: `Rs. ${formatCurrency(cgstAmount)}`,
                      fontSize: 9,
                      alignment: 'right',
                      margin: [0, 0, 0, 1],
                    },
                    {
                      text: `(${numToWords(cgstAmount, true)})`,
                      fontSize: 7,
                      alignment: 'right',
                      color: '#666666',
                    },
                  ],
                  border: [false, false, false, false], 
                  margin: [0, 1, 0, 3], // Reduced margin
                },
              ],
              // SGST @9% row
              [
                {
                  stack: [
                    {
                      text: `SGST @${sgstRate * 100}%`,
                      fontSize: 9,
                      alignment: 'right',
                    },
                  ],
                  border: [false, false, false, true],
                  borderColor: [lineStyle.color, lineStyle.color, lineStyle.color, lineStyle.color],
                  margin: [0, 1, 0, 3], // Reduced margin
                },
                {
                  stack: [
                    {
                      text: `Rs. ${formatCurrency(sgstAmount)}`,
                      fontSize: 9,
                      alignment: 'right',
                      margin: [0, 0, 0, 1],
                    },
                    {
                      text: `(${numToWords(sgstAmount, true)})`,
                      fontSize: 7,
                      alignment: 'right',
                      color: '#666666',
                    },
                  ],
                  border: [false, false, false, true],
                  borderColor: [lineStyle.color, lineStyle.color, lineStyle.color, lineStyle.color],
                  margin: [0, 1, 0, 3], // Reduced margin
                },
              ],
              // TOTAL AMOUNT row
              [
                {
                  text: 'TOTAL AMOUNT',
                  fontSize: 10,
                  bold: true,
                  border: [false, false, false, false],
                  margin: [0, 4, 0, 2], // Reduced margin
                },
                {
                  text: `Rs. ${formatCurrency(finalTotalAmount)}`,
                  fontSize: 10,
                  bold: true,
                  alignment: 'right',
                  border: [false, false, false, false],
                  margin: [0, 4, 0, 2], // Reduced margin
                },
              ],
            ],
          },
          // Reduced table padding
          layout: {
            hLineWidth: function (i: number, node: TableLayoutNode) {
              if (i === 1) return lineStyle.width;
              if (i === node.table.body.length - 1) return lineStyle.width;
              return 0;
            },
            vLineWidth: function () {
              return 0;
            },
            hLineColor: function () {
              return lineStyle.color;
            },
            paddingLeft: function () {
              return 0;
            },
            paddingRight: function () {
              return 0;
            },
            paddingTop: function (i: number) {
              return i === 0 ? 3 : 1; // Reduced from 2 to 1
            },
            paddingBottom: function (i: number, node: TableLayoutNode) {
              if (i === 0) return 3;
              if (i === 1) return 5; // Reduced from 8 to 5
              if (i === node.table.body.length - 2) return 3; // Reduced from 5 to 3
              if (i === node.table.body.length - 1) return 2; // Reduced from 3 to 2
              return 1; // Reduced from 2 to 1
            },
          },
          margin: [0, 0, 0, 10], // Reduced margin
        },

        // --- NEW Terms & Conditions and Closing Block ---
        {
          stack: [
            // Terms & Conditions
            { 
                text: 'Terms & Conditions:', 
                fontSize: 10, 
                bold: true, 
                margin: [0, 0, 0, 2] // Reduced margin
            },
            {
              ol: [
                'We hereby declare that the above particulars are true and correct. The amount indicated is in accordance with the PO and applicable GST laws',
                'The invoice is raised in accordance with GST rules. Swayamkrushi Home Services Limited undertakes to comply with all applicable GST.',
                '100% payment will be released after completion of the event/services and upon submission of the final tax invoice, as per PO conditions.',
                'We declare that all particulars stated in this invoice are true and correct, and the services have been rendered as per the PO specifications.',
              ],
              fontSize: 8,
              lineHeight: 1.2, // Reduced line height
              margin: [0, 0, 0, 5] // Reduced margin
            },

            // Company Name and Closing Statement
            { 
                text: companyNameHeader, 
                fontSize: 9, 
                bold: true, 
                margin: [0, 3, 0, 1] // Reduced margin
            },
            { 
                text: 'We look forward to your confirmation and the opportunity to serve you.', 
                fontSize: 9, 
                italics: true, 
                margin: [0, 3, 0, 3] // Reduced margin
            },
            
            // Warm regards / Contact Info
            { 
                text: 'Warm regards,', 
                fontSize: 9, 
                bold: true, 
                margin: [0, 5, 0, 1] // Reduced margin
            },
            { 
                text: 'SAHAYAK (Swayamkrushi Home Services Limited)', 
                fontSize: 10, 
                bold: true, 
                color: '#005a8d', 
                margin: [0, 0, 0, 3] // Reduced margin
            },
            {
              columns: [
                {
                  width: 130,
                  text: '+91 7032561500', 
                  fontSize: 9
                },
                {
                  width: '*',
                  text: 'contact@sahayakonline.com', 
                  fontSize: 9
                }
              ],
              margin: [0, 0, 0, 2]
            },
            { 
                text: 'www.sahayakonline.com', 
                fontSize: 9, 
                margin: [0, 0, 0, 5] // Reduced margin significantly
            }
          ],
          margin: [0, 0, 0, 0],
        },

        // --- Original Minimal Footer (Kept for Reverse Charge text, aligned left) ---
        {
          columns: [
            {
              width: '*',
              stack: [
                {
                  text: '*Reverse Charge mechanism not applicable',
                  fontSize: 8,
                  italics: true,
                  color: '#666666',
                  margin: [0, 0, 0, 0],
                },
              ],
            },
          ],
        },
      ],
      defaultStyle: {
        color: '#1a1a1a',
        fontSize: 9,
      },
    };

    return invoice;
  }
}
