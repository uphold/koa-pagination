var assert = require('assert');

module.exports = function() {};

module.exports.prototype = {
  configure: function(options) {
    assert(
      'object' === typeof options,
      'requireSpacesInAnonymousFunctionExpression option must be the object'
      );

    if ('beforeOpeningRoundBrace' in options) {
      assert(
        true === options.beforeOpeningRoundBrace,
        'requireSpacesInAnonymousFunctionExpression.beforeOpeningRoundBrace ' +
        'property requires true value or should be removed'
        );
    }

    if ('beforeOpeningCurlyBrace' in options) {
      assert(
        true === options.beforeOpeningCurlyBrace,
        'requireSpacesInAnonymousFunctionExpression.beforeOpeningCurlyBrace ' +
        'property requires true value or should be removed'
        );
    }

    assert(
      options.beforeOpeningCurlyBrace || options.beforeOpeningRoundBrace,
      'requireSpacesInAnonymousFunctionExpression must have beforeOpeningCurlyBrace ' +
      ' or beforeOpeningRoundBrace property'
      );

    this._beforeOpeningRoundBrace = Boolean(options.beforeOpeningRoundBrace);
    this._beforeOpeningCurlyBrace = Boolean(options.beforeOpeningCurlyBrace);
  },

  getOptionName: function() {
    return 'requireSpacesInAnonymousFunctionExpressionEsnext';
  },

  check: function(file, errors) {
    var beforeOpeningRoundBrace = this._beforeOpeningRoundBrace;
    var beforeOpeningCurlyBrace = this._beforeOpeningCurlyBrace;
    var tokens = file.getTokens();

    file.iterateNodesByType(['FunctionExpression'], function(node) {
      var parent = node.parentNode;

      // Ignore syntactic sugar for getters and setters.
      if ('Property' === parent.type && ('get' === parent.kind || 'set' === parent.kind)) {
        return;
      }

      if (!node.id) {
        if (beforeOpeningRoundBrace) {
          var nodeBeforeRoundBrace = node;

          var functionTokenPos = file.getTokenPosByRangeStart(nodeBeforeRoundBrace.range[0]);
          var functionToken = tokens[functionTokenPos];

          var nextTokenPos = file.getTokenPosByRangeStart(functionToken.range[1]);
          var nextToken = tokens[nextTokenPos];

          if (nextToken && node.generator) {
            errors.add(
              'Missing space before opening round brace',
              nextToken.loc.start
              );
          }
        }

        if (beforeOpeningCurlyBrace) {
          var tokenBeforeBodyPos = file.getTokenPosByRangeStart(node.body.range[0] - 1);
          var tokenBeforeBody = tokens[tokenBeforeBodyPos];

          if (tokenBeforeBody) {
            errors.add(
              'Missing space before opening curly brace',
              tokenBeforeBody.loc.start
              );
          }
        }
      }
    });
  }
};
