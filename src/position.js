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
    return {getX, getY}
}

export default Position