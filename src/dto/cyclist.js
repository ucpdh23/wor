var CSV = require('winston-csv-format').default;
var Vector = require('./NewVector').Vector;
var Utils = require('./utils');

var { createLogger, transports } = require('winston');

console.log(CSV)

const Energy = require('./energy')
const CyclistStateMachine = require('./cyclistStateMachine')

const SEP_RANGE = 1.8;
const NEIGHBOR_DIST = 7;
const MAX_SPEED = 20;
const MAX_STEERING_FORCE = 0.2;
const ANGLE = 210;
const ITEMS = 100;


const dataLogger = createLogger({
    level: 'info',
    format: CSV([ 'posX', 'posY', 'velX', 'velY', 'accX', 'accY', 'feaLla', 'feaMon', 'feaSpr', 'resAir', 'resVel', 'resMon', 'pulse', 'neighbour', 'state', 'stageKms', 'stageAngle', 'pendingKms', 'pendingAngle', 'leader','innovador','metodico','gregario', 'inquieto'], { delimiter: ',' }),
    transports: [
      new transports.File({ filename: 'tmp/data.csv' }),
    ],
  });


class Cyclist {
    constructor(id, number, stage) {
        this.id = id;
        this.number = number;
        this.stage = stage;

        this.enabled = true;

        this.maxSpeed = MAX_SPEED;

        this.slope = 0;
        this.log = '';

        this.roadWidth = 8;

        this.message = '';
        this.msgPayload = null;

        this.texts = [];

        this.time = 0;

        this._mGoodPosition = 7;
        this._mDemarrajeGoodPosition = 3;
        this.selfAccTimer = 3;

        this.position = new Vector(0 - Math.random() * ITEMS / 1.5, 3 - Math.random() * 6);
        this.velocity = new Vector(9, 0);
        this.acceleration = new Vector(0, 0);
        this.acc_physics = new Vector(0, 0);

        this.inquieto = 25;

        this.actions = {};
        this.actionMeters = [];
        this.neighbour = []
        this.maxSteeringForce = MAX_STEERING_FORCE;
        this.neighborDist = NEIGHBOR_DIST;

        this.setViewingAngle(ANGLE);

        this.secuence = Math.random(4);

        this._mSeparation = SEP_RANGE;
        this._stateMachine = [];
        this._smCtx = { first: null, cyclist: this };
        this.actualBodyColor = new Vector(144 - this.id, 255 - this.id, this.id);

        this.pushStateMachine(CyclistStateMachine.createDefaultStateMachine());

        this.energy = new Energy(this);

        if (this.energy.llano < 80) {
            this._mSeparation = this._mSeparation + 0.2;
        } else if (this.energy.llano > 85) {
            this._mSeparation = this._mSeparation - 0.2;
        }

        require('./cyclistStrategy')
        require('./cyclistComputeForces')

    }

    setPsicology(leader, innovador, metodico, gregario) {
        this.psicology = {
            leader: leader,
            innovador: innovador,
            metodico: metodico,
            gregario: gregario
        };
    }

