const stages = {};
const intervals = {};

const Cyclist = require('../dto/cyclist');
const Clasificacion = require('../dto/clasificacion');

const Stage = require('../dto/stage');
const Profile = require('../dto/profile')
const Status = require('../dto/status');
const Team = require('../dto/team');
const Utils = require('../dto/utils');

const { MongoClient } = require('mongodb');


const NUM_CYCLISTS = 84;
const NUM_CYCLISTS_TEAM = 7;
const NUM_TEMS = 12;

const positions = [
    {x: -1, y: 0},
    {x: -3, y: 2}
];

var client = null;

async function init() {
    console.log('init manager...');
    if (process.env.MONGODB_URI) {
        client = new MongoClient(process.env.MONGODB_URI);
        await client.connect();
    }
    console.log('init manager');
}

async function createStage(features) {
    console.log("creating Stage...");

    var stage = new Stage(1);
    
    populateProfile(stage);

    let cyclists = await resolveCyclists();
    populateCyclists(stage, cyclists);
    populateTeams(stage);
    populateTeamsStrategy(stage);

    stage.status = 1;

    stages[1] = stage;

    console.log("created stage");

    return stage;
}

function startStage(stageId) {
    // Updater for a stage
    const updater = require('../workers/updater')

    var stage = getStage(stageId);

    var internal = setInterval(() => {
        if (stage.status == 2) {
            var continueStage = updater.update(25, getStage(stageId));

            if (!continueStage) {
                console.log("Stage " + stageId + " finished");
                clearInterval(getInterval(stageId));
                stage.status = 3;
            }
        }

    }, 25);

    setIntervals(stageId, internal);

    stage.status = 2;
}

function setIntervals(stageId, intervalId) {
    intervals[stageId] = intervalId;
}

function getInterval(stageId) {
    return intervals[stageId];
}

function populateTeamsStrategy(stage) {
    var profile = stage.profile;
    for (var team of stage.teams) {
        team.computeMedium();
        team.build(profile);
    }
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

    var clasificacion = new Clasificacion();
    var profile = new Profile(clasificacion, etapa, 1000);

    stage.profile = profile;
}

function resolveCyclists() {
    if (client != null)
        return client.db('cycling').collection('cyclist').find({"code" : {$gte: 0}}).sort( { code: 1 } ).toArray();
    else
        return new Promise((resolve, reject) => {resolve()});
}

function populateCyclists(stage, inputs) {
    var cyclists = [];
    var number = 1;

    for (var i = 0; i < NUM_CYCLISTS; i++) {
        var cyclist = new Cyclist(i, number, stage, (inputs)? inputs[i] : null);

        if (i < positions.length ) {
            cyclist.position.x = positions[i].x;
            cyclist.position.y = positions[i].y;
        }

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

    var status = {};

    if (stage.status == 2) {
        status = new Status(Utils.createOutputCyclistsForWebservice(stage.cyclists), Utils.createOutputGroupsForWebSocket(stage.groups));
        status.timestamp = stage.timestamp;
    }
    
    return status;
}

function getStage(id) {
    return stages[id];
}

exports.init = init;
exports.getStage = getStage;
exports.resolveStatus = resolveStatus;
exports.setInterval = setInterval;
exports.getInterval = getInterval;
exports.startStage = startStage;
exports.createStage = createStage;