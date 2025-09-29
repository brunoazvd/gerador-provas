function sum(a: number, b: number) {
  return a + b;
}

test("sum adds two numbers", () => {
  expect(sum(2, 3)).toBe(5);
});