    logCyclist() {
        let profileStatistics = this.stage.profile.computeStatistics(this.position.x);

        let jsonMessage = {
            posX: Utils.dec(this.position.x, 2),
            posY: Utils.dec(this.position.y, 2),
            velX: Utils.dec(this.velocity.x, 2),
            velY: Utils.dec(this.velocity.y, 2),
            accX: Utils.dec(this.acceleration.x, 2),
            accY: Utils.dec(this.acceleration.y, 2),
            feaLla: Utils.dec(this.energy.llano, 2),
            feaMon: Utils.dec(this.energy.montana, 2),
            feaSpr: Utils.dec(this.energy.sprint, 2),
            resAir: Utils.dec(this.energy.r_air, 2),
            resVel: Utils.dec(this.energy.r_vel, 2),
            resMon: Utils.dec(this.energy.r_pend, 2),
            pulse: Utils.dec(this.energy.pulse2, 2),
            neighbour: this.neighbour.length,
            state: this._stateMachine[0].value,
            stageKms: Utils.dec(profileStatistics.stageKms, 2),
            stageAngle: Utils.dec(profileStatistics.stageAngle, 2),
            pendingKms: Utils.dec(profileStatistics.pendingKms, 2),
            pendingAngle: Utils.dec(profileStatistics.pendingAngle, 2),
            leader: Utils.dec(this.psicology.leader, 2),
            innovador: Utils.dec(this.psicology.innovador, 2),
            metodico: Utils.dec(this.psicology.metodico, 2),
            gregario: Utils.dec(this.psicology.gregario, 2),
            inquieto: Utils.dec(this.inquieto, 2)
        };

        dataLogger.log('info', jsonMessage);

        var message = "";
        message += "Cyclist " + this.number + "(" + this.id + ") "
        message += " -pos:" + Utils.dec(this.position.x, 2) + "-" + Utils.dec(this.position.y, 2)
        message += " -vel:" + Utils.dec(this.velocity.x, 2) + "-" + Utils.dec(this.velocity.y, 2)
        message += " -acc:" + Utils.dec(this.acceleration.x, 2) + "-" + Utils.dec(this.acceleration.y, 2)
        message += " -st:" + this._stateMachine[0].value
        message += " -ne:" + this.neighbour.length
        message += " -ll:" + Utils.dec(this.energy.llano, 2)
        message += " -mo:" + Utils.dec(this.energy.montana, 2)
        message += " -sp:" + Utils.dec(this.energy.sprint, 2)
        message += " -rAir:" + Utils.dec(this.energy.r_air, 2)
        message += " -rVel:" + Utils.dec(this.energy.r_vel, 2)
        message += " -rMo:" + Utils.dec(this.energy.r_pend, 2)
        message += " -ppm:" + Utils.dec(this.energy.pulse2, 2)
        
        console.log(message)
    }

    setViewingAngle(angle) {
        this.viewingAngle = angle * (Math.PI / 180);
    }

    isColliding(other) {
        var myRect1 = this.getRectangle1();
        var myRect2 = this.getRectangle2();

        var otherRect1 = other.getRectangle1();
        var otherRect2 = other.getRectangle2();

        return myRect1.colladeWith(otherRect1) || myRect1.colladeWith(otherRect2) || myRect2.colladeWith(otherRect1) || myRect2.colladeWith(otherRect2);
    }

    getRectangle1() {
        var width_rectangle_1 = 0.05;
        return new Rectangle(
            this.position.x, this.position.y - width_rectangle_1, 1.7, width_rectangle_1 * 2
        );
    }

    getRectangle2
        () {
        var width_rectangle_2 = 0.5;
        return new Rectangle(
            this.position.x - 0.5, this.position.y - 0.3, 0.5, 0.6
        );
    }

    inBoidViewRange(other) {
        var theta = Math.atan2(-this.velocity.y, this.velocity.x);

        return this._inBoidViewRange(other, theta, this.viewingAngle);
    }

    _inBoidViewRange(other, theta, viewingAngle) {

        var obst_x = other.position.x - this.position.x
        var obst_y = other.position.y - this.position.y


        var obx = obst_x * Math.cos(theta) - obst_y * Math.sin(theta)
        var oby = obst_x * Math.sin(theta) + obst_y * Math.cos(theta)

        var a = Math.atan2(-oby, obx)

        var min = -viewingAngle / 2
        var max = +viewingAngle / 2

        return (a < max && a > min)
    }

    collision() {
        var steer = createVector(0, 0)
        var diff = createVector(0, 0)
        var count = 0
        this.colliding = false;
        for (var i = this.neighbour.length - 1; i >= 0; i--) {
            var other = this.neighbour[i]


            if (this.inBoidViewRange(other) && this.isColliding(other)) {
                var dist = this.position.dist(other.position)

                diff = Vector.sub(this.position, other.position)
                steer.add(diff)
                count++;

                this.colliding = true;
            }
        }

        if (count > 0) {
            steer.div(count)
            steer.limit(this.maxSteeringForce)
        }

        return steer
    }

