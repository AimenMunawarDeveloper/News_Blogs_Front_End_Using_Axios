export const token =
  "8de93055405e26f3f3e7986f530b17c7022114f9fba3e83f986dd4caa9a4417bb668ff1b52ba2c4ff51b9f9304ca9e85feb8a108369aad6ca73a250441ba9869fcbdbac80aadf687fa692ab26c7bd25a6188c47684ad3e67186cb1d69bc41cbe43f23277773ae2ba4f458aebaf460822684916e328be0bc17b0ba7dd0ff5b41a";
export const setToken = () => {
  localStorage.setItem("jwt", token);
};
export const jsonConfig = {
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
};
export const formDataConfig = {
  headers: {
    "Content-Type": "multipart/form-data",
    Authorization: `Bearer ${token}`,
  },
};
