function criarLoja() {
    let input = document.getElementById("novaLoja")
    let loja = input.value.trim()
    if (loja === "") {
        alert("Digite uma loja valida")
    }

    let item = document.createElement("li")
    item.innerHTML = `${loja} <button onclick="remover(this)"> Remover </button>`

    document.getElementById("lista").appendChild(item)

    input.value = ""
    input.focus()
}

function remover(botao) {
    let li = botao.parentElement;
    li.remove()
}