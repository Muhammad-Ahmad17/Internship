const isPrimeNumber = (n) => {
    if (n<=2){
        return n === 2;
    }
    if(n%2===0){
        return false;
    }
    for(let i = 3; i <= Math.sqrt(n); i=i + 2){
        if(n%i===0){
            return false;
        }
    }
    return true;
}
console.log(isPrimeNumber(97));