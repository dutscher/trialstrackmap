module.exports = function (shared, done) {
    const activeDanteam = "02";
    require(`./${activeDanteam}.fetching.js`)(shared, done);
};