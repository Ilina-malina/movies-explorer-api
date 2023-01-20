const nameRuRegex = /^([а-яА-ЯёЁ]+)$/;
const nameEnRegex = /^([a-zA-Z]+)$/;
const linkRegex = /^((http|https):\/\/)?(www\.)?([A-Za-zА-Яа-я0-9]{1}[A-Za-zА-Яа-я0-9-]*\.?)*\.{1}[A-Za-zА-Яа-я0-9-]{2,8}(\/([\w#!:.?+=&%@!\-/])*)?/;

module.exports = {
  nameRuRegex,
  nameEnRegex,
  linkRegex,
};
