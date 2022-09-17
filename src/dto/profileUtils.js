

function positionInProfile(profile, cyclist) {
  return cyclist.position.x / profile.getLengthInMeters();
}


exports.positionInProfile= positionInProfile;