import { Injectable } from '@angular/core';
import numWords from 'num-words';
import { DatePipe, TitleCasePipe } from '@angular/common';

// --- NEW INTERFACES from User ---
export interface Schedule {
    date: string;
    time: string;
}
export interface Address {
    id?: string;
    uid: string;
    name: string;
    address: string;
    phone: string;
    city: string;
    area: string;
    landmark: string;
    cityName: string;
    areaName: string;
    location: string;
    pincode: string;
    checked?: boolean;
    latitude: number;
    longitude: number;
    locality: string;
}
export interface Service {
    id: string;
    category: string;
    subCategory: string;
    name: string;
    description: string;
    image: string;
    price: string;
    status: string;
    created_at: string;
}
export interface Booking {
    id?: string;
    bookingId?: string;
    uid: string;
    service: Service;
    isRated?: boolean;
    rating?: number;
    schedule: Schedule;
    address: Address;
    agentId: string;
    agentName: string;
    paymentStatus: string;
    agentPaymentStatus?: string;
    serviceProviderCharge?: number; // New: Agent's net earning amount
    commission?: number; // New: Admin commission amount
    date: string;
    bookingStatus: string;
    agentStatus: string;
    jobStatus: string;
    paymentType: string;
    total: number; // New: Customer's total paid amount
    agentAcceptedStatus?: string;
    completed?: boolean;
    completedTime?: string;
    hasAgentAccepted?: boolean;
    agentWhoRejected?: string;
    completed_at?: string;
}

// Define Agent type for clarity (as used in generateProviderInvoice argument)
interface Agent {
    name: string;
    location: string;
    // Add other necessary agent fields here
}
// --- END NEW INTERFACES ---

@Injectable({
    providedIn: 'root'
})
export class InvoiceService {

    // Company details are constants
    private COMPANY_NAME = 'Swayamkrushi Home Services LLP';
    private COMPANY_ADDRESS = [
        '2-22-278 Plot No. 12,',
        'Rasoolpura, Secunderabad,',
        'Telangana - 500003',
    ];
    private COMPANY_CONTACTS = [
        'Phone No. : +91-73827 91500',
        'E: support@sahayakonline.com',
    ];
    private LINE_COLOR = '#aaaaab'; // Light grey for separation line

    constructor(private date: DatePipe, private titleCase: TitleCasePipe) { }

