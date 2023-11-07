const { generateToken } = require('./generateToken')
/**
 * Builds the registration token
 * @param {Object} item - user object that contains created id
 * @param {Object} userInfo - user object
 */
const returnRegisterToken = (
  { _id = '' },
  userInfo = {}
) => {
  return new Promise((resolve) => {
    const data = {
      token: generateToken(_id),
      user: userInfo
    }
    resolve(data)
  })
}

module.exports = { returnRegisterToken }
