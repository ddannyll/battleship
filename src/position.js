const Position = (x, y) => {
    const checkInput = (...args) => {
        args.forEach((arg) => {
            if (!(Number.isInteger(arg))) {
                throw new TypeError("Integer is expected for coordinate values")
            }
        })
    }

    checkInput(x, y)

    const getX = () => { return x }
    const getY = () => { return y }
    const add = (position) => {
        return Position(position.getX() + x, position.getY() + y)
    }
    return {getX, getY, add}
}

export default Position