exports.validateEditProfileData = (data) => {
  const allowedEditFields = ['firstName', 'lastName', 'emailId', 'age', 'photoUrl', 'about', 'skills'];

  const isAllowed = Object.keys(data).every(key => allowedEditFields.includes(key));

  return isAllowed;
};