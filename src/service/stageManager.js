const stages = {};

const Cyclist = require('../dto/cyclist');
const Stage = require('../dto/stage');
const Profile = require('../dto/profile')
const Status = require('../dto/status');
const Team = require('../dto/team');
const Utils = require('../dto/utils');


const NUM_CYCLISTS = 84;
const NUM_CYCLISTS_TEAM = 7;

function init() {
    console.log('init manager')
    console.log("starting")


    var stage = new Stage(1);

    populateProfile(stage);
    populateCyclists(stage);
    populateTeams(stage);

    stages[1] = stage;
}

function populateTeams(stage) {

    var team = null;
    var teams = [];

    for (var i = 0; i < NUM_CYCLISTS; i++) {
        var cyclist = stage.cyclists[i];

        if (cyclist.number % 10 == 1) {
            if (team != null) {
                teams.push(team);
            }

            team = new Team();
            teams.push(team);
        }

        team.addCyclist(cyclist);
    }

    if (team != null) {
        teams.push(team);
    }

    stage.teams = teams;
}

function populateProfile(stage) {
    var etapa = [0, 2, 4, 7, 2, -3, -5, -5, -3, 0, 0, 0, 0, 4, 5, 7, 8, 6, 7, 8, 9, 10, -3, -6, -6, -6, -7, -2, -5, -7, -9, -2, 0, 0, 0, 0, 0, 4, 0, 6, 7, 12, 15, 3];

    var profile = new Profile(null, etapa, 1000);

    stage.profile = profile;
}

function populateCyclists(stage) {
    var cyclists = [];
    var number = 1;
    for (var i = 0; i < NUM_CYCLISTS; i++) {
        var cyclist = new Cyclist(i, number);
        cyclists.push(cyclist);

        if (number % 10 == NUM_CYCLISTS_TEAM) {
            number = number + (10 - NUM_CYCLISTS_TEAM) + 1;
        } else {
            number++;
        }
    }

    stage.cyclists = cyclists;
}

function resolveStatus(client) {
    var stage = getStage(1);

    var status = new Status(Utils.createOutputCyclists(stage.cyclists));
    status.timestamp = stage.timestamp;

    return status;
}

function getStage(id) {
    return stages[id];
}

exports.init = init;
exports.getStage = getStage;
exports.resolveStatus = resolveStatus;
