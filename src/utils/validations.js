const Validations = {
  forEmail(str) {
    const pattern = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g;
    return pattern.test(str);
  },

  forPassword(str) {
    const pattern = /^(?=.*[a-zA-Z])(?=.*\d)[A-Za-z\d]{8,}$/;
    return pattern.test(str);
  }
};


export default Validations;
