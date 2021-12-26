define([
    'models/Team',
    'models/Energy',
    'models/Cyclist',
    'models/Profile',
    'models/Clasificacion',
    'constants'
], function (Team, Energy, Cyclist, Profile, Clasificacion, Constants) {
    const StageService = {
        initStage(callback) {
            output = {
                teams: [],
                myTeam: 0,
                cyclists: [],
                cyclists_index: {},
                profile: []
            };

            fetch(Constants.url + 'api/cyclist')
                .then(response => response.json())
                .then(data => {
                    var teamId = 0;
                    var team = null;

                    data.forEach(element => {
                        if (element.number % 10 == 1) {
                            team = new Team(teamId++);
                            output.teams.push(team);
                        }

                        var energy = new Energy(element.energy);
                        var cyclist = new Cyclist(element.id, element.number, energy);

                        team.addCyclist(cyclist);
                        output.cyclists.push(cyclist);
                        output.cyclists_index[cyclist.id] = cyclist;
                    });

                    this.loadProfile(output, callback);

                });
        },

        loadProfile(output, callback) {
            fetch(Constants.url + 'api/profile')
                .then(response => response.json())
                .then(data => {
                    console.log(data.etapa);

                    var clasificacion = new Clasificacion();
                    var profile = new Profile(clasificacion, data.etapa, data.segment);

                    output.profile = profile;

                    callback(output);
                });
        },

        getCyclist(cyclistId, callback) {
            fetch(Constants.url + 'api/cyclist/' + cyclistId, { method: 'POST' })
                .then(response => response.json())
                .then(data => {
                    callback(data);
                });
        },
        
        runOperation(cyclistId, operation) {
          fetch(Constants.url + 'api/cyclist/' + cyclistId + '/operation/' + operation, { method: 'POST' })
                .then(response => response.json())
                .then(data => {
                    // callback(data);
                });
        }

    };

    return StageService;
});