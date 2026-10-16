// 定义了一个对象原型 dogProto，它包含一个方法 bark
const dogProto = {
  bark() {
    console.log('wang~');
  },
};
console.log('dogProto object:', dogProto); // {bark: ƒ}
console.log('dogProto.__proto__ (prototype of dogProto):', dogProto.__proto__); // Object.prototype
console.log('dogProto.__proto__ === Object.prototype:', dogProto.__proto__ === Object.prototype); // true
console.log(
  'dogProto.__proto__.__proto__ (prototype chain ends at):',
  dogProto.__proto__.__proto__
); // null
console.log(
  'Object.getPrototypeOf(dogProto) (prototype of dogProto):',
  Object.getPrototypeOf(dogProto)
); // Object.prototype

// 创建一个新对象，让它内部的 [[Prototype]] 指向 dogProto
const d = Object.create(dogProto);
console.log('d object (empty object created with dogProto as prototype):', d); // {}
console.log('d.__proto__ (prototype of d):', d.__proto__); // {bark: ƒ}
console.log("d.__proto__ === dogProto (is d's prototype dogProto?):", d.__proto__ === dogProto); // true
console.log("d.__proto__.__proto__ (prototype of d's prototype):", d.__proto__.__proto__); // Object.prototype
console.log(
  'd.__proto__.__proto__.__proto__ (end of prototype chain):',
  d.__proto__.__proto__.__proto__
); // null
d.bark(); // "wang~"
