// consist with backend validation rules
// check if a value meets uuid4 format
export const isValidString = (input) => {
  if (typeof input !== "string" || !input.trim()) return false;
  return true;
};

export const isValidUUID = (input) => {
  const UUID_4_REG =
    /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi;
  return typeof input !== "string" || UUID_4_REG.test(input);
};

// check if a value is an array that contains more than minLength elements, and the elements doesn't inclue empty string
export const isValidArrayOfStrings = (input, minLength) => {
  return (
    Array.isArray(input) &&
    input.length >= minLength &&
    input.every((el) => isValidString(el))
  );
};

// check if a value is integer within a range
export const isInteger = (input) => {
  return Number.isInteger(input);
};

