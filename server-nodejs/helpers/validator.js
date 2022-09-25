const validateEmail = (email) => {
  var regex =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return regex.test(email);
};

const validatePassword = (password) => {
  // Minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character:
  const regex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return regex.test(password);
};

const validateUsername = (username) => {
  // Only alphanumeric characters, underscore and hyphen no spaces (min 3, max 20)
  const regex = /^[a-zA-Z0-9_-]{3,20}$/;
  return regex.test(username);
};

module.exports = {
  validateEmail,
  validatePassword,
  validateUsername,
};
