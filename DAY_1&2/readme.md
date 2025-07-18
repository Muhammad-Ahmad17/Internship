================================ JS IMP NOTES ================================

==> let&const braces scope hota ha means () k andar tak hi kam kary ga 
	for (let i = 2  ; i < 34 ; i ++ ){
		console.log(i); 
	}
		console.log(i);  // undefind : is ka bahar access nahi ho ga
> let new js me ha 
> let does'nt adds itself to window object	
	
==> var function scoped hota ha {} k andar access ho ga chay us k andr ap nay loop me define kia ha vo outside the loop and inside the function accessable ho ga 
		for (let i = 2  ; i < 34 ; i ++ ){
		console.log(i); 
		}
		console.log(i);  // accessable
>  var old js say ha 
> var adds itself to window object

==> window objects are those whos definations are given by browser like alert ("ohhh!"); ye js ka part ni ha ye window ka part ha

> broeser par window likho sary objects a jain gay 
> let 2 variables: 
	let a = 56; // open browser and call window object it dosent show a ki value
	var b = 45; // open browser and call window object it show b ki value
	
	
==> hoisting ka matlab ha k han asy variable ko cal kar rahy hn jis ki defination abhi tak ni hoi yani abhi us ko let a = 5; ni kia 
	console.log (a) ; // undefined 
	let a = 5 ;
	
	var a = 5; // combine 
	var a ; // decleration 
	a = 5 ; // initialization 
	
	in js when we do combine decleration part goes at the top of the code 

==> undefined vs not-defined 
	> undefined means chiz exist karti h par us ki value ni pata mujhy lakin chiz ka wajod ha 
	> not-defined means chiz exist hi ni karti 
	
	
==> execution context 
	func1 () {
		let a =6 ; 
		func2 (){
			let b =8 ;
		}
	}
	func1 ka execution context ha ka vo a ko access kar sakta ha  or func2 ko us k andr wali chizo ko ni access kar pay ga 
	
	Summary
> func1 ke andar ke variables (a) ko func2 access kar sakta hai:

> Kyunki func2 ka outer lexical environment func1 ka lexical environment hota hai.
Iska matlab func2 ke paas func1 ke variables tak poora access hota hai.
func1 ke paas func2 ke local variables (b) ka access nahi hota:

> Kyunki func2 ka scope sirf uske local execution context tak limited hota hai.

	Example
function func1() {
    let a = 6; // Variable in func1's scope
  
    
    function func2() {
      let b = 8; // Variable in func2's scope
      console.log(a); // Accessing parent function's variable
      console.log(b); // Accessing its own variable
    }
  
    func2();
  }
  
  func1();
	
	output
	6
	8
  
==> Lexical Environment is the structure that defines how variables and functions are organized and accessed in JavaScript. It is created every time a function or block of code is executed, and it determines the availability of variables within that specific scope.


==> pass by ref and pass by value 
> ref : () , {} , [] all of them are pass by ref and rest are pass by val
> 	let a=[1,2,3,4];
	let b= a ;
	b.pop();
	console.log (a) // [1,2,3]
	console.log (b) // [1,2,3] 
> both a and b changes cuz pass by ref 

==> solution of pass by ref
>	let a=[1,2,3,4];
	let b= [...a] ;
	b.pop();
	console.log (a) // [1,2,3,4]
	console.log (b) // [1,2,3] 

==> arr as an obj
	>	let a=[1,2,3,4];
		typeof (a) ; // obj 
		
	> arr = {
		0:1,
		1:2,
		2:3;
		3:4	
	}
	
	> we can give -ive index and value 
	
	arr[-1] = 9;

==> function and method
> function jo object k andr ho usy method kahty hn







