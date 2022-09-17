class Profile {
    data = [];

    segment = 1000;

    portInfos = [];

    clasificacion = null;
    etapa = null;
    
    desnivelAcumulado = 0;

    constructor(clasificacion, etapa, segment) {
        this.etapa = etapa;
        this.segment = segment;
        this.totalMeters = this.etapa.length * this.segment;

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
            
            if (slope > 0) {
              var counter = this.segment * 10 / 1000;
              this.desnivelAcumulado = this.desnivelAcumulado + slope * counter;
            }

            if (prevSlope == 0 && slope > 0 && portInfo == null) {
                this.addListener(i * this.segment, (cyclist, portNumber) => {
                    cyclist.sendMessage('startPort', this.portInfos[portNumber]);
                }, port);

                portInfo = {
                    startingMeter: i * segment,
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

        //this._computePortsInfo();
       
        console.log("desnivel acumulado :" + this.desnivelAcumulado);
    }

    getLengthInMeters() {
        return (this.data.length -1) * this.segment;
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

    computeStatistics(posX) {
        return {
            stageKms: this.data.length * this.segment,
            stageAngle: this.desnivelAcumulado,
            pendingKms: this.data.length * this.segment - posX,
            pendingAngle: this._computePendingDesnivel(posX)
        };
    }


    /**
     * type:
     *  - 1: plane
     *  - 2: medium-montain
     *  - 3: montain
     * 
     * end:
     *  - 1: plane
     *  - 2: medium-montain
     *  - 3: montain
     * 
     * distante:
     *  - 1: short
     *  - 2: medium
     *  - 3: long
     * 
     */
    getType(){
      var type = (this.desnivelAcumulado < 100)? 1 : (this.desnivelAcumulado < 1000)?
            2 : 3;
      
      var end = 3;
      var dist=this.getLengthInMeters();
      var distance = (dist < 40)? 1 : 
        (dist < 45)? 2 : 3;
        
      return {
        type: type,
        end: end,
        distance: distance
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

    _computePendingDesnivel(position) {
        var desnivelAcumulado = 0;
        for (var port of this.portInfos) {
            if (position > port.startingMeter + port.kms * 1000)
                continue;

            var kms = port.kms;
            if (port.startingMeter < position && position < port.startingMeter + port.kms * 1000) {
                var meters = port.startingMeter + port.kms * 1000 - position;
                kms = meters / 1000;
            }

            var slope = port.slope;

            var desnivel = kms * slope * 10;

            desnivelAcumulado += desnivel;
        }

        return desnivelAcumulado;
    }

    _computePortsInfo() {
        var desnivelAcumulado = 0;
        for (var port of this.portInfos) {
            var kms = port.kms;
            var slope = port.slope;

            var desnivel = kms * slope * 10;

            desnivelAcumulado += desnivel;
        }

        this.desnivelAcumulado = desnivelAcumulado;
    }
}

module.exports = Profile;