const ENV = process.env.NODE_ENV;
const DEBUG = ENV === 'development';

module.exports = {
    ENV, DEBUG
}