export default getImageUriFromBase64 = (base64String, extension) => {
  return `data:image/${extension};base64,${base64String}`;
};