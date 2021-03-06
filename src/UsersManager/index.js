const fs = require("fs");
/**
 *
 * @param {*} title
 * @param {*} body
 */
const addUser = (user) => {
  const usersOnLine = loadUsers();
  usersOnLine.push({ nickname: user.nickname, uId: user.uId });
  saveUser(usersOnLine);
};
/**
 *
 * @param {*} notes
 */
const saveUser = (usersList) => {
  const dataJSON = JSON.stringify(usersList);
  try {
    fs.writeFileSync("users.json", dataJSON);
  } catch (e) {
    console.log("error");
  }
};
/**
 *
 */
const loadUsers = () => {
  try {
    const dataBuffer = fs.readFileSync("users.json");
    const dataJSON = dataBuffer.toString();
    return JSON.parse(dataJSON);
  } catch (e) {
    return [];
  }
};
/**
 *
 * @param {*} title
 */
const removeUser = (socketId) => {
  const usersOnLine = loadUsers();
  const usersOnLineToKeep = usersOnLine.filter((user) => user.uId !== socketId);
  if (usersOnLine.length > usersOnLineToKeep.length) {
    saveUser(usersOnLineToKeep);
  }
};
/*
 *
 */
const readUserByUId = (socketUId) => {
  const usersOnLine = loadUsers();
  if (usersOnLine.length > 0) {
    const userFound = usersOnLine.find((user) => user.uId === socketUId);
    return userFound || null;
  }
};
/*
 *
 */
module.exports = {
  loadUsers,
  addUser,
  removeUser,
  readUserByUId,
};