    /**
     * Generates the PDF definition for the Customer Invoice (INV).
     */
    public generateInvoice(booking: Booking, displayName: any): any {
        const invoicePrice = booking.total;

        // Custom address structure using new detailed fields
        const customerAddressText = [
            `${displayName}`,
            `${booking.address.location}, ${booking.address.landmark}`,
            `${booking.address.areaName}, ${booking.address.cityName}, ${booking.address.pincode}`,
        ].join('\n');

        const invoice = {
            content: [
                // --- Header Section: Logo and Company Info ---
                {
                    columns: [
                        { image: '', width: 100 },
                        [
                            {
                                text: this.COMPANY_NAME,
                                color: '#333333',
                                fontSize: 13,
                                bold: true,
                                alignment: 'right',
                                margin: [0, 0, 0, 5],
                            },
                            {
                                stack: [
                                    ...this.COMPANY_ADDRESS.map(text => ({ text, color: '#aaaaab', bold: true, fontSize: 12, alignment: 'right' })),
                                    ...this.COMPANY_CONTACTS.map(text => ({ text, color: '#aaaaab', bold: true, fontSize: 12, alignment: 'right' })),
                                ],
                            },
                        ],
                    ],
                },
                // --- Separator Line ---
                {
                    canvas: [{ type: 'line', x1: 0, y1: 15, x2: 520, y2: 15, lineWidth: 30, color: this.LINE_COLOR }],
                },
                // --- Invoice Number and Date ---
                {
                    columns: [
                        {
                            text: 'Customer Invoice No: INV-SHK0012', // Placeholder
                            bold: true,
                            fontSize: 12,
                            alignment: 'left',
                            margin: [0, 12, 10, 20],
                        },
                        {
                            text: `Invoice Date : ${this.date.transform(booking.date, 'dd-MM-yyyy')}`,
                            bold: true,
                            fontSize: 12,
                            alignment: 'right',
                            margin: [0, 12, 10, 20],
                        },
                    ],
                },
                // --- Billed To: Customer Details ---
                { text: 'To:', bold: true, fontSize: 14, alignment: 'left', margin: [0, 0, 0, 5] },
                {
                    columns: [
                        {
                            text: customerAddressText,
                            bold: true,
                            color: '#333333',
                            alignment: 'left',
                        },
                    ],
                },
                '\n\n',
                // --- Items Table ---
                this.createItemsTable(booking.service),

                // --- Payment Details and Summary ---
                {
                    columns: [
                        {
                            // Payment Method Column
                            table: {
                                widths: ['100%'],
                                body: [
                                    [
                                        {
                                            stack: [
                                                { text: 'Payment Method:', bold: true, fontSize: 14, alignment: 'left', margin: [6, 1, 0, 5] },
                                                {
                                                    text: `${booking.paymentType}\n \n \n \n`,
                                                    alignment: 'left',
                                                    margin: [20, 5, 0, 5],
                                                },
                                            ],
                                            border: [true, false, false, true],
                                            margin: [0, 7],
                                        },
                                    ],
                                ],
                            },
                        },
                        {
                            // Summary Table Column
                            width: '42.71%',
                            stack: [
                                {
                                    layout: this.getSummaryTableLayout(),
                                    table: {
                                        widths: ['*', 'auto'],
                                        body: [
                                            [{ text: 'Subtotal', alignment: 'right', margin: [0, 20, 0, 0], border: [true, false, false, false] },
                                            { text: `₹${invoicePrice}`, alignment: 'right', margin: [0, 20, 0, 0], border: [false, false, true, false] }],
                                            [{ text: 'GST', alignment: 'right', margin: [0, 0, 0, 0], border: [true, false, false, false] },
                                            { text: '0%', alignment: 'right', margin: [0, 0, 0, 0], border: [false, false, true, false] }],
                                            [{ text: 'Total', bold: true, alignment: 'right', border: [true, false, false, true], margin: [0, 1, 0, 23.7] },
                                            { text: `₹${invoicePrice}`, bold: true, alignment: 'right', border: [false, false, true, true], fillColor: '#fff', margin: [0, 1, 0, 23.7] }],
                                        ],
                                    },
                                },
                            ],
                        },
                    ],
                },
                // --- Amount in Words and Final Total ---
                this.createTotalRow(invoicePrice),

                // --- Notes Section ---
                this.createNotesSection(),
            ],
            defaultStyle: { columnGap: 20 },
            images: { sahayak_logo: 'path/to/sahayak_logo.png' },
        };
        return invoice;
    }

