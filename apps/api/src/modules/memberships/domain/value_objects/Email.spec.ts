import { Email } from './Email';

describe('Email VO', () => {
  it('creates with normalization', () => {
    const e = Email.create('  USER@Example.com ');
    expect(e.value).toBe('user@example.com');
  });

  it('rejects invalid email', () => {
    expect(() => Email.create('not-an-email')).toThrow();
    expect(() => Email.create('')).toThrow();
  });

  it('equals by value', () => {
    const a = Email.create('a@b.com');
    const b = Email.create('A@B.com');
    expect(a.equals(b)).toBe(true);
  });
});
