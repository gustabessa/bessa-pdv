module.exports = {
  username: 'postgres',
  password: '48500',
  database: 'bessa-pdv',
  host: 'localhost',
  dialect: 'postgres',
  dialectOptions: {
    useUTC: false, // for reading from database
  },
  timezone: '-03:00' // for writing to database
}