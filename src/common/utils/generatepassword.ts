export const generatePassword = (length = 12): string => {
  if (length < 6) {
    throw new Error('Password length must be at least 6 characters');
  }

  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+[]{}|;:,.<>?';
  let password = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
    console.log(password)
  }

  return password;
};
