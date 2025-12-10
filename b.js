let x = {}
const y ="aman"
const z = "sagar"

  x[y]="watson"
  x[z] = "jack"


  object keys are always converted into strings.
  x["[object Object]"]

  When we use an object like y or z as a key, JavaScript automatically converts it into "[object Object]".

So internally, both x[y] and x[z] become:
