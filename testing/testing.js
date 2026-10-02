
function checkArr(a, b){
  for(let i = 0; i < a.length; i++){
    if(a[i] != b[i]){
      return false
    }
  }
  return true
}

function test(func, inp, exp){
    if(typeof(exp) != "object"){
        result = func(inp)
        if(result != exp){
            console.log(`%cFailed at ${inp}`, "color: red;");
            console.log('%cExpected:', "color: red;");
            console.log(exp)
            console.log('%cGot:', "color: red;");
            console.log(result)
        } else {
            console.log(`%cPassed at ${inp}`, "color: green;");
        }
    } else {
        result = func(inp)
        // If it is an object
        if(checkArr(exp, result)){
            console.log(`%cPassed at ${inp}`, "color: green;");
        } else {
            console.log(`%cFailed at ${inp}`, "color: red;");
            console.log('%cExpected:', "color: red;");
            console.log(exp)
            console.log('%cGot:', "color: red;");
            console.log(result)
        }
    } 
    console.log("----------")
}


console.log("Testing init")

test(extractVictimizationPairs, 'sex trafficking', ['sex trafficking'])
test(extractVictimizationPairs, 'sexual trafficking', ['sex trafficking'])
test(extractVictimizationPairs, 'labor trafficking', ['labor trafficking'])
test(extractVictimizationPairs, 'labor exploitation', ['labor exploitation'])
test(extractVictimizationPairs, 'sex exploitation', ['sex exploitation'])
test(extractVictimizationPairs, 'sexual exploitation', ['sex exploitation'])
test(extractVictimizationPairs, 'both sex and labor trafficking', ['sex trafficking', 'labor trafficking'])
test(extractVictimizationPairs, 'both sex trafficking and sex exploitation', ['sex trafficking', 'sex exploitation'])
test(extractVictimizationPairs, 'both labor trafficking and labor exploitation', ['labor trafficking', 'labor exploitation'])
test(extractVictimizationPairs, 'both sex & labor trafficking', ['sex trafficking', 'labor trafficking'])
test(extractVictimizationPairs, 'both sex trafficking & sex exploitation', ['sex trafficking', 'sex exploitation'])
test(extractVictimizationPairs, 'both labor trafficking & labor exploitation', ['labor trafficking', 'labor exploitation'])
test(extractVictimizationPairs, 'Both Labor Trafficking & Labor Exploitation', ['labor trafficking', 'labor exploitation'])
test(extractVictimizationPairs, 'Sex Trafficking, Labor Trafficking, & Sexual Exploitation', ['sex trafficking', 'labor trafficking', 'sex exploitation'])
test(extractVictimizationPairs, 'Labor Trafficking & Sexual Exploitation', ['labor trafficking', 'sex exploitation'])
test(extractVictimizationPairs, 'Sex Trafficking, Sexual Exploitation, & Labor Exploitation', ['sex trafficking', 'sex exploitation', 'labor exploitation'])
test(extractVictimizationPairs, 'Labor Trafficking, Sex Trafficking, & Sexual Exploitation', ['labor trafficking', 'sex trafficking', 'sex exploitation'])

