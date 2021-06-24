const mongoose = require('mongoose')
const Ticket = mongoose.model("Ticket")

Array.prototype.random = function () {
    return this[Math.floor((Math.random() * this.length))];
}

const makeHorizontal = (prizeAmount) => {
    let cellsField = [0, 0, 0, 0, 0, 0, 0, 0, 0]

    const startIndex = [0, 3, 7].random()
    const prizeCombination = [startIndex, startIndex + 1, startIndex + 2]

    prizeCombination.forEach(index => cellsField[index] = prizeAmount)

    return [ cellsField, prizeCombination ];
}

const makeVertical = (prizeAmount) => {
    let cellsField = [0, 0, 0, 0, 0, 0, 0, 0, 0]

    const startIndex = [0, 1, 2].random()
    const prizeCombination = [startIndex, startIndex + 3, startIndex + 6]
    
    prizeCombination.forEach(index => cellsField[index] = prizeAmount)

    return [ cellsField, prizeCombination ];
}

const makeDiagonal = (prizeAmount) => {
    let cellsField = [0, 0, 0, 0, 0, 0, 0, 0, 0]

    const prizeCombination = [0, 4, 8]
    
    prizeCombination.forEach(index => cellsField[index] = prizeAmount)

    return [ cellsField, prizeCombination ];
}

const makeReversedDiagonal = (prizeAmount) => {
    let cellsField = [0, 0, 0, 0, 0, 0, 0, 0, 0]

    const prizeCombination = [2, 4, 6]
    
    prizeCombination.forEach(index => cellsField[index] = prizeAmount)

    return [ cellsField, prizeCombination ];
}

const generateCellsSchema = (cellsField) => {
    const cellsSchema = cellsField.map((cell, index) => {
        return {
            id: index,
            value: cell
        }
    })
    return cellsSchema
}

const generateTicketSchema = (cellsSchema, cellsPrize, prizeCombination, ownerId) => {
    return {
        owner: ownerId,
        prize: cellsPrize,
        prizeCombination,
        cells: cellsSchema
    }
}

const generateCompleteField = (cellsField, cellsPrize) => {
    /* 
       Создаём сначала список с возможными призами для вставки в клетку. 
       Это делается путём удаления выпавшего приза их общего списка, а затем дупликацией каждой величины.
       Наверняка не самый эффективный метод, но рабочий и не костыльный
    */
    let allowedValues = [...TICKET_PRIZES]
    const prizeIndex = allowedValues.indexOf(cellsPrize)
    allowedValues.splice(prizeIndex, 1)
    allowedValues = allowedValues.flatMap(el => [el, el])

    /* 
       Затем вставляем в каждую ячейку рандомное значение (если это не ячейка из победной комбинации)
    */
    let newCellsField = []
    cellsField.forEach(el => {
        if (el === 0) {
            newCellsField.push(allowedValues.random())
            let currIndex = allowedValues.indexOf(cellsPrize)
            allowedValues.splice(currIndex, 1)
        } else {
            newCellsField.push(el)
        }
    })

    return newCellsField
}

const combinations = [makeHorizontal, makeVertical, makeDiagonal, makeReversedDiagonal]

module.exports = async (n, ownerId) => {
    for (let i = 0; i < n; i++) {
        const cellsPrize = TICKET_PRIZES.random() // TICKET_PRIZES - глобальная переменная
        const cellsCombination = combinations.random() // Выбираем рандомную функцию для заполнения клеток выигрышной комбинацией

        let [ cellsField, prizeCombination ] = cellsCombination(cellsPrize) // Заполняем клетки ТОЛЬКО выигрышной комбинацией

        cellsField = generateCompleteField(cellsField, cellsPrize) // Заполняем рандомно все остальные клетки

        const cellsSchema = generateCellsSchema(cellsField) // Делаем из списка с числами, список с объектами. Это делается для вставки поля в БД 
        const ticketSchema = generateTicketSchema(cellsSchema, cellsPrize, prizeCombination, ownerId) // Делаем полноценный объект билета для вставки в БД

        const ticket = new Ticket(ticketSchema)
        await ticket.save()
    }
}