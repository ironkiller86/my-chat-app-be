/**
 *
 */
//const chalk = require("chalk");
const fs = require("fs");

/**
 *
 * @param {*} notes
 */
const getNotes = (notes) => {
  return "Your notes...";
};
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
    //   console.log(chalk.green.inverse(`note with title ${title} deleted`));
    saveUser(usersOnLineToKeep);
  }
};
/*
 *
 */
const listNotes = () => {
  const myNotes = loadUsers();
  if (myNotes.length > 0) {
    console.log(chalk.magenta("My Notes"));
    myNotes.forEach(({ title, body }, index) => {});
  } else {
    /*
     *
     */
  }
};
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
  listNotes,
  readUserByUId,
};
