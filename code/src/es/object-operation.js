// 创建对象的三种方式

// 创建对象方式一：字面量创建对象
var eason = {
  name: "陈奕迅",
  sex: "男",
  sing: function (song) {
    console.log(`${this.name}-${song}`);
  },
};

// 创建对象方式二：new Object()创建对象
var jay = new Object();
jay.name = "周杰伦";
jay.sex = "男";
jay.sing = function (song) {
  console.log(`${this.name}-${song}`);
};

// 创建对象方式三：构造函数创建对象
// 构造函数的命名习惯：首字母大写
// 构造函数的作用：创建对象
// 构造函数的特点：没有返回值，使用 new 调用；this 指向新创建的对象；可以给新创建的对象添加属性和方法
// 构造函数的使用：new 构造函数名(参数)
// 构造函数的本质：就是一个普通的函数，只是使用了 new 调用
// 构造函数的执行流程：
// 1.在内存中创建一个新的空对象
// 2.让 this 指向这个新的对象
// 3.执行构造函数里面的代码，给这个新的对象添加属性和方法
// 4.返回这个新的对象(构造函数不需要return)
function Star(name, sex) {
  this.name = name;
  this.sex = sex;
  this.sing = function (song) {
    console.log(`${this.name}-${song}`);
  };
}
var rene = new Star("刘若英", "女");
var emil = new Star("周华健", "男");

// 使用对象
console.log(typeof eason, eason);
console.log(eason.name);
eason.sing("十年");
jay.sing("红尘客栈");
rene.sing("后来");
emil.sing("朋友");

// 遍历对象
for (var key in rene) {
  console.log(`${key}: ${rene[key]}`);
}
