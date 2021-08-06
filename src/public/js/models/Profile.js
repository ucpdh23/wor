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

    this.data.push(
      {
        x: dist,
        y: elevation
      }
    );

    for (var i = 0; i < etapa.length; i++) {
      var slope = this.etapa[i];
      dist += this.segment;
      elevation += slope * this.segment / 100;
      this.data.push({ x: dist, y: elevation })

      prevSlope = slope;
    }

  };

  return ProfileClass;
});