    /**
     * Generates the PDF definition for the Provider Earning Statement (INVP).
     * Now uses `total`, `commission`, and `serviceProviderCharge` fields from Booking.
     */
    public generateProviderInvoice(booking: Booking, agent: any): any {
        const totalEarning = booking.serviceProviderCharge || 0;
        const totalCustomerPrice = booking.total;
        const adminCommission = booking.commission || 0;

        const invoice = {
            content: [
                // --- Header Section: Logo and Company Info ---
                {
                    columns: [
                        { image: '', width: 100 },
                        [
                            {
                                text: this.COMPANY_NAME,
                                color: '#333333',
                                fontSize: 13,
                                bold: true,
                                alignment: 'right',
                                margin: [0, 0, 0, 5],
                            },
                            {
                                stack: [
                                    ...this.COMPANY_ADDRESS.map(text => ({ text, color: '#aaaaab', bold: true, fontSize: 12, alignment: 'right' })),
                                    ...this.COMPANY_CONTACTS.map(text => ({ text, color: '#aaaaab', bold: true, fontSize: 12, alignment: 'right' })),
                                ],
                            },
                        ],
                    ],
                },
                // --- Separator Line ---
                {
                    canvas: [{ type: 'line', x1: 0, y1: 15, x2: 520, y2: 15, lineWidth: 30, color: this.LINE_COLOR }],
                },
                // --- Invoice Number and Date ---
                {
                    columns: [
                        {
                            text: `Earning Statement No: INVP-${booking.bookingId}`,
                            bold: true,
                            fontSize: 12,
                            alignment: 'left',
                            margin: [0, 12, 10, 20],
                        },
                        {
                            text: `Date : ${this.date.transform(booking.date, 'dd-MM-yyyy')}`,
                            bold: true,
                            fontSize: 12,
                            alignment: 'right',
                            margin: [0, 12, 10, 20],
                        },
                    ],
                },
                // --- Billed To: Agent Details ---
                { text: 'To:', bold: true, fontSize: 14, alignment: 'left', margin: [0, 0, 0, 5] },
                {
                    columns: [
                        {
                            text: `${this.titleCase.transform(agent.name)}, \n ${agent.location}, \n `,
                            bold: true,
                            color: '#333333',
                            alignment: 'left',
                        },
                    ],
                },
                '\n\n',
                // --- Items Table ---
                this.createItemsTable(booking.service),

                // --- Payment Details and Summary ---
                {
                    columns: [
                        {
                            // Transfer Details Column
                            table: {
                                widths: ['100%'],
                                body: [
                                    [
                                        {
                                            stack: [
                                                { text: 'Transfer Details:', bold: true, fontSize: 14, alignment: 'left', margin: [6, 1, 0, 5] },
                                                {
                                                    // Assuming these are external fields as they aren't in the new Booking interface
                                                    text: `Transfer Mode: N/A\nTransfer ID: N/A\n \n `,
                                                    alignment: 'left',
                                                    margin: [20, 5, 0, 5],
                                                },
                                            ],
                                            border: [true, false, false, true],
                                            margin: [0, 7],
                                        },
                                    ],
                                ],
                            },
                        },
                        {
                            // Summary Table Column (Agent Earnings)
                            width: '42.71%',
                            stack: [
                                {
                                    layout: this.getSummaryTableLayout(),
                                    table: {
                                        widths: ['*', 'auto'],
                                        body: [
                                            // Service Price (Customer Paid)
                                            [{ text: 'Service Price (Customer Paid)', fontSize: 10.6, alignment: 'right', margin: [0, 10, 0, 0], border: [true, false, false, false] },
                                            { text: `₹${totalCustomerPrice}`, alignment: 'right', margin: [0, 10, 0, 0], border: [false, false, true, false] }],

                                            // Admin Commission (Amount)
                                            [{ text: 'Admin Commission (Deduction)', fontSize: 10.6, alignment: 'right', margin: [0, 5, 0, 0], border: [true, false, false, false] },
                                            { text: `₹${adminCommission}`, alignment: 'right', margin: [0, 5, 0, 0], border: [false, false, true, false] }],

                                            // Total Earning (Net Paid to Agent)
                                            [{ text: 'Total Earning (Net Pay)', bold: true, fontSize: 10.6, alignment: 'right', border: [true, false, false, true], margin: [0, 10, 0, 20.7] },
                                            { text: `₹${totalEarning}`, bold: true, alignment: 'right', border: [false, false, true, true], fillColor: '#fff', margin: [0, 10, 0, 20.7] }],
                                        ],
                                    },
                                },
                            ],
                        },
                    ],
                },
                // --- Amount in Words and Final Total ---
                this.createTotalRow(totalEarning),

                // --- Notes Section ---
                this.createNotesSection(),
            ],
            defaultStyle: { columnGap: 20 },
            images: { sahayak_logo: 'path/to/sahayak_logo.png' },
        };
        return invoice;
    }

    // --- Helper Functions for DRY/Clean Code ---

