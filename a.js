function erroCheck(){
    throw new Error("params is required")
}

function requireParameterFunction(param = erroCheck()){
    console.log(param)
}
try {
    requireParameterFunction()
} catch (error) {
    console.log(error.message)  
}
