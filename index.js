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
      if (matchesQueries(rule.media, queries))
        return rules.concat(rule.rules);

      return rules;
    }, []);
  }
};

/**
 * Does the matched Rework AST rule fulfill any of the
 * media queries options passed in.
 *
 * @param {String} rule a media query string. `screen and (min-width: 600px)`
 * @param {Array} queries array of parsed media query objects.
 * @return Boolean
 * @private
 */
function matchesQueries(rule, queries) {
  var matches = queries.map(stringToMediaQuery).filter(matchesRule.bind(null, stringToMediaQuery(rule)));
  return matches.length > 0;
}


/**
 * Does a given rule match a specific media query
 *
 * @param {MediaQuery} rule AST node from Rework
 * @param {MediaQuery} query MediaQuery object
 * @return Boolean
 * @private
 */
function matchesRule(rule, query) {
  // if it's not the correct type filter it out
  if (rule.dimension !== query.dimension) return false;

  if (query.amount === rule.amount)
    return true;

  if (rule.type === 'min')
    if (query.type === 'min')
      return query.amount < rule.amount;
    else
      return query.amount > rule.amount;
  else if (rule.type === 'max')
    if (query.type === 'max')
      return query.amount > rule.amount;
    else
      return query.amount < rule.amount;
}

/**
 * @constructor Object representing a css media query string
 */
function MediaQuery(options) {
  this.media = options.media;
  this.dimensions = options.dimension;
  this.type = options.type;
  this.amount = options.amount;
  this.unit = options.unit;
}

var VALUE_REGEX = /[^:]*:\s?(\w+)/;

/**
 * MediaQuery factory for strings
 *
 * @param {String} rule a media query rule (sans @media prefix)
 * @return {MediaQuery}
 * @private
 */
function stringToMediaQuery(rule) {
  var value = parseUnit(VALUE_REGEX.exec(rule)[1]);

  rule = rule.split(' ');
  var media = rule.shift();
  var dimensionParts = rule[1].split('-');
  var dimension = dimensionParts[1].replace(/:$/, '');
  var type = dimensionParts[0].replace(/^\(/, '');

  return new MediaQuery({
    media: media,
    dimension: dimension,
    type: type,
    amount: value.amount,
    unit: value.unit
  });
}

/**
 * Parse a given unit string into the amount and unit
 *
 * @param {any} any Anything that can be converted to a string. E.g. '7deg', ['50%']
 * @returns {string} unit
 */
function parseUnit(any) {
  var unit = String(any).replace(/\s+$/, '');
  unit = unit.match(/[a-z%]*$/i)[0]
  return {
    amount: parseFloat(any, 10),
    unit: unit
  }
}

