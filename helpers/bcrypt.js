const bcrypt = require('bcryptjs')

module.exports = {
    encrypt(password) {
        return bcrypt.hashSync(password, 8)
    },
    decrypt(password, hash) {
        return bcrypt.compareSync(password, hash)
    }
}