class GroupsManager {
    constructor(stage) {
        this.stage = stage;
    }

    init() {
        console.log("Init GroupsManager...");
        this.computeProfile();
        this.computeCyclists();
        console.log("Initialized GroupsManager.");
    }

    updateGroups(newGroups, oldGroups) {
        const timestamp = this.stage.timestamp;

        for (var i=0; i < newGroups.length; i++) {
            const newGroup = newGroups[i];
            this._updateName(newGroup);
            const firstCyclist = newGroup.getFirst();
            const position = firstCyclist.position.x;
            const clockIndex = position % 100;


        }

        return newGroups;
    }

    _updateName(group) {
        var best = this.cyclists[group.cyclistsId[0]];
        for (var i = 0; i < group.cyclistsId.length; i++) {
            const id = group.cyclistsId[i];
            var candidate = this.cyclists[group.cyclistsId[id]];
            if (candidate.index > best.index) {
                this.best = candidate;
            }
        }

        group.name = best.name;
    }

    computeCyclists() {
        const factors = this._resolveFactors();
        const cyclists = {};
        for (var i = 0; i < this.stage.cyclists.length; i++) {
            const cyclist = this.stage.cyclists[i];
            const energy = cyclist.energy;

            const reference = {
                id: cyclist.id,
                name: cyclist.name,
                index: this._calculateIndex(energy, factors)
            };

            console.log("cyclist:" + reference.name + "->" + reference.index);
            cyclists[cyclist.id] = reference;
        }

        this.cyclists = cyclists;
    }

    _calculateIndex(energy, factors) {
        var output = 0;
        output += energy.llano * factors.plain;
        output += energy.montana * factors.climb;
        output += energy.bajada * factors.descend;
        output += energy.sprint * factors.sprint;

        return output;
    }

    _resolveFactors() {
        const output = {
            plain: 0.25,
            climb: 0.25,
            descend: 0.25,
            sprint: 0.25
        };

        if (this.profileFeatures.sprint > 0) {
            output.sprint *= this.profileFeatures.sprint;
        }

        output.plain *= this.profileFeatures.plain;
        output.climb *= this.profileFeatures.climb * 5;
        output.descend *= this.profileFeatures.descend / 5;

        const sum = output.plain + output.climb + output.descend + output.sprint;
        output.plain /= sum;
        output.climb /= sum;
        output.descend /= sum;
        output.sprint /= sum;

        return output;
    }

    computeProfile() {
        const profile = this.stage.profile;
        
        this.profileFeatures = this._resolveFeatures(profile);
    }

    _resolveFeatures(profile) {
        const output = {
            plain: 0,
            climb: 0,
            descend: 0,
            sprint: 0,
            total: profile.etapa.length
        };

        for (var i = 0; i < profile.etapa.length; i++) {
            var slope = profile.etapa[i];

            if (slope > 2) {
                output.climb += 1;
            } else if (slope < -5) {
                output.descend += 1;
            } else {
                output.plain += 1;
            }
        }

        if (profile.etapa[profile.etapa.length - 1] == 0) {
            for (var i = profile.etapa.length - 1; i >= 0 && i >= profile.etapa.length - 10; i--) {
                var slope = profile.etapa[i];
    
                if (slope < 3 && slope > -3) {
                    output.sprint += 1;
                }
            }
       }

        return output;
    }

}

module.exports = GroupsManager;