let user = function (ops) {
  return { firstName: ops.firstName || 'John', 
    lastName: ops.lastName || 'Doe', 
    email: ops.email || 'test@test.com', 
    name: function() { return this.firstName + this.lastName}
  }
}

let agency = function(ops) {
  ops = ops || {}
  var agency = user(ops)
  agency.customers = ops.customers || 0
  agency.name = agency.name();
  agency.isAgency = true
  return agency
}

const ops = {
  firstName: 'Marco',
  lastName: 'Gordillo',
  email: 'marco@mail.com',
  customers: [
    'Juan', 'Pedro'
  ]
}

const agencyMarco = agency(ops)

console.log(agencyMarco);

(function(){console.log('Auto execute IIFE')}()); // before IIFE ; is necesary
(function(){console.log('Auto execute IIFE')})()