    drive() {
        var theta = this.driveTheta;

        if (theta == undefined) theta = Math.PI / 2;

        var radius = 4;
        var distance = 1000;

        var driveX = radius * Math.cos(theta);
        var driveY = radius * Math.sin(theta);

        var steer = this.seek(new Vector(
            this.position.x + distance + driveX,
            driveY
        ));

        this.driveTheta = theta + Math.PI / 10000;

        steer.limit(this.maxSteeringForce);
        steer.x = 0;
        return steer;

    }

    separation() {
        var steer = new Vector(0, 0)
        var diff = new Vector(0, 0)
        var count = 0

        //console.log("this.neighbour.length" + this.neighbour.length)
        for (var i = this.neighbour.length - 1; i >= 0; i--) {
            var other = this.neighbour[i]

            let dist = this.position.dist(other.position);


            if (dist < this._mSeparation && this.inBoidViewRange(other)) {
                diff = Vector.sub(this.position, other.position)
                diff.div(dist)
                steer.add(diff)
                count++
            }
        }

        if (count > 0) {
            steer.div(count)
            steer.limit(this.maxSteeringForce)
        }

        return steer
    }

    goodPosition(first) {
        if (this._mGoodPosition === -2) {
            var cyclistToBet = findCyclist(this._gotoFirstId);

            return this.goodPositionBeforeFirst(cyclistToBet);
        } else if (this._mGoodPosition === 0) {

            return this.goodPositionToFirst(first);
        } else {
            this.goodPositionInsideGroup(first);
        }
    }

    goForwardAcc() {
        var border = this.inBorder();

        if (border == null) {
            var steer = new Vector(0.2, 1);
            if (this.position.y < first.position.y) {
                steer.mult(-1);
            } else {

            }
            steer.limit(this.maxSteeringForce);
            return steer;
        } else if (border.x == 0) {
            return new Vector(0, 0);
        } else {
            var steer = this.seek(border);
            steer.limit(this.maxSteeringForce);

            var diffVel = first.velocity.x - this.velocity.x;

            var ref = (diffVel < -1) ? 3 : 2;

            if (diff < ref) {
                diffVel = diffVel * (ref - diff) / ref;
                steer.x = + diffVel;
            }

            return steer;
        }
    }

    goodPositionToFirst(first) {
        var diff = first.position.x /* + first.velocity.x -
  */ - this.position.x;

        /*var almostFirst = false;
        if (diff < 2) {
            var diffVel = first.velocity.x - this.velocity.x;
            if (diffVel < 0.5 && diffVel > -0.5) {
                this._gotoFirst = true;
                this._gotoFirstId = first.id;
            }
        }*/

        //this.log = 'diff;'+ diff + ' num'+ first.number;

        if (diff > 0.5) {
            var border = this.inBorder();

            if (border == null) {
                var steer = new Vector(0.2, 1);
                if (this.position.y < first.position.y) {
                    steer.mult(-1);
                } else {

                }
                steer.limit(this.maxSteeringForce);
                return steer;
            } else if (border.x == 0) {
                return new Vector(0, 0);
            } else {
                var steer = this.seek(border);
                steer.limit(this.maxSteeringForce);

                var diffVel = first.velocity.x - this.velocity.x;

                var ref = (diffVel < -1) ? 3 : 2;

                if (diff < ref) {
                    diffVel = diffVel * (ref - diff) / ref;
                    steer.x = + diffVel;
                }

                return steer;
            }
        } else {
            return new Vector(0, 0);
        }
    }

    goAfter(target) {

        var endPos = Vector.add(target.position, new Vector(-1.5, 0));
        //endPos.add(target.velocity);
        var diff = Vector.sub(endPos, this.position);
        var dist = diff.mag();
        diff.normalize();

        // this.log = "follow:" + target.id + " x:"+diff.x+" y:"+diff.y;


        var speed = dist / 5;
        speed = Math.min(speed, target.velocity.x * 1.1);
        this.log = "follow:" + target.id + " dist:" + dist

        var diffVel = Vector.sub(target.velocity, this.velocity);
        diffVel.mult(-1)

        diff.mult(speed);

        diff.sub(diffVel);

        return diff;
    }

