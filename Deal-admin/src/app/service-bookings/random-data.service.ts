import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RandomDataService {

  private names = ['John', 'Jane', 'Alice', 'Bob', 'Charlie', 'Diana', 'Eve', 'Frank', 'Grace', 'Hank'];
  private addresses = [
    '123 Main St, Springfield',
    '456 Elm St, Metropolis',
    '789 Oak St, Gotham',
    '321 Pine St, Star City',
    '654 Maple St, Central City'
  ];
  private categories = ['Electronics', 'Books', 'Clothing', 'Sports', 'Beauty'];
  private subCategories = ['Mobile Phones', 'Fiction', 'Men', 'Outdoor', 'Skincare'];
  private images = [
    'image1.jpg',
    'image2.jpg',
    'image3.jpg',
    'image4.jpg',
    'image5.jpg'
  ];
  private titles = [
    'Product 1',
    'Product 2',
    'Product 3',
    'Product 4',
    'Product 5'
  ];
  private prices = ['10.99', '15.99', '20.99', '25.99', '30.99'];
  private bookingStatuses = ['Successful', 'Unsuccessful'];
  private agentStatuses = ['Assigned', 'Unassigned'];
  private jobStatuses = ['Upcoming', 'Pending', 'In Progress', 'Completed'];

  constructor() { }

  private getRandomElement(array: string[]): string {
    return array[Math.floor(Math.random() * array.length)];
  }

  generateRandomData(count: number): any[] {
    const data = [];
    for (let i = 0; i < count; i++) {
      data.push({
        customerName: this.getRandomElement(this.names),
        address: this.getRandomElement(this.addresses),
        googlePin: '',
        category: this.getRandomElement(this.categories),
        subCategory: this.getRandomElement(this.subCategories),
        images: [this.getRandomElement(this.images)],
        title: this.getRandomElement(this.titles),
        price: this.getRandomElement(this.prices),
        bookingStatus: this.getRandomElement(this.bookingStatuses),
        agentStatus: this.getRandomElement(this.agentStatuses),
        jobStatus: this.getRandomElement(this.jobStatuses)
      });
    }
    return data;
  }
}
