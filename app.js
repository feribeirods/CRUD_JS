// FAZ APARECER O MODAL DE CADASTRO NA TELA

function iniciaModal() {
    var modal = document.querySelector('#modal-container')  
    
    modal.classList.add('mostrar')
}


//REMOVE O CADASTRO DE MODAL POR CLICK NO X OU POR CLICK FORA DA CAIXA
function fechaModal() {
    var modal = document.querySelector('#modal-container')
    clearFields() 

    modal.classList.remove('mostrar')    
}

var modal = document.querySelector('#modal-container') 

modal.addEventListener('click', (e) => {
    if (e.target.id == 'modal-container') {
        modal.classList.remove('mostrar')
        clearFields()
    }
})

const getLocalStorage = () => JSON.parse(localStorage.getItem('db_client')) ?? []
const setLocalStorage = (db_client) => localStorage.setItem("db_client", JSON.stringify(db_client))

// CRUD - CREATE
const createClient = (client) => {
    const db_client = getLocalStorage()
    db_client.push(client)
    setLocalStorage(db_client)
    
}

// CRUD - READ 
const readClient = () => getLocalStorage()

// CRUD - UPDATE
const updateClient = (index, client) => {
    const db_client = readClient()
    db_client[index] = client
    setLocalStorage(db_client)
}

//CRUD - DELETE 
const deleteClient = (index) => {
    const db_client = readClient()
    db_client.splice(index, 1)
    setLocalStorage(db_client)
}

//INTERAÇÃO COM O USUÁRIO
const isValidFields = () => {
    return document.querySelector('.modal-inputs').reportValidity()
}

const clearFields = () => {
    document.querySelector('#nome').value = ""
    document.querySelector('#email').value = ""
    document.querySelector('#fone').value = ""
    document.querySelector('#cidade').value = ""
}

function saveClient() {
    if(isValidFields()) {

        const client = {
            nome: document.querySelector('#nome').value,
            email: document.querySelector('#email').value,
            telefone: document.querySelector('#fone').value,
            cidade: document.querySelector('#cidade').value,
        }

        const index = document.getElementById('nome').dataset.index

        if (index == 'new') {
            createClient(client)
            updateTable()
            fechaModal()
        } else {
            updateClient(index, client)
            updateTable()
            fechaModal()
        }
    }
}

const createRow = (client, index) => {
    const newRow = document.createElement('tr')
    newRow.innerHTML = `
    <td>${client.nome}</td>
    <td>${client.email}</td>
    <td>${client.telefone}</td>
    <td>${client.cidade}</td>
    <td> 
        <button id="edit-${index}" class="btn-crud btn-edit">Editar</button> 
        <button id="delete-${index}" class="btn-crud btn-del">Excluir</button> 
    </td>
    `
    document.querySelector('#tb_client>tbody').appendChild(newRow)
}

const clearTable = () => {
    const rows = document.querySelectorAll('#tb_client>tbody tr')
    rows.forEach(row => row.parentNode.removeChild(row))
}

const updateTable = () => {
    const db_client = readClient()
    clearTable()
    db_client.forEach(createRow)
}

updateTable()

const fillFields = (client) => {
    document.querySelector('#nome').value = client.nome,
    document.querySelector('#email').value = client.email,
    document.querySelector('#fone').value = client.telefone,
    document.querySelector('#cidade').value = client.cidade,
    document.querySelector('#nome').dataset.index = client.index,

    iniciaModal()
}

const editClient = (index) => {
    const client = readClient()[index]
    client.index = index
    fillFields(client)

}

const editDelete = (event) => {

    if (event.target.type == 'submit') {
        const [action, index] = event.target.id.split('-')

        if (action == 'edit') {
            editClient(index)

        } else {
            const client = readClient()[index]
            const response = confirm(`Deseja realmente deletar o cadastro de ${client.nome}`)
            if(response) {
            deleteClient(index)
            updateTable()
            }
        }
    }

}

document.querySelector('#tb_client>tbody').addEventListener('click', editDelete)