    inBorder() {
        var item = -1;

        for (var i = 0; i < globalHull.length - 1; i++) {
            var x = globalHull[i][0];
            var y = globalHull[i][1];

            if (x == this.position.x &&
                y == this.position.y) {
                item = i;
                break;
            }
        }

        if (item != -1) {
            if (item == 0) return new Vector(0, 0)

            if (item == globalHull.length - 1) {
                return new Vector(
                    globalHull[0][0],
                    globalHull[0][1]
                );
            } else {
                if (globalHull[item - 1][0] > this.position.x) return new Vector(
                    globalHull[item - 1][0],
                    globalHull[item - 1][1] + 0.75);
                else return new Vector(
                    globalHull[item + 1][0],
                    globalHull[item + 1][1] - 0.75);
            }
        } else {
            return null;
        }
    }


    goodPositionInsideGroup(first) {
        if (this.position.x < first.position.x - this._mGoodPosition) {
            if (!this.canGoForward()) {
                var steer = new Vector(0.2, 1);
                if (this.position.y < first.position.y) {
                    steer.mult(-1);
                }
                steer.limit(this.maxSteeringForce);
                return steer;
            } else {
                var newY = first.position.y;
                var newX = random(this._mGoodPosition - 2);

                var steer = this.seek(new Vector(first.position.x - 2 - newX, newY));
                steer.limit(this.maxSteeringForce)
                return steer;
            }
        }

        return new Vector(0, 0);
    }

    canGoForward() {
        var inRange = this.computeItems(20, 4);
        //print(inRange);
        if (inRange.length > 0)
            return false;
        //return true;

        inRange = this.computeItems(180, 1);

        if (inRange.length > 0)
            return false

        return true;

    }

    computeItems(angle, meters) {
        var items = [];

        var theta = Math.atan2(-this.velocity.y, this.velocity.x);

        for (var i = this.neighbour.length - 1; i >= 0; i--) {
            var other = this.neighbour[i]
            let dist = this.position.dist(other.position);


            if (dist < meters && this._inBoidViewRange(other,
                theta,
                angle * (Math.PI / 180))) {
                items.push(other);
            }
        }

        return items;

    }


    alignment() {
        var steer = new Vector(0, 0)
        var count = 0

        for (var i = this.neighbour.length - 1; i >= 0; i--) {
            var other = this.neighbour[i]

            var d = this.position.dist(other.position)
            if (d < this.neighborDist && this.inBoidViewRange(other)) {
                steer.add(other.velocity)
                count++
            }
        }

        if (count > 0) {
            steer.div(count)
            steer.sub(this.velocity)

            steer.limit(this.maxSteeringForce);
        }
        return steer
    }

    seek(mass) {
        var diff = Vector.sub(mass, this.position);

        diff.normalize();
        diff.mult(this.maxSpeed);

        diff.sub(this.velocity)

        return diff;
    }

    cohesion() {
        var mass = new Vector(0, 0)
        var count = 0

        for (var i = this.neighbour.length - 1; i >= 0; i--) {
            var other = this.neighbour[i]

            var d = this.position.dist(other.position)
            var neighDist = this.neighborDist;
            if (this.id > 80) neighDist * 2;

            if (d < neighDist && d > 1.6 && this.inBoidViewRange(other)) { //&& !this.isColliding(other)) {
                mass.add(other.position)
                count++
            }
        }

        if (count > 0) {
            mass.div(count) /* Centre of mass */

            // if (mass.x < this.position.x) return createVector(0);
            var steer = this.seek(mass);
            steer.limit(this.maxSteeringForce)

            return steer;
        }
        return mass
    }

    wander(radius, distance) {
        return new Vector(0, 0);

        var theta = this.wanderTheta;

        if (theta == undefined) theta = Math.PI / 2;

        var wanderX = radius * cos(theta);
        var wanderY = radius * sin(theta);

        var steer = this.seek(createVector(
            this.position.x + distance + wanderX,
            this.position.y + wanderY));

        steer.limit(this.maxSteeringForce);

        this.wanderTheta = theta + Math.PI / 16;

        return steer;
    }

