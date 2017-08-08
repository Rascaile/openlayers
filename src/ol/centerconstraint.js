goog.provide('ol.CenterConstraint');

goog.require('ol.extent');
goog.require('ol.math');


/**
 * @param {ol.Extent} extent Extent.
 * @return {ol.CenterConstraintType} The constraint.
 */
ol.CenterConstraint.createExtent = function(extent) {
  // Extent doesn't change, so we can store the size and center.
  var extentSize = ol.extent.getSize(extent);
  var extentCenter = ol.extent.getCenter(extent);
  return (
    /**
     * @param {ol.Coordinate|undefined} center Center.
     * @param {ol.Size=} opt_size Viewport size.
     * @param {number=} opt_resolution Viewport size.
     * @return {ol.Coordinate|undefined} Center.
     */
    function(center, opt_size, opt_resolution) {
      if (center) {
        var extent_ = extent;
        // TODO: Handle rotated views?
        // Restrict the extent further if size & resolution were given.
        if (opt_size && opt_resolution) {
          // Deltas can not be negative or we will create an invalid extent.
          // Clamp to the center when the restrictExtent has smaller display than the Viewport.
          var deltaX = Math.max((extentSize[0] - (opt_size[0] * opt_resolution)) / 2, 0);
          var deltaY = Math.max((extentSize[1] - (opt_size[1] * opt_resolution)) / 2, 0);
          extent_ = [
            extentCenter[0] - deltaX,
            extentCenter[1] - deltaY,
            extentCenter[0] + deltaX,
            extentCenter[1] + deltaY
          ];
        }
        return [
          ol.math.clamp(center[0], extent_[0], extent_[2]),
          ol.math.clamp(center[1], extent_[1], extent_[3])
        ];
      } else {
        return undefined;
      }
    });
};


/**
 * @param {ol.Coordinate|undefined} center Center.
 * @return {ol.Coordinate|undefined} Center.
 */
ol.CenterConstraint.none = function(center) {
  return center;
};
