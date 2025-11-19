describe('Sample Test', () => {
  test('should verify Jest is working', () => {
    expect(1 + 1).toBe(2);
  });
  
  test('should verify environment is test', () => {
    expect(process.env.NODE_ENV).toBe('test');
  });
});
