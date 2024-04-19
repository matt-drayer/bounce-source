import { splitNameToFirstLast } from '../splitNameToFirstLast';

describe('splitNameToFirstLast', () => {
  it('should split a name with one space into first and last names', () => {
    expect(splitNameToFirstLast('John Doe')).toEqual({
      firstName: 'John',
      lastName: 'Doe',
    });
  });

  it('should split a name with multiple spaces into first name and the rest as the last name', () => {
    expect(splitNameToFirstLast('John De La Doe')).toEqual({
      firstName: 'John',
      lastName: 'De La Doe',
    });
  });

  it('should return only the first name when there is no space', () => {
    expect(splitNameToFirstLast('John')).toEqual({
      firstName: 'John',
      lastName: '',
    });
  });
});
