define([
    'models/Team',
    'models/Energy',
    'models/Cyclist',
    'models/Profile',
    'models/Clasificacion'
], function (Team, Energy, Cyclist, Profile, Clasificacion) {
    const StageService = {
        initStage(callback) {
            output = {
                teams: [],
                cyclists: [],
                cyclists_index: {},
                profile: []
            };

            fetch('api/cyclist')
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
            fetch('api/profile')
                .then(response => response.json())
                .then(data => {
                    console.log(data.etapa);

                    var clasificacion = new Clasificacion();
                    var profile = new Profile(clasificacion, data.etapa, data.segment);

                    output.profile = profile;

                    callback(output);
                });
        }
    };

    return StageService;
});