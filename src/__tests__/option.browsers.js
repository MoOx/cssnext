import tape from "tape"

import cssnext from ".."

tape("cssnext browsers option", function(t) {

  const customPropsInput = ":root{--foo:bar}baz{qux:var(--foo)}"
  const customPropsOutput = "baz{qux:bar}"

  // fx 30 doesn't handle custom prop
  t.equal(
    cssnext({ browsers: "Firefox >= 30" }).process(customPropsInput).css,
    customPropsOutput,
    "should enable custom properties when browsers do not support it"
  )

  // fx 31 handle custom prop
  t.equal(
    cssnext({ browsers: "Firefox >= 31" }).process(customPropsInput).css,
    customPropsInput,
    "should NOT enable custom properties when browsers support it"
  )

  // fx 31 support but not IE 8
  t.equal(
    cssnext({ browsers: "Firefox >= 31, IE 8" }).process(customPropsInput).css,
    customPropsOutput,
    "should enable custom properties when at least one browsers do not " +
      "support it"
  )

  t.end()
})

tape("cssnext browsers option propagation to autoprefixer", function(t) {
  const input = "body{transition: 1s}"
  const output = "body{-webkit-transition: 1s;transition: 1s}"

  // Safari 6 need -webkit prefix
  t.equal(
    cssnext({ browsers: "Safari 6" }).process(input).css,
    output,
    "should propagate browsers option to autoprefixer"
  )

  // Safari 6.1 do not need -webkit prefix
  t.equal(
    cssnext({ browsers: "Safari 6.1" }).process(input).css,
    input,
    "should propagate browsers option to autoprefixer"
  )

  t.end()
})
