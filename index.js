let info = []
const search = document.querySelector(".search>input")
const btn = document.querySelector(".btn")
const WeatherDetails = document.querySelector(".WeatherDetails")

window.addEventListener("DOMContentLoaded",()=>{
    fetch('https://api.openweathermap.org/data/2.5/weather?q=chennai&appid=d155da8fa4a20d79453b73bd3ce86aff')
    .then(res=> res.json())
.then(json=>{
        info=[json]
         weathers(info)
         console.log(info);
})
})
// its is a button for using fecth a particular city


btn.addEventListener("click",(e)=>{
    let city = search.value
    if(search.value == ""){
        alert("Please Enter The City")
    }
    fetch('https://api.openweathermap.org/data/2.5/weather?q='+city+'&appid=d155da8fa4a20d79453b73bd3ce86aff')
    .then(res=> res.json())
    .then(json=>{
         info=[json]
         weathers(info)
})
    search.value = ""
})

// its is function 

function weathers(data){
   let allDatas = data.map((elem)=>{
    let icon = elem.weather.map((element)=>element.icon)
    let des = elem.weather.map((element)=>element.description)
    const date = new Date((elem.dt - elem.timezone) * 1000)
    date.toGMTString()
   let temp = Math.floor(elem.main.temp - 273.15)
   return`<div class="details">
      <h2>${elem.name}</h2>
      <p>${temp}&#8451</p>
      <img src=http://openweathermap.org/img/w/${icon}.png alt="">
      <p>Decsription : ${des}</p>
      <p>${date}</p>
   </div>
   `})
  WeatherDetails.innerHTML = allDatas
}
