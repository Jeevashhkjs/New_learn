const listOfProducts = document.querySelector(".listOfProducts")
const buttons = document.querySelector(".btn")
const inputsearch = document.querySelector(".inputsearch")
const footer = document.querySelector(".footer")
const left = document.querySelector(".fa-angle-left")
const right = document.querySelector(".fa-angle-right")
const contents = document.querySelector(".checkboxes")



let datas = []

window.addEventListener("DOMContentLoaded", () => {
    fetchingItems()

})

function fetchingItems() {
    fetch("http://localhost:3000/projects")
        .then(res => res.json())
        .then(json => {
            json.forEach(element => {
                datas.push(element)
            })
                displayButton();
               
                clicks(datas);
                searchingFunction(datas)
        })

}


function listOfitem(data) {
    if(data.length > 0)
    {

    let products = data.map((elem) =>

        `<div class="list">
            <p class="starts">${elem.project_name.slice(0, 2).toUpperCase()}</p>
  
            <div>
                <p class="ProjecName">${elem.project_name}</p>
                <p class="owenerName">${elem.owner_name}</p>     
            </div> 
            <div class="starreds">
            </div>  
            <div class="trash">
            <i class="fa-solid fa-trash" id=${elem.id}></i>
            </div>
        </div>`

    ).join("")
   

    listOfProducts.innerHTML = products
    clicks(datas)
    }
    else
    {

        listOfProducts.innerHTML = `<h1>No records found</h1>`
    }
    // footer.innerHTML = `<h2 class=numberOfcounts>Number of records ${data.length}</h2>`

}


function checkBoXFunctionality(datas) {
    if(datas.length > 1)
    {
        const owner_name = datas.map((elem)=>elem.owner_name)


        const RemovingDuplicateNames = [...owner_name.filter((list,index)=>{
            return owner_name.indexOf(list) == index;
        })]

        buttons.innerHTML = RemovingDuplicateNames.map((elem)=>{
            return `<input type = "checkbox" value = ${elem} id=${elem} class="check" checked>
                <label for=${elem}>${elem}</label>
            `
        }).join("")

    }
    else
    {
        buttons.innerHTML = ""
    }
}









function category(datas) {

    let allcategory = datas.map((lists) => lists.category)
    let starred = datas.map((lists) => lists.is_starred)


    let allItems = [...allcategory.filter((elements, idx) => {
        return allcategory.indexOf(elements) == idx
    })]
    let allstarred = [...starred.filter((elements, idx) => {
        return starred.indexOf(elements) == idx
    })]

    buttons.innerHTML =
        allstarred.map((listOfCategory) => {
            if (listOfCategory) {
                return `<button class="dynamicChange">${"starred"}</button>`
            }
        }).concat(
            allItems.map((listOfcat) => {
                if(listOfcat == "My Projects")
                {
                    return `<button class="dynamicChange dynamicColor">${listOfcat}</button>`
                }
                else{
                return `<button class="dynamicChange">${listOfcat}</button>`
                }
            })
        ).join("")

    const btns = document.querySelectorAll(".dynamicChange")
    btns.forEach((btn) => {

        btn.addEventListener("click", (e) => {
            const btns = document.querySelectorAll(".dynamicChange")
            btns.forEach((btns)=>{
                btns.className = "dynamicChange";
            })
            let target = e.target.innerText
            if (target == "My Projects") {
                e.target.classList.add("dynamicColor")
                listOfitem(datas)
                clicks(datas)
            }
            else if (target == "starred") {
                e.target.classList.add("dynamicColor")
                listOfitem(datas.filter((filterList) => filterList.is_starred))
                clicks(datas.filter((filterList) => filterList.is_starred))
            }
            else {
                e.target.classList.add("dynamicColor")
                listOfitem(datas.filter((filterList) => filterList.category == target))
                clicks(datas.filter((filterList) => filterList.category == target))
            }
        })
    })    
        }


        function searchingFunction(datas) {
            category(datas) 
            inputsearch.addEventListener("keyup", (e) => {
                let tar = e.target.value.toLowerCase().trim()
                if(tar)
                {
                    listOfitem(datas.filter((elem)=>elem.project_name.toLowerCase().indexOf(tar) != -1))
                    checkBoXFunctionality(datas.filter((elem) => elem.project_name.toLowerCase().indexOf(tar) != -1))
                }
                else
                {
                    listOfitem(arrays)
                    category(datas)
                    clicks(datas)
                }

                const checkboxes = document.querySelectorAll(".check")
                for (let j = 0; j < checkboxes.length; j++) {
                    // console.log(checkboxes[j]);
                   checkboxes[j].addEventListener("click",()=>{
                    let searchValues = checkboxes[j].value

                    if(checkboxes[j].checked == false)
                    {
                        // console.log(checkboxes[j]);
                        listOfitem(datas.filter((elem) => elem.owner_name.indexOf(searchValues) != -1))
                    }
                    else if(checkboxes[j].checked == true)
                    {
                      listOfitem(datas.filter((elem)=>elem.project_name.toLowerCase().indexOf(tar) != -1))
                    }
                   })
                    
                }
              })
        
        }



















        function clicks(starredDatas) {

            let starreds = document.querySelectorAll(".starreds")
            for (let i = 0; i < starreds.length; i++) {
                if (starredDatas[i].is_starred) {
        
                    starreds[i].innerHTML = ` <i class="fa-solid fa-star icon" id=${starredDatas[i].id}></i>`
        
                }
                else {
        
                    starreds[i].innerHTML = `<i class="fa-regular fa-star icon" id=${starredDatas[i].id}></i>`
                }
                let star = document.querySelectorAll(".icon")
                star[i].addEventListener("click", () => {
                    putFuncaitonality(star[i].id, starredDatas)
                })
            }
        
        
            let trashes = document.querySelectorAll(".trash i")
            trashes.forEach((deleting) => {
                deleting.addEventListener("click", () => {
                    fetch("http://localhost:3000/projects/" + deleting.id, {
                        method: "DELETE",
                        headers: { 'content-type': 'application/json' },
                    })
                })
            })
        }
        let data ;
        function putFuncaitonality(starredId, starredDatas) {

            starredDatas.forEach((elem) => {
                if (starredId == elem.id) {
        
                    let value = elem.is_starred == false ? true : false
                    data = {
                        "project_name": elem.project_name,
                        "owner_name": elem.owner_name,
                        "is_starred": value,
                        "category": elem.category
                    }
        
                    fetch("http://localhost:3000/projects/" + elem.id, {
                        method: "PUT",
                        headers: { 'content-type': 'application/json' },
                        body: JSON.stringify(data)
                        
                    })
                    .then(res => {
                        console.log("Requested Completed:", res);
                    }).catch((err) => console.log(err))
                }
            })
        
        
        }
        


