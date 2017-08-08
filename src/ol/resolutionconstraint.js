goog.provide('ol.ResolutionConstraint');

goog.require('ol.array');
goog.require('ol.math');
goog.require('ol.extent');


/**
 * @param {Array.<number>} resolutions Resolutions.
 * @return {ol.ResolutionConstraintType} Zoom function.
 */
ol.ResolutionConstraint.createSnapToResolutions = function(resolutions) {
  return (
    /**
     * @param {number|undefined} resolution Resolution.
     * @param {number} delta Delta.
     * @param {number} direction Direction.
     * @param {ol.Size=} opt_size Size of the viewport.
     * @return {number|undefined} Resolution.
     */
    function(resolution, delta, direction, opt_size) {
      if (resolution !== undefined) {
        var z =
              ol.array.linearFindNearest(resolutions, resolution, direction);
        z = ol.math.clamp(z + delta, 0, resolutions.length - 1);
        var index = Math.floor(z);
        if (z != index && index < resolutions.length - 1) {
          var power = resolutions[index] / resolutions[index + 1];
          return resolutions[index] / Math.pow(power, z - index);
        } else {
          return resolutions[index];
        }
      } else {
        return undefined;
      }
    });
};


/**
 * @param {number} power Power.
 * @param {number} maxResolution Maximum resolution.
 * @param {number=} opt_maxLevel Maximum level.
 * @param {ol.Extent=} opt_extent Extent.
 * @return {ol.ResolutionConstraintType} Zoom function.
 */
ol.ResolutionConstraint.createSnapToPower = function(power, maxResolution, opt_maxLevel, opt_extent) {
  return (
    /**
     * @param {number|undefined} resolution Resolution.
     * @param {number} delta Delta.
     * @param {number} direction Direction.
     * @param {ol.Size=} opt_size Viewport size to fit opt_extent into.
     * @return {number|undefined} Resolution.
     */
    function(resolution, delta, direction, opt_size) {
      if (resolution !== undefined) {
        // Override maxResolution if extent and size were given.
        if (opt_extent && opt_size) {
          var extentW = ol.extent.getWidth(opt_extent);
          var extentH = ol.extent.getHeight(opt_extent);
          maxResolution = Math.min(extentW / opt_size[0], extentH / opt_size[1]);
        }
        var offset = -direction / 2 + 0.5;
        var oldLevel = Math.floor(
            Math.log(maxResolution / resolution) / Math.log(power) + offset);
        var newLevel = Math.max(oldLevel + delta, 0);
        if (opt_maxLevel !== undefined) {
          newLevel = Math.min(newLevel, opt_maxLevel);
        }
        return maxResolution / Math.pow(power, newLevel);
      } else {
        return undefined;
      }
    });
};