    borderAvoid() {
        var result = new Vector(0, 0);

        var futurePos = this.velocity.get()
        futurePos.mult(3);
        futurePos = Vector.add(this.position, futurePos);

        if (futurePos.y > (this.roadWidth)) {
            result.add(new Vector(0, -2))
        } else if (futurePos.y > (this.roadWidth * 0.8)) {
            result.add(new Vector(0, -1))
        } else if (futurePos.y < -(this.roadWidth)) {
            result.add(new Vector(0, 2));
        } else if (futurePos.y < -(this.roadWidth * 0.8)) {
            result.add(new Vector(0, 1));
        }
        //result.limit(this.maxSteeringForce);

        return result;

    }

    selfAcc() {
        if (this.startSelfAcc) {
            //print('selfAcc')
            this._selfAccInit = this.time;
            this.selfStartedSelfAcc = true;
            this.startSelfAcc = undefined;
            if (this.energy.pulse2 > 160) {
                if (this.selfAccLevel > 0)
                    this.selfAccLevel /= 2;
            }
        } else if (this.selfStartedSelfAcc) {
            var diffTime = (this.time - this._selfAccInit) / this.selfAccTimer;


            if (diffTime > Math.PI) {
                this.selfStartedSelfAcc = false;
                this.enabled = true;
            }

            return new Vector(this.selfAccLevel
                * Math.sin(diffTime), 0);
        }

        return new Vector(0, 0);
    }

    shouldReduceDraft() {
        return (this.energy.pulse2 > 120)
            && (this.energy.draftReduction <= 2);
    }

    findCandidate() {
        var candidate = this.findCandidateToReduceDraft(45, 4)

        if (candidate === null) {
            candidate = this.findCandidateToReduceDraft(90, 6)
        }

        if (candidate === null) {
            candidate = this.findCandidateToReduceDraft(45, 12)
        }

        if (candidate !== null
            && candidate !== undefined) {
            return candidate;
        } else {
            return null;
        }
    }

    reduceDraft() {
        return this.goAfter(this._reduceDraftCandidate);
    }
    _reduceDraft() {
        if (this._reduceDraftEnabled) {
            if (this.energy.draftReduction > 2) {
                this._reduceDraftEnabled = false;
            } else if (time - this._reduceDraftTime < 30) {
                if (Math.abs(this.velocity.x - this._reduceDraftCandidate.velocity.x) < 2) {
                    return this.goAfter(this._reduceDraftCandidate);
                    // console.log("goafter")
                } else {
                    this._reduceDraftEnabled = false;
                }
            } else {
                this._reduceDraftEnabled = false;
            }
        } else if (this.energy.pulse2 > 120) {
            if (this.energy.draftReduction <= 2) {
                var candidate = this.findCandidateToReduceDraft(45, 4)

                if (candidate === null) {
                    candidate = this.findCandidateToReduceDraft(90, 6)
                }

                if (candidate === null) {
                    candidate = this.findCandidateToReduceDraft(45, 12)
                }

                if (candidate !== null && candidate !== undefined) {
                    this._reduceDraftCandidate = candidate;
                    this._reduceDraftTime = time;
                    this._reduceDraftEnabled = true;

                    //console.log("try to reduce energy of " + this.id + " following " + candidate.id);

                } else {
                    this.log = "without candidate"
                }
            } else {
                // console.log("id:" + this.id + " draftReduction: " + this.energy.draftReduction);
            }
        }

        return new Vector(0, 0);
    }

    findCandidateToReduceDraft(angle, meters) {
        var items = this.computeItems(angle, meters);

        var bestCandidate = null;
        var bestCandidateDistance = 100;
        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            if (item.position.x > this.position.x + 1.4 && Math.abs(this.velocity.x - item.velocity.x) < 2) {
                var distance = item.position.x - this.position.x;

                if (distance < bestCandidateDistance) {
                    bestCandidateDistance = distance;
                    bestCandidate = item;
                }
            }
        }

