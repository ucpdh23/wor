class Profile {
    data = [];

    segment = 1000;

    portInfos = [];

    clasificacion = null;
    etapa = null;

    constructor(clasificacion, etapa, segment) {
        this.etapa = etapa;
        this.segment = segment;

        var prevSlope = 0;
        var port = 0;

        var elevation = 0;
        var dist = 0;

        this.clasificacion = clasificacion;


        this.data.push(
            {
                x: dist,
                y: elevation
            }
        );

        var portInfo = null;
        for (var i = 0; i < this.etapa.length; i++) {
            var slope = this.etapa[i];
            dist += this.segment;
            elevation += slope * this.segment / 100;
            this.data.push({ x: dist, y: elevation })

            if (prevSlope == 0 && slope > 0 && portInfo == null) {
                this.addListener(i * this.segment, (cyclist, portNumber) => {
                    cyclist.sendMessage('startPort', this.portInfos[portNumber]);
                }, port);

                portInfo = {
                    id: port,
                    kms: 0,
                    slope: 0
                };


            } else if (prevSlope > 0 && slope < 0) {
                this.addListener(i * this.segment, (cyclist, portNumber) => {
                    cyclist.sendMessage('endPort', this.portInfos[portNumber]);
                }, port);

                this.addListener(i * this.segment, (cyclist, portNumber) => {
                    this.clasificacion.register(cyclist, i * this.segment);
                }, port);


                portInfo.slope = portInfo.slope / portInfo.kms;

                this.portInfos.push(portInfo);

                portInfo = null;

                port++;
            }

            if (portInfo != null) {
                portInfo.kms += this.segment / 1000;
                portInfo.slope += slope * this.segment / 1000;
            }

            prevSlope = slope;
        }

        if (portInfo != null) {
            this.addListener(this.etapa.length * this.segment, (cyclist, portNumber) => {
                cyclist.sendMessage('endPort', this.portInfos[portNumber]);
            }, port);

            portInfo.slope = portInfo.slope / portInfo.kms;

            this.portInfos.push(portInfo);
        }
    }

    listeners = {};
    listenersPort = {}
    addListener(meters, listener, portNumber) {
        if (meters in this.listeners) {
            this.listeners[meters].push(listener);
        } else {
            this.listeners[meters] = [listener];
        }

        if (!(meters in this.listenersPort))
            this.listenersPort[meters] = portNumber;
    }

    events = {};
    onEvent(cyclist) {
        if (this.events[cyclist.id] == null) {
            this.events[cyclist.id] = Object.keys(this.listeners);
        }

        if (this.events[cyclist.id].length == 0) return;

        var kms = this.events[cyclist.id][0];
        if (kms < cyclist.position.x) {
            this.listeners[kms].forEach(item => {
                item.apply(this, [cyclist, this.listenersPort[kms]]);
            });

            this.events[cyclist.id].shift();
        }
    }


    setCyclists(cyclists) {
        this.cyclists = cyclists;
    }

    computeEnvironment(cyclist) {
        this.onEvent(cyclist);

        return this.computeEnvironmentByPos(
            cyclist.position.x);
    }

    computeEnvironmentByPos(pos) {
        var computeSlope = this.computeSlope(pos);

        var computeWidth = computeSlope == 0 ?
            8 : 4;

        return {
            slope: computeSlope,
            width: computeWidth
        };
    }


    computeSlope(position) {
        var index = parseInt(position / this.segment);

        if (index < this.etapa.length) {
            return this.etapa[index];
        } else {
            return 0;
        }
    }
}

module.exports = Profile;