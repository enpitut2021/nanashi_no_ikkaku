
const isProduction = process.env.NODE_ENV === 'production'

// デバッグ時のみ出力するlog/error

exports.log = (message, ...args) => {
    if (!isProduction) console.log(message, args)
}

exports.error = (err) => {
    if (!isProduction) console.error(err)
}