    private getTableLayout(): any {
        return {
            defaultBorder: true,
            hLineWidth: () => 1,
            vLineWidth: () => 1,
            hLineColor: (i: number) => (i === 1) ? '#000' : '#000',
            vLineColor: () => '#000',
            hLineStyle: () => null,
            paddingLeft: () => 10,
            paddingRight: () => 10,
            paddingTop: () => 5,
            paddingBottom: () => 5,
            fillColor: () => '#fff',
        };
    }

    private getSummaryTableLayout(): any {
        return {
            defaultBorder: true,
            hLineWidth: () => 1,
            vLineWidth: () => 1,
            hLineColor: () => '#000',
            vLineColor: () => '#000',
            paddingLeft: () => 12,
            paddingRight: () => 10,
            paddingTop: () => 3,
            paddingBottom: () => 3,
            fillColor: () => '#fff',
        };
    }

    private createItemsTable(service: Service): any {
        // Since price is a string in the Service interface, we use it directly here
        const servicePrice = service.price;
        return {
            layout: this.getTableLayout(),
            table: {
                headerRows: 1,
                widths: ['*', 'auto', 'auto', 'auto'],
                body: [
                    [
                        { text: 'Particulars', fontSize: 14, bold: true, fillColor: '#fff', margin: [0, 5, 0, 5], textTransform: 'uppercase' },
                        { text: 'Units', fontSize: 14, bold: true, fillColor: '#fff', margin: [0, 5, 0, 5], textTransform: 'uppercase', alignment: 'right' },
                        { text: 'Base Rate', fontSize: 14, bold: true, fillColor: '#fff', margin: [0, 5, 0, 5], textTransform: 'uppercase', alignment: 'right' },
                        { text: 'Total', fontSize: 14, bold: true, fillColor: '#fff', margin: [0, 5, 0, 5], textTransform: 'uppercase', alignment: 'right' },
                    ],
                    [
                        { text: service.name, margin: [0, 5, 0, 5], alignment: 'left' },
                        { text: '1', fillColor: '#fff', alignment: 'right', margin: [0, 5, 0, 5] },
                        { text: `₹${servicePrice}`, fillColor: '#fff', alignment: 'right', margin: [0, 5, 0, 5] },
                        { text: `₹${servicePrice}`, fillColor: '#fff', alignment: 'right', margin: [0, 5, 0, 5] },
                    ],
                ],
            },
        };
    }

    private createTotalRow(amount: number): any {
        // Convert to number for numWords
        const amountInWords = this.titleCase.transform(numWords(+amount));
        return {
            table: {
                widths: ['*', 137],
                body: [
                    [
                        {
                            text: `Amount In Words : ${amountInWords} Only`,
                            bold: true,
                            fontSize: 10.6,
                            alignment: 'left',
                            border: [true, false, false, true],
                            margin: [10, 10, 0, 10],
                        },
                        {
                            text: `Total :            ₹${amount}`,
                            bold: true,
                            border: [true, false, true, true],
                            alignment: 'right',
                            margin: [0, 10, 10, 10],
                        },
                    ],
                ],
                layout: 'noBorders',
            },
        };
    }

    private createNotesSection(): any {
        return [
            { text: 'Note :', bold: true, fontSize: 16, alignment: 'left', margin: [10, 30, 10, 10] },
            {
                ul: [
                    { text: 'All amounts are in Indian Currency (INR).', bold: false, margin: [30, 0, 0, 0] },
                    { text: 'Your feedback will help us provide quality service.', bold: false, margin: [30, 0, 0, 0] },
                    { text: 'Kindly leave a feedback on the service once it is completed.', bold: false, margin: [30, 0, 0, 0] },
                    { text: 'SGST and CGST rates may vary as per Government guidelines.', bold: false, margin: [30, 0, 0, 0] },
                    { text: 'You can write to us for any queries - support@sahayakonline.com', bold: false, margin: [30, 0, 0, 0] },
                    { text: 'Thank you for using Sahayak service by doing so you have helped our cause.', bold: false, margin: [30, 0, 0, 0] },
                    { text: 'Read more - bit.ly/Sahayak.', bold: false, margin: [30, 0, 0, 0] },
                ],
            },
        ];
    }
}
