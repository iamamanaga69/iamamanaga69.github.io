# Layout rules

The grid is a 12-column asymmetric grid inside `--container`, `--gutter` at the
edges. The point of 12 columns is that content **does not** use all of them.

Column assignments that keep the page from looking centred and templated:

| Element              | Columns | Notes                                        |
|----------------------|---------|----------------------------------------------|
| Hero headline        | 1 – 9   | Ragged right. Never centre it.               |
| Hero sub-copy        | 1 – 6   | Sits under the headline, shorter measure.    |
| Section mono label   | 1 – 2   | `01`, `02` … in the left margin.             |
| Section heading      | 3 – 10  | Offset from the label, not stacked on it.    |
| Prose                | 3 – 8   | Capped at `--measure` (66ch).                |
| List rows            | 1 – 12  | Full bleed, separated by hairlines.          |
| Pull quote / POV     | 4 – 11  | The whitespace section. Nothing else in it.  |
| Work entry           | 1 – 7 / 8 – 12 | Text left, metric right. Alternate. |

Rhythm: no two adjacent sections may share a shape. A wide statement, then a
tight list, then a single image, then empty space. If you can describe two
sections in a row with the same sentence, redesign one of them.

Vertical: `--space-section` between sections, and nothing else. Do not invent
per-section padding.

Alignment: everything is left-aligned except numbers in a right-hand metric
column. There is no centred text on this site apart from, at most, the footer
legal line.

Breakpoints: mobile-first, `min-width` queries at 640 / 900 / 1180. At mobile
every multi-column block collapses to one column and the mono labels move inline
above their headings.
