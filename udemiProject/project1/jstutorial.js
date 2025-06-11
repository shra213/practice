/*
let fullName = prompt("Enter your full name");

let username = `@${fullName}${fullName.length}`;
console.log(username);
*/



/*
let gameNum = 25;
let userName = prompt("guess the no.");
while (userName != gameNum)
{
    userName = prompt("you enter wrong no,guess again");
}
console.log("Congratulations");
*/



/*
let marks = [87,45,45,67,56];
let total = 0 ;
for(let i = 0 ; i < 5; i++){
    total = marks[i] + total ;
}
console.log(`avg value of array is ${total/5}`);
*/



/*
let prices = [250,450,350,225,150] ;
  for(let price of prices){
    let discount = price*0.1;
    price -= discount;
    console.log(`updated price is ${price}`);
  }


let arrowFun = (a,b)=>{
  return a*b;
}
*/



/*
let string = prompt("enter A word to find no. vowels");
function noVowels( x ){
  let vowelCount = 0;
  for(let i of x){
    if(i === "a"||i==="e"||i==="o"||i==="u"||i==="i"){
      vowelCount++;
    }
  }
  console.log(vowelCount);
}
noVowels(string);
*/



/*
let countVowel = ("shraddha") => {
  let vowelCount = 0;
  for(let i of x){
    if(i === "a"||i==="e"||i==="o"||i==="u"||i==="i"){
      vowelCount++;
    }
  }
  console.log(vowelCount);
}
*/

/*
let Nums = [1,2,3,4,5,];
Nums.forEach((num)=>{
  console.log(num*num);
});
*/



/*
let n = prompt("enter number to create array of numbet to n");
let arr = [];
for(let i = 1 ; i <= n ; i++){
  arr[i-1] = i;
}
console.log(arr);
let sum = arr.reduce((prev , curr) => {
  return prev + curr;
})
console.log(`sum of the array element is ${sum}`);
let mul = arr.reduce((prev , curr) => {
  return prev * curr;
})
console.log(`multiplication of the array element is ${mul}`);
*/


/*
let mdBtn = document.querySelector("#mdbtn");
let mode = "light";
let body = document.querySelector("body");
mdBtn.addEventListener("click", () => {
  if(mode === "light") {
    mode = "dark";
    body.style.backgroundColor = "black";
  } else {
    mode = "light";
    body.style.backgroundColor = "White";
  }
  console.log(mode);
})
*/


/*
class user {
  constructor(name,email){
    this.name = name;
    this.email = email; 
  }
  viewData () {
    console.log("view data");
  }
};

class admin extends user {
  editdata(name,email){
    console.log("edit data");
  }
}

let A1 = new admin("shraddha","abc@gmail.com");
A1.viewData;
*/

/*
let name = prompt("enter name");
console.log(name);
let capletter = name[0].toUpperCase();
let remletter = name.slice(1,name.length);
console.log(remletter);
let capName = capletter + remletter; 
console.log(capName);
*/

let msg = document.querySelector(".msg");
let img1 = document.querySelector(".P1");
console.log("previous dice1", img1);
let img2 = document.querySelector(".P2");
console.log("previous dice2",img2);

let RandomNo1 = Math.floor(Math.random()*6)+1;
let RandomNo2 = Math.floor(Math.random()*6)+1;

  img1.setAttribute("src", "/udemiProject/project1/dice" + RandomNo1 + ".png");
  console.log("dice1 thrown", RandomNo1);

  img2.setAttribute("src", "/udemiProject/project1/dice" + RandomNo2 + ".png");
  console.log("dice2 thrown", RandomNo2);
// img1.setAttribute("src", "/dice" + RandomNo2 + ".png");

if(RandomNo1 > RandomNo2){
  msg.innerText = "♥ Player 1 Win !!";
  msg.style.color = "cyan";
}else if(RandomNo1 === RandomNo2){
  msg.innerText = "Draw 😁";
  msg.style.color = "yellow";
}else{
  msg.innerText = "Player 2 Win !! ♥";
  msg.style.color = "pink";
}