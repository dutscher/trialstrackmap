module.exports = function (shared) {
    shared.grunt.task.run([
        'import-11-dodododo',
    ]);

    shared.grunt.registerTask('import-11-dodododo', () => {
        const huntFile = 'database/events/hunt/halloween_2019.json';
        let fileContent = shared.fs.readFileSync('build/pumkins.txt', 'utf8');
        const JSON5 = require('json5');
        const huntData = JSON5.parse(shared.fs.readFileSync(huntFile, 'utf8'));
        const trackIdsData = JSON5.parse(shared.fs.readFileSync('database/trackdata/ids.json', 'utf8'));
        let allLocations = 0;
        // foundByComunity
        const huntingIds = Object.keys(huntData);
        let huntingLocations = 0;
        huntingIds.map(trackId => {
            const huntData_ = huntData[trackId];
            huntingLocations += huntData_.length;
        });
        // found by resource
        let unknownLocations = fileContent
            .split('\r\n')
            .filter(fileRaw => fileRaw !== '')
            .map((fileRaw) => {
                const resourceLocations = parseInt(fileRaw.split('\t').pop());
                const oid = parseInt(fileRaw.split(' ')[0]);
                const lvlName = fileRaw.split(' ')[1].replace('\t'+resourceLocations, '');
                const track = trackIdsData.filter(track => track.oid === oid)[0];
                const knownLocations = huntData[track.id] ? huntData[track.id].length : 0;

                allLocations += resourceLocations;

                return {
                    id: track.id,
                    oid,
                    lvlName,
                    resourceLocations,
                    knownLocations,
                    unknownLocations: resourceLocations - knownLocations
                }
            });

        console.log(unknownLocations.length, allLocations);
        console.log(huntingIds.length, huntingLocations);

        unknownLocations = unknownLocations
            .filter(track => track.unknownLocations > 0)
            .map(track => ({
                id: track.id,
                oid: track.oid,
                name: track.lvlName,
                knownLocations: track.knownLocations,
                unknownLocations: track.unknownLocations,
            }))

        console.log(JSON.stringify(unknownLocations, null, 2))
    });
};