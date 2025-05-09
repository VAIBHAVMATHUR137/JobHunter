export const jobIDGenerator = (): string => {
  const alphabets = Array.from({ length: 26 }, (_, i) =>
    String.fromCharCode(65 + i)
  );
  const numbers = Array.from({ length: 10 }, (_, i) => i.toString());

  let alphabetResult = "";
  let numResult = "";

  for (let i = 0; i < 3; i++) {
    alphabetResult += alphabets[Math.floor(Math.random() * alphabets.length)];
    numResult += numbers[Math.floor(Math.random() * numbers.length)];
  }

  const jobID = alphabetResult + numResult;

  return jobID;
};
