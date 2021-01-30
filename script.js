let cart = []
let modalQt = 1
let modalKey = 0

const $ = el => document.querySelector(el)
const $$ = el => document.querySelectorAll(el)
pizzaJson.map((item, index) => {
    //adciona informações da pizza a tela
    pizzadisplay(item.img, item.price, item.name, item.description)

    //seleciona o modelo das pizzas
    const pizzas = $(".models .pizza-item").cloneNode(true)

    //selecionando a pizza
    pizzas.querySelector("a").addEventListener("click", (e) => {
        //removendo o efeito da tag "a"
        e.preventDefault()

        //adicionando quantidades de pizza padrão
        modalQt = 1

        //salvando a pizza selecionada
        modalKey = index

        $(".pizzaInfo--qt").innerHTML = modalQt

        //selecionando tamanhos
        $$(".pizzaInfo--size").forEach((size, selectIndex) => {
            size.addEventListener("click", () => {
                $(".pizzaInfo--size.selected").classList.remove("selected")
                size.classList.add("selected")
            })
        })
        //adicionando efeito
        $(".pizzaWindowArea").style.opacity = 0
        setTimeout(() => {
            $(".pizzaWindowArea").style.opacity = 1
        }, 1)

        //mostrando a tela de seleção da pizza
        $(".pizzaWindowArea").style.display = "flex"
        
        //fechando a tela de seleção da pizza
        $$(".pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton").forEach((item) => {
            item.addEventListener('click', closeModal)
        })

        //adicionando informações a seleção de pizza
        pizzawindow(pizzaJson[index].img, pizzaJson[index].name, pizzaJson[index].description, pizzaJson[index].price,)

        //removendo seleção do tamanho da pizza
        $(".pizzaInfo--size.selected").classList.remove("selected")

        $$(".pizzaInfo--size").forEach((size, selectIndex) => {
            //adicionando seleção do tamanho da pizza
            if(selectIndex === 2) {
                size.classList.add("selected")
            }
            size.querySelector("span").innerHTML = pizzaJson[index].sizes[selectIndex]
        })
    })
    //adiciona as pizzas na tela
    $(".pizza-area").append(pizzas)
})

//adicionando pizzas
$(".pizzaInfo--qtmais").addEventListener('click', () => {
    modalQt += 1
    $(".pizzaInfo--qt").innerHTML = modalQt
})

//removendo pizzas
$(".pizzaInfo--qtmenos").addEventListener('click', () => {
    if(modalQt > 1) {
        --modalQt
    $(".pizzaInfo--qt").innerHTML = modalQt
    } else{
        closeModal()
    }
})

//adicionando pizzas ao  carrinho
$(".pizzaInfo--addButton").addEventListener("click", () => {
    let size = parseInt($(".pizzaInfo--size.selected").getAttribute('data-key'))
    //adicionando ao carrinho
    let indentifier = pizzaJson[modalKey].id+"@"+size
    let key = cart.findIndex((item)=>item.indentifier == indentifier)
    if(key > -1) {
        cart[key].qt += modalQt
    } else {
        cart.push({
            indentifier,
            id:pizzaJson[modalKey].id,
            size,
            qt:modalQt,
        })
    }
    updateCart()
    closeModal()
})

//fechando tela de pizzas
function closeModal() {
    $(".pizzaWindowArea").style.opacity = 0
        setTimeout(() => {
            $(".pizzaWindowArea").style.display = "none"
        }, 500)
}

$('.menu-openner').addEventListener('click', ()=> {
    if (cart.length > 0) {
        $('aside').style.left = 0
    }
})

$(".menu-closer").addEventListener('click', ()=> $('aside').style.left = "100vw")

//atualiza o carrinho
function updateCart() {
    $(".menu-openner span").innerHTML = cart.length
    if (cart.length > 0 ) {
        $("aside").classList.add("show")
        $(".cart").innerHTML = ''

        let subtotal = 0
        let desconto = 0
        let total = 0

        for (let i in cart) {
            const pizzaItem = pizzaJson.find((item) => item.id == cart[i].id)
            subtotal += pizzaItem.price * cart[i].qt

            const cartItem = $(".cart--item").cloneNode(true)
            let sizePizza = ''
            if(cart[i].size === 0) {
                sizePizza = "P"
            } else if (cart[i].size === 1) {
                sizePizza = "M"
            }else if (cart[i].size === 2) {
                sizePizza = "G"
            }

            cartItem.querySelector('img').src = pizzaItem.img
            cartItem.querySelector(".cart--item-nome").innerHTML = `${pizzaItem.name} (${sizePizza})`
            cartItem.querySelector(".cart--item--qt").innerHTML = cart[i].qt

            cartItem.querySelector(".cart--item-qtmais").addEventListener("click", () =>{
                cart[i].qt++
                updateCart()
            })

            cartItem.querySelector(".cart--item-qtmenos").addEventListener("click", () =>{
                if (cart[i].qt > 1) {
                    cart[i].qt--
                } else {
                    cart.splice(i, 1)
                }
                updateCart()
            })
            $('.cart').append(cartItem)
        }
        desconto = subtotal * 0.1
        total = subtotal - desconto

        $$('.subtotal span')[1].innerHTML = `R$ ${subtotal.toFixed(2)}`
        $$('.desconto span')[1].innerHTML = `R$ ${desconto.toFixed(2)}`
        $$('.total span')[1].innerHTML = `R$ ${total.toFixed(2)}`
    } else {
        $("aside").classList.remove("show")
        $('aside').style.left = "100vw"
    }
}

//adicionando pizzas a tela
function pizzadisplay(img, price, name, desc) {
    $(".pizza-item--img img").src = img
    $(".pizza-item--price").innerHTML = `R$ ${price.toFixed(2)}`
    $(".pizza-item--name").innerHTML = name
    $(".pizza-item--desc").innerHTML = desc
}

//adicionando informações a seleção de pizza
function pizzawindow(img, name, desc, price) {
    $(".pizzaBig img").src = img
    $(".pizzaInfo h1").innerHTML = name
    $(".pizzaInfo--desc").innerHTML = desc
    $(".pizzaInfo--actualPrice").innerHTML = `R$ ${price.toFixed(2)}`
}