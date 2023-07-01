

function positionInProfile(profile, cyclist) {
  return cyclist.position.x / profile.getLengthInMeters();
}

function tiempoObjetivoProfileCyclist(accumulate, cyclist) {
  return _tiempoObjetivoProfile(accumulate, 1, 1, 1) 
}

function tiempoObjetivoProfile(accumulate) {
  return _tiempoObjetivoProfile(accumulate, 1, 1, 1) 
}

function _tiempoObjetivoProfile(accumulate, deltaBajada, deltaLlano, deltaMon) {
  var tiempoBajada = accumulate.accBajada / (40 * deltaBajada);
  var tiempoLlano = accumulate.accLlano / (32 * deltaLlano) ;
  var avg_pendiente = accumulate.accDesnivel / accumulate.accMon / 10; 
  var tiempoMon = 0;
  if (avg_pendiente <= 3) {
    tiempoMon = accumulate.accMon / (30 * deltaMon)
  } else if (avg_pendiente <= 5) {
    tiempoMon = accumulate.accMon / (26 * deltaMon)
  } else if (avg_pendiente <= 7) {
    tiempoMon = accumulate.accMon / (22 * deltaMon)
  } else if (avg_pendiente <= 9) {
    tiempoMon = accumulate.accMon / (17 * deltaMon)
  } else if (avg_pendiente <= 11) {
    tiempoMon = accumulate.accMon / (13 * deltaMon)
  } else if (avg_pendiente <= 13) {
    tiempoMon = accumulate.accMon / (9 * deltaMon)
  } else if (avg_pendiente > 13) {
    tiempoMon = accumulate.accMon / (7 * deltaMon)
  }
  
  return 60 * 60 * (tiempoBajada + tiempoLlano + tiempoMon)
}


exports.positionInProfile= positionInProfile;
exports.tiempoObjetivoProfile= tiempoObjetivoProfile;
exports.tiempoObjetivoProfileCyclist = tiempoObjetivoProfileCyclist;