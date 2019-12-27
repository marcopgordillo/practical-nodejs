let funAsync = () => new Promise((resolve, reject) => {
  setTimeout(() => resolve(45), 1000)
})

let callFun = async () => {
  const number = await funAsync()
  console.log(number)
}

console.log(callFun())