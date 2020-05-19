class TicTacToe
    @PLAYER_X = "player x"
    @PLAYER_O = "player o"
    @GAME_STATUS = 
        IN_PROGRESS: "in progress"
        ENDED_WITH_DRAW: "ended with draw"
        ENDED_WITH_WINNER: "ended with winner"
    @MOVE_STATUS = 
        MOVE_INVALID: "move invalid"
        MOVE_COMPLETED: "move completed"
    @WINNING_POSITIONS = [
        [0, 1, 2]
        [3, 4, 5] 
        [6, 7, 8] 
        [0, 3, 6] 
        [1, 4, 7] 
        [2, 5, 8] 
        [0, 4, 8]
        [2, 4, 6]
    ]

    startGame: (initialTurn = TicTacToe.PLAYER_X) ->
        @board = [
            null, null, null
            null, null, null
            null, null, null
        ]
        @turn = initialTurn
        @status = TicTacToe.GAME_STATUS.IN_PROGRESS
        @winner = null
        return

    constructor: () ->
        @startGame()
        return

    checkForWinner: () ->
        currentWinner = ([@board[i], @board[j], @board[k]] for [i, j, k] in TicTacToe.WINNING_POSITIONS)
        currentWinner = ((if position.every((cell)=>cell is position[0]) then position[0] else null) for position in currentWinner)
        if (TicTacToe.PLAYER_X in currentWinner)
            @status = TicTacToe.GAME_STATUS.ENDED_WITH_WINNER
            @winner = TicTacToe.PLAYER_X
            return
        if (TicTacToe.PLAYER_O in currentWinner)
            @status = TicTacToe.GAME_STATUS.ENDED_WITH_WINNER
            @winner = TicTacToe.PLAYER_O
            return
        unless (@board.some((cell) => cell is null))
            @status = TicTacToe.GAME_STATUS.ENDED_WITH_DRAW
            return 
        return

    playChance: (cell) ->
        if (@board[cell] isnt null)
            return TicTacToe.MOVE_STATUS.MOVE_INVALID
        @board[cell] = @turn
        @turn = if @turn is TicTacToe.PLAYER_X then TicTacToe.PLAYER_O else TicTacToe.PLAYER_X
        @checkForWinner()
        return TicTacToe.MOVE_STATUS.MOVE_COMPLETED

game = new TicTacToe

$ = (element) -> 
    document.querySelector element

createSVGElement = (element, attrs) ->
    el = document.createElementNS "http://www.w3.org/2000/svg", element
    for attr, value of attrs
        el.setAttributeNS null, attr, value
    return el

movesGroup = $ "#moves"

drawCell = (cell, player) ->
    if (game.turn is TicTacToe.PLAYER_X)
        movesGroup.appendChild createSVGElement "circle",
            r: 60
            cx: ((cell % 3)*200) + 100
            cy: ((cell // 3)*200) + 100
            opacity: 1
            fill: "none"
            stroke: '#ff1744'
            'stroke-width': 30
    else
        movesGroup.appendChild createSVGElement "line",
            x1: ((cell % 3)*200) + 40
            x2: ((cell % 3)*200) + 160
            y1: ((cell // 3)*200) + 40
            y2: ((cell // 3)*200) + 160
            opacity: 1
            fill: "none"
            stroke: '#2979ff'
            'stroke-width': 30
        movesGroup.appendChild createSVGElement "line",
            x2: ((cell % 3)*200) + 40
            x1: ((cell % 3)*200) + 160
            y1: ((cell // 3)*200) + 40
            y2: ((cell // 3)*200) + 160
            opacity: 1
            fill: "none"
            stroke: '#2979ff'
            'stroke-width': 30
    return

overlayGroup = $ "#overlay"

drawOverlay = (text) -> 
    overlayGroup.appendChild createSVGElement "rect",
        width: 600
        height: 600
        opacity: 0.75
        fill: "#ffffff"
    textEl = createSVGElement "text",
        x: '50%'
        y: '50%'
        class: "game-message"
        'dominant-baseline': "middle"
        'text-anchor': "middle"
        fill: "#000000"
    textEl.innerHTML = text
    overlayGroup.appendChild textEl

xPlayerIndicator = $ "#player-x-indicator"
oPlayerIndicator = $ "#player-o-indicator"

drawGame = () ->
    switch game.status
        when TicTacToe.GAME_STATUS.ENDED_WITH_DRAW then drawOverlay "Draw!"
        when TicTacToe.GAME_STATUS.ENDED_WITH_WINNER
            switch game.winner
                when TicTacToe.PLAYER_X then drawOverlay "X won!"
                when TicTacToe.PLAYER_O then drawOverlay "O won!"
        when TicTacToe.GAME_STATUS.IN_PROGRESS 
            switch game.turn
                when TicTacToe.PLAYER_X 
                    unless ((' ' + xPlayerIndicator.className + ' ').indexOf(' turn ') > -1)
                        xPlayerIndicator.className += " turn"
                    oPlayerIndicator.className = oPlayerIndicator.className.replace(/(?:^|\s)turn(?!\S)/, "")
                when TicTacToe.PLAYER_O
                    unless ((' ' + oPlayerIndicator.className + ' ').indexOf(' turn ') > -1)
                        oPlayerIndicator.className += " turn"
                    xPlayerIndicator.className = xPlayerIndicator.className.replace(/(?:^|\s)turn(?!\S)/, "")

restartGame = () ->
    game.startGame()
    movesGroup.innerHTML = ""
    overlayGroup.innerHTML = ""
    drawGame()

cellClicked = (n) -> 
    () -> 
        if (game.status is TicTacToe.GAME_STATUS.IN_PROGRESS)
            moveStatus = game.playChance n
            if (moveStatus is TicTacToe.MOVE_STATUS.MOVE_COMPLETED)
                drawCell(n)
                drawGame()
        return

cellsGroup = $ "#cells"

for cell in [0..8]
    cellsGroup.appendChild createSVGElement "rect",
        class: "cell"
        width: 200
        height: 200
        x: (cell % 3)*200
        y: (cell // 3)*200
        opacity: 0
    cellElement = $ "#cells .cell:nth-child(#{cell+1})"
    cellElement?.addEventListener "click", cellClicked cell    
    