import { nameToLastInitials } from '../nameToLastInitials';

describe('nameToLastInitials', () => {
  it('should convert a full name with one space to first name and the initial of the last name', () => {
    expect(nameToLastInitials('John Doe')).toBe('John D.');
  });

  it('should convert a full name with multiple spaces to first name and initials of each of the last names', () => {
    expect(nameToLastInitials('John De La Doe')).toBe('John D.L.D.');
  });

  it('should convert a name with just first name to the first name', () => {
    expect(nameToLastInitials('John')).toBe('John');
  });
});