        return bestCandidate;
    }


    computeAvVel() {
        if (this.first == this) return 0;

        if (this.position.x < 100)
            return this.first.velocity.x;

        let inRange = this.computeItems(170, 5);

        if (inRange.length == 0) return 0;

        var vel = 0;
        var acc = 0;
        for (var i = 0; i < inRange.length; i++) {
            var item = inRange[i]
            vel += item.velocity.x;
            acc += item.acc_physics.x;
        }


        return vel / inRange.length;
    }

    checkVector(vector, type) {
        if (Number.isNaN(vector.x)) {
            console.log(type + " X is Nan");
            throw 41;
        } else if (Number.isNaN(vector.y)) {
            console.log(type+ " Y is Nan");
            throw 42;
        } 
    }

    update(time) {
        this.time = this.time + time;

        var vector = this.velocity.get();
        this.checkVector(vector, "velocity")
        vector.mult(time);
        this.position.add(vector);


        vector = this.acceleration.get();
        this.checkVector(vector, "acc");
        vector.mult(time);
        this.velocity.add(vector);

        vector = this.acc_physics.get();
        this.checkVector(vector, "acc_physics");
        vector.mult(time);
        this.velocity.add(vector);

        this.velocity.limit(this.maxSpeed);

        this.energy.update(time)

        this.neighbour = []

        return this.position.x
    }

    pushStateMachine(stateMachine) {
        this._stateMachine.push(stateMachine)
    }

    peekStateMachine() {
        return this._stateMachine[this._stateMachine.length - 1];
    }

    popStateMachine() {
        this._stateMachine.pop();
    }

    computeNeighbour(cyclists, i, first, last, environment) {
        this.first = first;
        this.environment = environment;
        var slope = environment.slope;
        this.roadWidth = environment.width;

        if (this.slope !== slope) {
            this.slope = slope;
            this.targetPot = this.energy.pot;
        } else {
            this.targetPot = 0;
        }

        if (this.energy.points < 0) {
            this.acceleration = new Vector(0, 0);
            this.velocity = new Vector(0, 0);
            return;
        }

        if (this.velocity.x > 15) {
            this._mSeparation = SEP_RANGE * (1 + (this.velocity.x - 15) / 10);
        }

        this.energy.computePhysics();

        this.log = "";
        this.neighbour = []
        for (i = 0; i < cyclists.length; i++) {
            if (this !== cyclists[i]) {
                let dist = this.position.dist(cyclists[i].position);
                //console.log("dist" + dist)
                //print("dist("+this.id+"):"+dist);
                if (dist < this.neighborDist && cyclists[i].enabled) {
                    this.neighbour.push(cyclists[i]);
                }
            }
        }

        this.checkAction(this.position.x);

        this._smCtx.first = this.group.getFirst();
        this._smCtx.message = this.message;
        this._smCtx.msgPayload = this.msgPayload;
        this.message = undefined;
        this.msgPayload = undefined;

        this.peekStateMachine()
            .transition(this._smCtx);
        this.peekStateMachine()
            .execute(this._smCtx);

        this._smCtx.message = undefined;
        this._smCtx.msgPayload = undefined;
    }


    sendMessage(msg, payload = undefined) {
        this.flashing = {
            tics: 150,
            color: new Vector(0, 0, 255)
        };

        this.message = msg;
        this.msgPayload = payload;

        this.managePort();
        /*
        this._smCtx.first
              = this.group.getFirst();
        this._smCtx.message = msg;
        this.peekStateMachine().transition(
          this._smCtx);
        this._smCtx.message=undefined;
        */
    }

    ports = [];

    managePort() {
        if (this.message == 'startPort') {
            this.texts.push(Utils.strTime(this.time) + '-Starting port:' + this.msgPayload.kms + 'kms at ' + Utils.dec(this.msgPayload.slope, 10) + '%');

            var portInfo = Object.assign({}, this.msgPayload);

            portInfo.time = this.time;
            this.ports.push(portInfo);
        } else if (this.message == 'endPort') {
            var portInfo = this.ports.pop();
            var elapseTime = this.time - portInfo.time;
            var velAvg = portInfo.kms / (elapseTime / 3600);

            this.texts.push(Utils.strTime(this.time) + '-Finidhed port in ' + Utils.strTime(elapseTime) + ' ' + Utils.dec(velAvg, 100));
        }
    }

}

module.exports = Cyclist;