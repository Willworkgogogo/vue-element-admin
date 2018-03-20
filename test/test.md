> 手上在整理vue admin的东西，关于axios的内容，用到什么就详细整理一下对应的api

`注意几点`
- axios请求的结果以Promise形式返回


### 1. get请求

```js
  // get方法接收一个url参数, 第二个参数(可选)是一个对象，对象的属性是固定的为params，即请求需要带的参数
  axios.get('/user?ID=123')
    .then(function(res){
      console.log(res)
    })
    .catch(function(error){
      console.log(error)  
    })

  // 带第二个参数的写法
  axios.get('/user', {
    params: {
      ID: 123
    }
  })
  .then(function(res){
    console.log(res)
  })
  .catch(function(error){
    console.log(error)
  })  
```

### 2. post请求

```js
  // post方法，固定的接收两个参数，第一个是url地址， 第二个是需要提交的参数对象
  axios.post('/user', {
    firstName: 'will',
    lastName: 'wang'
  })
  .then(function(res){
    console.log(res)
  })
  .catch(function(error){
    console.log(error)
  })
```

### 3. 并发请求

> 并发请求，即实现多个请求同时发出，并发时长由请求接口中耗时最长的接口决定

```js
  // 步骤 1. 定义请求函数
  function getUserAccount() {
    return axios.get('/user/12345')
  }
  function c {
    return axios.get('/user/12345/permission')
  }
  
  // 2. 调用axios的all方法，实现并发，依次获取结果
  // all方法接收一个数组作为参数，数组的每项，是返回结果为一个axios请求的函数
  axios.all([getUserAccount(), getUserAccount()])
    .then(axios.spread(function(acct, perms) {
      // 当并发的请求都完成后，才会调用该函数
      // acct 为接口1获得结果
      // perms 为接口2获得结果
    }))
```