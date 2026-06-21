import bcrypt from "bcryptjs";

export const encryptPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  return hash;
};

export const matchPassword = async (
  enteredPassword: string,
  hashedPassword: string
): Promise<boolean> => {
  return bcrypt.compare(enteredPassword, hashedPassword);
};

// const generatePassword = async (): Promise<string> => {
//   const passwordHash = await encryptPassword("1234");
//   console.log(passwordHash);
//   return passwordHash;
// };

// generatePassword();
