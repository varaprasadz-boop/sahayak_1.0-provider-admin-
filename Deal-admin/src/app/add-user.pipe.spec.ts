import { AddUserPipe } from './add-user.pipe';

describe('AddUserPipe', () => {
  it('create an instance', () => {
    const pipe = new AddUserPipe();
    expect(pipe).toBeTruthy();
  });
});
