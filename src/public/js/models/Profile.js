define([], function () {
  const ProfileClass = function (clasificacion, etapa) {
    this.etapa = etapa;
    this.clasificacion = clasificacion;

    this.data = [];
    this.segment = 1000;
    this.portInfos = [];
    this.clasificacion = null;

    var elevation = 0;
    var dist = 0;

    this.clasificacion = clasificacion;
/*
    this.data.push(
      {
        x: dist,
        y: elevation
      }
    );*/

    var portInfo = null;
    var prevSlope = 0;
    for (var i = 0; i < etapa.length; i++) {
      var slope = this.etapa[i];
      dist += this.segment;
      elevation += slope * this.segment / 100;
      this.data.push({ x: dist, y: elevation })

      ///////------------
      if (prevSlope == 0 && slope > 0 && portInfo == null) {
        portInfo = {
          size: 0,
          slopeAvg: 0,
          startKms: i,
          endKms: 0,
          totalKms: 0,
        };
      } else if (prevSlope > 0 && slope < 0 && portInfo != null) {
        portInfo.endKms = i;
        portInfo.totalKms = portInfo.endKms - portInfo.startKms;
        portInfo.slopeAvg = portInfo.slopeAvg / portInfo.totalKms;

        this.portInfos.push(portInfo);

        portInfo = null;
      }

      if (portInfo != null) {
        portInfo.slopeAvg += slope;
      }

      prevSlope = slope;
    }



    if (portInfo != null) {
      portInfo.endKms = i;
      portInfo.totalKms = portInfo.endKms - portInfo.startKms;
      portInfo.slopeAvg = portInfo.slopeAvg / portInfo.totalKms;

      this.portInfos.push(portInfo);
    }

  };

  return ProfileClass;
});