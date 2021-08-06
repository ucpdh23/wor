define([
], function () {
    const UtilsService = {
        getColorForPercentage(pct, percentColors) {
            for (var i = 1; i < percentColors.length - 1; i++) {
                if (pct < percentColors[i].pct) {
                    break;
                }
            }
            var lower = percentColors[i - 1];
            var upper = percentColors[i];
            var range = upper.pct - lower.pct;
            var rangePct = (pct - lower.pct) / range;
            var pctLower = 1 - rangePct;
            var pctUpper = rangePct;
            var color = {
                r: Math.floor(lower.color.r * pctLower + upper.color.r * pctUpper),
                g: Math.floor(lower.color.g * pctLower + upper.color.g * pctUpper),
                b: Math.floor(lower.color.b * pctLower + upper.color.b * pctUpper)
            };
            return color;
        },

        rgbToHex(rgb) {
            var hex = Number(rgb).toString(16);
            if (hex.length < 2) {
                hex = "0" + hex;
            }
            return hex;
        },

        pad(num, size) {
            var s = num + "";
            while (s.length < size) s = "0" + s;
            return s;
        },

        timestampToString(timestamp) {
            var seconds = parseInt(timestamp);
            var secsToDisplay = seconds % 60;

            var minutes = (seconds - secsToDisplay) / 60;
            var minToDisplay = minutes % 60;

            var hoursToDisplay = (minutes - minToDisplay) / 60;

            return this.pad(hoursToDisplay, 1) + ":" + this.pad(minToDisplay, 2) + ":" + this.pad(secsToDisplay, 2);
        }
    };

    return UtilsService;
});

