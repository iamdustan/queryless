/**
 * Filter a Rework AST out of
 *
 * @param {Array} [queries] Array of media query strings
 * @param {String} [queries] 'none' to filter out all media blocks
 * @return {Function} function for reworks use pipeline
 * @api public
 */

module.exports = function(queries) {
  return function(style, rework){
    if (!queries || queries.length === 0) return style;

    style.rules = style.rules.reduce(function(rules, rule){
      if (!rule.type || rule.type !== 'media') {
        rules.push(rule);
        return rules;
      }

      // media-query free stylesheet
      if (queries === 'none') return rules;

      // TODO: potentially concat all matching rulesets
      // together. CSS minifiers may already do this.
      if (matchesQueries(rule.media, queries)) {
        if (rule.media === 'print') {
          rules.push(rule);
          return rules;
        }
        return rules.concat(rule.rules);
      }

      return rules;
    }, []);
  }
};

/**
 * Does the matched Rework AST rule fulfill any of the
 * media queries options passed in.
 *
 * @param {String} rule a media query string. `screen and (min-width: 600px)`
 * @param {Array} queries array of media query strings.
 * @return Boolean
 * @private
 */
function matchesQueries(rule, queries) {
  var matches = queries.filter(function(query) {
    return rule.indexOf(query) > -1;
  });
  return matches.length > 0;
}


