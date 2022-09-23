const validateEmail = (email) => {
  return email.match(
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  );
};

const validatePassword = (password) => {
  // Minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character:
  return password.match(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
  );
};

const validateUsername = (username) => {
  // Only alphanumeric characters, underscore and hyphen no spaces (min 3, max 20)
  return username.match(/^[a-zA-Z0-9_-]{3,20}$/);
};

module.exports = {
  validateEmail,
  validatePassword,
  validateUsername,
};
