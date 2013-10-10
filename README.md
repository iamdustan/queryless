# Queryless, with Rework

Queryless is a [rework](https://github.com/visionmedia/rework) utility
to automatically create media-query free stylesheets for archaic
browsers such as IE8.

## Usage

Simply pass in queryless to your rework pipeline with an array of
media queries you would like to extract.

```
// Create a stylesheet with all media queries that match
// larger than 600px wide and the print media block.

var keepmatches = [
  'screen and (min-width: 600px)', // currently only supports pixels
  'print'
];

var css = rework(input)
  .use(queryless(keepmatches))
  .toString();
```

## License

MIT.

