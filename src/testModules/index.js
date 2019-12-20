import { area, circumference } from './circle.js'
import Cat from './cat.js'

const r = process.argv[2] || 3
console.log(`Circle with radius ${r} has
  area: ${area(r)}
  circumference: ${circumference(r)}`)

const cat = new Cat();
console.log(cat.makeSound());
