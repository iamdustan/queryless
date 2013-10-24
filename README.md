# Queryless, with Rework

[![Build Status](https://travis-ci.org/iamdustan/queryless.png?branch=master)](https://travis-ci.org/iamdustan/queryless)
[![Code Climate](https://codeclimate.com/github/iamdustan/queryless.png)](https://codeclimate.com/github/iamdustan/queryless)

Queryless is a [rework](https://github.com/visionmedia/rework) utility
to automatically create media-query free stylesheets for archaic
browsers such as IE8.

## Usage

Simply pass in queryless to your rework pipeline with an array of
media queries you would like to extract. The match is based on the media
queries you are using in your project. They don't have to be an exact
match, but is a subset. Look in `test/cases` for examples.

```
// Create a stylesheet with all media queries that match
// larger than 600px wide and the print media block.

var keepmatches = [
  'screen and (min-width: 600px)', // assumes the units entered here are the same used in your CSS.
  'print'
];

var css = rework(input)
  .use(queryless(keepmatches))
  .toString();
```

## Upgrade Note

The 0.0.x branch was much more complex and attempted to dynamically
resolve media queries. This was over-complicated waste&mdash;you know your
media-queries best.

In 0.1.x the match is string based. It should be much quicker and much
more dependable in complex situations.

## License

MIT.

