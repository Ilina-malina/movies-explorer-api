const nameRuRegex = /^[А-Яа-яёЁ]+(?:[-'\s][А-Яа-яёЁ]+)*$/;
const nameEnRegex = /^[A-Za-z]+(?:[-'\s][A-Za-z]+)*$/;
const linkRegex = /^((http|https):\/\/)?(www\.)?([A-Za-zА-Яа-я0-9]{1}[A-Za-zА-Яа-я0-9-]*\.?)*\.{1}[A-Za-zА-Яа-я0-9-]{2,8}(\/([\w#!:.?+=&%@!\-/])*)?/;

const SUCCESS = 200;
const CREATED = 201;

const PAGE_NOT_FOUND_MESSAGE = 'Страница не найдена';
const USER_NOT_FOUND_MESSAGE = 'Пользователь не найден';
const MOVIE_NOT_FOUND_MESSAGE = 'Фильм не найден';
const CONFLICT_ERROR_MESSAGE = 'Пользователь с таким email уже существует';
const BAD_REQUEST_MESSAGE = 'Переданы некорректные данные';
const AUTH_ERROR_MESSAGE = 'Ошибка авторизации';
const ACCESS_DENIED_MESSAGE = 'Ошибка доступа';
const NOT_VALID_MESSAGE = 'Неправильные почта или пароль';
const MOVIE_DELETED_MESSAGE = 'Фильм удален!';

module.exports = {
  nameRuRegex,
  nameEnRegex,
  linkRegex,
  SUCCESS,
  CREATED,
  PAGE_NOT_FOUND_MESSAGE,
  CONFLICT_ERROR_MESSAGE,
  USER_NOT_FOUND_MESSAGE,
  MOVIE_NOT_FOUND_MESSAGE,
  BAD_REQUEST_MESSAGE,
  AUTH_ERROR_MESSAGE,
  ACCESS_DENIED_MESSAGE,
  NOT_VALID_MESSAGE,
  MOVIE_DELETED_MESSAGE,
};