const indexBtn = document.querySelector('.pagination')

let arLength = 0;
let records_per_page = 10;
let startIndex = 1;
let endIndex = 0;
let currentIndex = 1;
let maxIndex = 0;

function preLoadCalculation(arr) {
    arLength = arr.length
    maxIndex = arLength / records_per_page

    if ((arLength % records_per_page) > 0) {
        maxIndex++
    }
}

let val = 1;
function displayButton() {
    preLoadCalculation(datas)


    const PrevtBtn = document.createElement('button')
    PrevtBtn.setAttribute('class', 'prev')
    PrevtBtn.innerHTML = '<ion-icon name="chevron-back-outline"></ion-icon>'
    indexBtn.append(PrevtBtn)
    // console.log(maxIndex);

    for (let i = 1; i <= maxIndex; i++) {
        const page = document.createElement('button')
        page.setAttribute('class', 'pageBtn')
        page.setAttribute('id', val++)
        page.innerText = i
        indexBtn.append(page)
    }

    const nextBtn = document.createElement('button')
    nextBtn.setAttribute('class', 'next')
    nextBtn.innerHTML = '<ion-icon name="chevron-forward-outline"></ion-icon>'
    indexBtn.append(nextBtn)


    const inpPage = document.createElement('input')
    inpPage.setAttribute('class', 'inpPage')
    inpPage.setAttribute('max', '0')
    indexBtn.append(inpPage)

    highlightsIndexBtn()

    const nexts = document.querySelector('.next')
    const prevs = document.querySelector('.prev')
    const doubleNext = document.querySelector("nexts")
    // console.log(nexts);

    function next() {
        arrays = [];
        if (currentIndex < maxIndex) {
            currentIndex++
            highlightsIndexBtn()
        }

        clicks(arrays)
    }

    function prev() {
        arrays = [];
        if (currentIndex > 1) {
            currentIndex--
            highlightsIndexBtn()
        }
        clicks(arrays)
        nexts.classList.remove('hidden')
    }
    function indexPagination(index) {
        arrays = [];
        if (currentIndex = parseInt(index)) {
            highlightsIndexBtn()
        }
        clicks(arrays)
    }


    nexts.addEventListener('click', next)
    prevs.addEventListener('click', prev)
  

    const page = document.querySelectorAll('.pageBtn')

    page.forEach((elem, idx) => {
        elem.addEventListener('click', () => {
            indexPagination(elem.id)
            if (endIndex == arLength) {
                nexts.classList.add('hidden')
            }
            else {
                nexts.classList.remove('hidden')
            }
        })
    })
    const inputBox = document.querySelector('.inpPage')
    inputBox.addEventListener('keyup', () => {
        let pNo = inputBox.value
        indexPagination(pNo)
        if (endIndex == arLength) {
            nexts.classList.add('hidden')
        }
        else {
            nexts.classList.remove('hidden')
        }
    })

}

function highlightsIndexBtn() {
    startIndex = ((currentIndex - 1) * records_per_page) + 1
    endIndex = (startIndex + records_per_page) - 1
    if (endIndex > arLength) {
        endIndex = arLength
    }

    const allBtn = document.querySelectorAll('.pagination>button')
    for (let j = 0; j < allBtn.length; j++) {
        allBtn[j].classList.remove('active')
    }
    allBtn[currentIndex].classList.add('active')

    displayData()
}
let arrays = []
function displayData() {
    let start = startIndex - 1
    let end = endIndex
    const footer = document.querySelector('.footer')
    console.log(footer);
    footer.innerHTML = `showing ${startIndex} to ${endIndex} of ${arLength}`;
    for (let f = start; f < end; f++) {
        arrays.push(datas[f]);
    }
    listOfitem(arrays);
    const nexts = document.querySelector('.next')
    if (endIndex == arLength) {
        nexts.classList.add('hidden')
    }
}