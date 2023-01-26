function mapCitadel(dbCitadel) {
    console.log(dbCitadel);
    return {
        id: dbCitadel.id
    };
}

module.exports = {
    mapCitadel: mapCitadel
};