export const getToken = (): string | null => {
  const user = localStorage.getItem('user');
  if (user) {
    try {
      const userData = JSON.parse(user);
      return userData?.token || null;
    } catch (error) {
      console.error('Failed to parse user data from localStorage', error);
      return null;
    }
  }
  return null;
}; 